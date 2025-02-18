import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { server } from '../../server';

const OtpVerification = ({ email, onSuccess }) => {
    const [otp, setOtp] = useState('');
    const [timer, setTimer] = useState(60);
    const [isTimerActive, setIsTimerActive] = useState(false);
    const [isOtpSent, setIsOtpSent] = useState(false);

    const sendOtp = async () => {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        const otpResponse = await axios.post(`${server}/user/send-otp`, { email }, config);

        if (otpResponse.data.success) {
            setIsOtpSent(true);
            setIsTimerActive(true);
            setTimer(60); // Reset timer to 60 seconds
        } else {
            toast.error("Không thể gửi mã OTP. Vui lòng thử lại.");
        }
    };

    useEffect(() => {
        let interval = null;
        if (isTimerActive && timer > 0) {
            interval = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);
        } else if (timer === 0) {
            setIsTimerActive(false);
        }
        return () => clearInterval(interval);
    }, [isTimerActive, timer]);

    const verifyOtp = async () => {
        const config = {
            headers: {
                "Content-Type": "application/json",
            },
        };

        
        try {
            const verifyResponse = await axios.post(`${server}/user/verify-otp`, { email, otp }, config);
        
            if (verifyResponse.data.success) {
                toast.success(verifyResponse.data.message);
                onSuccess();
            } else {
                toast.error(verifyResponse.data.message);
            }
        } catch (error) {
            console.error("Error verifying OTP:", error);
        
            if (error.response && error.response.data) {
                toast.error(error.response.data.message || "Lỗi xác thực OTP.");
            } else {
                toast.error("Không thể kết nối đến server.");
            }
        }
        
        
    };

    return (
        <div className="flex flex-col items-center bg-gray-100 p-5 rounded-lg shadow-md">
            {!isOtpSent ? (
                <button
                    className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
                    onClick={sendOtp}
                >
                    Gửi mã OTP
                </button>
            ) : (
                <div className="flex flex-col items-center w-full">
                   <input
                        type="number"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        placeholder="Nhập mã OTP"
                        className="border border-gray-300 rounded-lg p-2 w-full mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        maxLength={6} // Giới hạn độ dài nếu cần thiết
                    />
                    <button
                        className="bg-green text-white font-bold py-2 px-4 rounded mt-2 hover:bg-green-600 transition duration-200"
                        onClick={verifyOtp}
                    >
                        Xác minh mã OTP
                    </button>
                    {isTimerActive ? (
                        <p className="mt-2 text-gray-700">{`Thời gian còn lại: ${timer}s`}</p>
                    ) : (
                        <button
                            className="bg-gray-400 text-white font-bold py-2 px-4 rounded mt-2 hover:bg-gray-500 transition duration-200"
                            onClick={sendOtp}
                            disabled={timer > 0}
                        >
                            Gửi lại mã OTP
                        </button>
                    )}
                </div>
            )}
        </div>
    );
};

export default OtpVerification;