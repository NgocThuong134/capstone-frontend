import React, { useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [visible, setVisible] = useState(false);
    const [forgotPassword, setForgotPassword] = useState(false);
    const [emailForReset, setEmailForReset] = useState('');

    const handleResetPassword = async (e) => {
        e.preventDefault();
        try {
            // Gọi API gửi email để reset mật khẩu
            await axios.post(`${server}/user/reset-password`, { email: emailForReset });
            toast.success('Email reset mật khẩu đã được gửi!');
            setForgotPassword(false); // Đóng ô nhập email sau khi gửi
        } catch (error) {
            console.error('Lỗi khi gửi email reset mật khẩu:', error);
            toast.error('Có lỗi xảy ra. Vui lòng thử lại.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        await axios
            .post(
                `${server}/user/login-user`,
                {
                    email,
                    password,
                },
                { withCredentials: true }
            )
            .then((res) => {
                toast.success("Đăng nhập thành công!");
                navigate("/");
                window.location.reload(true);
            })
            .catch((err) => {
                toast.error(err.response.data.message);
            });
    };

    return (
        <div className='min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
            <div className='sm:mx-auto sm:w-full sm:max-w-md'>
                <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                    Đăng Nhập Tài Khoản
                </h2>
            </div>
            <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
                <div className='bg-white py-8 px-4 shadow-lg rounded-xl sm:px-10'>
                    <form className='space-y-6' onSubmit={handleSubmit}>
                        {/* Email */}
                        <div>
                            <label htmlFor="email" className='block text-sm font-medium text-gray-700'>
                                Địa Chỉ Email
                            </label>
                            <div className='mt-1'>
                                <input
                                    type="email"
                                    name='email'
                                    autoComplete='email'
                                    required
                                    placeholder='Vui lòng nhập email hợp lệ'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
                                />
                            </div>
                        </div>
                        {/* Password */}
                        <div>
                            <label htmlFor="password" className='block text-sm font-medium text-gray-700'>
                                Mật Khẩu
                            </label>
                            <div className='mt-1 relative'>
                                <input
                                    type={visible ? "text" : "password"}
                                    name='password'
                                    autoComplete='current-password'
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
                                />
                                {visible ? (
                                    <AiOutlineEye
                                        className="absolute right-2 top-2 cursor-pointer text-gray-500 hover:text-gray-700"
                                        size={25}
                                        onClick={() => setVisible(false)}
                                    />
                                ) : (
                                    <AiOutlineEyeInvisible
                                        className="absolute right-2 top-2 cursor-pointer text-gray-500 hover:text-gray-700"
                                        size={25}
                                        onClick={() => setVisible(true)}
                                    />
                                )}
                            </div>
                        </div>
                        {/* Password end */}

                        <div className='flex items-center justify-between'>
                            <div className='flex items-center'>
                                <input
                                    type="checkbox"
                                    name="remember-me"
                                    id="remember-me"
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                />
                                <label
                                    htmlFor="remember-me"
                                    className="ml-2 block text-sm text-gray-900"
                                >
                                    Ghi Nhớ Tôi
                                </label>
                            </div>
                            <div className='text-sm'>
                                <button
                                    type="button"
                                    onClick={() => setForgotPassword(true)}
                                    className="font-medium text-blue-600 hover:text-blue-500"
                                >
                                    Quên mật khẩu?
                                </button>
                            </div>
                        </div>
                        <div>
                            <button
                                type='submit'
                                className='group relative w-full h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                            >
                                Gửi
                            </button>
                        </div>

                        <div className='flex items-center justify-center w-full'>
                            <h4 className='text-sm text-gray-600'>Chưa có tài khoản?</h4>
                            <Link to="/sign-up" className="text-blue-600 pl-2 text-sm hover:text-blue-500">
                                Đăng Ký
                            </Link>
                        </div>
                    </form>

                    {/* Ô nhập email cho chức năng quên mật khẩu */}
                    {forgotPassword && (
                        <form className='space-y-6 mt-6' onSubmit={handleResetPassword}>
                            <div>
                                <label htmlFor="reset-email" className='block text-sm font-medium text-gray-700'>
                                    Nhập địa chỉ email để reset mật khẩu
                                </label>
                                <div className='mt-1'>
                                    <input
                                        type="email"
                                        name='reset-email'
                                        required
                                        placeholder='Vui lòng nhập email'
                                        value={emailForReset}
                                        onChange={(e) => setEmailForReset(e.target.value)}
                                        className='appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
                                    />
                                </div>
                            </div>
                            <div>
                                <button
                                    type='submit'
                                    className='group relative w-full h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                                >
                                    Gửi Email Đặt Lại Mật Khẩu
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Login;