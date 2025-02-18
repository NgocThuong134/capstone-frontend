import React, { useState } from 'react';
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import styles from "../../styles/styles";
import { Link } from "react-router-dom";
import { RxAvatar } from "react-icons/rx";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";

const Signup = () => {
    const [email, setEmail] = useState("");
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [visible, setVisible] = useState(false);
    const [avatar, setAvatar] = useState(null);

    const handleFileInputChange = (e) => {
        const file = e.target.files[0];
        setAvatar(file);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const config = { headers: { "Content-Type": "multipart/form-data" } };
        const newForm = new FormData();
        newForm.append("file", avatar);
        newForm.append("name", name);
        newForm.append("email", email);
        newForm.append("password", password);

        axios
            .post(`${server}/user/create-user`, newForm, config)
            .then((res) => {
                toast.success(res.data.message);
                setName("");
                setEmail("");
                setPassword("");
                setAvatar(null);
            })
            .catch((error) => {
                toast.error(error.response.data.message);
            });
    }

    return (
        <div className='min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8'>
            <div className='sm:mx-auto sm:w-full sm:max-w-md'>
                <h2 className="mt-6 text-center text-4xl font-extrabold text-gray-900">
                    Đăng Ký Tài Khoản Mới
                </h2>
            </div>
            <div className='mt-8 sm:mx-auto sm:w-full sm:max-w-md'>
                <div className='bg-white py-8 px-6 shadow-md rounded-lg'>
                    <form className='space-y-6' onSubmit={handleSubmit}>
                        {/* Tên đầy đủ */}
                        <div>
                            <label htmlFor="name" className='block text-sm font-medium text-gray-700'>
                                Họ và tên
                            </label>
                            <div className='mt-1'>
                                <input
                                    type="text"
                                    name='name'
                                    required
                                    placeholder='Nhập tên của bạn'
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className='appearance-none block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                />
                            </div>
                        </div>

                        {/* Địa chỉ email */}
                        <div>
                            <label htmlFor="email" className='block text-sm font-medium text-gray-700'>
                                Địa chỉ email
                            </label>
                            <div className='mt-1'>
                                <input
                                    type="email"
                                    name='email'
                                    required
                                    placeholder='Nhập email hợp lệ'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className='appearance-none block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                />
                            </div>
                        </div>

                        {/* Mật khẩu */}
                        <div>
                            <label htmlFor="password" className='block text-sm font-medium text-gray-700'>
                                Mật khẩu
                            </label>
                            <div className='mt-1 relative'>
                                <input
                                    type={visible ? "text" : "password"}
                                    name='password'
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className='appearance-none block w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500'
                                />
                                {visible ? (
                                    <AiOutlineEye
                                        className="absolute right-2 top-3 cursor-pointer"
                                        size={25}
                                        onClick={() => setVisible(false)}
                                    />
                                ) : (
                                    <AiOutlineEyeInvisible
                                        className="absolute right-2 top-3 cursor-pointer"
                                        size={25}
                                        onClick={() => setVisible(true)}
                                    />
                                )}
                            </div>
                        </div>

                        {/* Ảnh đại diện */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Ảnh đại diện
                            </label>
                            <div className='mt-2 flex items-center'>
                                <span className='inline-block h-8 w-8 rounded-full overflow-hidden'>
                                    {avatar ? (
                                        <img
                                            src={URL.createObjectURL(avatar)}
                                            alt="avatar"
                                            className="h-full w-full object-cover rounded-full"
                                        />
                                    ) : (
                                        <RxAvatar className="h-8 w-8" />
                                    )}
                                </span>
                                <label htmlFor="file-input"
                                    className="ml-5 flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                                >
                                    <span>Tải lên ảnh</span>
                                    <input
                                        type="file"
                                        name='avatar'
                                        id='file-input'
                                        accept=".jpg,.jpeg,.png"
                                        onChange={handleFileInputChange}
                                        className="sr-only"
                                    />
                                </label>
                            </div>
                        </div>

                        <div>
                            <button
                                type='submit'
                                className='w-full h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500'
                            >
                                Đăng Ký
                            </button>
                        </div>

                        <div className='flex justify-between items-center'>
                            <h4 className='text-sm'>Đã có tài khoản?</h4>
                            <Link to="/login" className="text-blue-600 pl-2">
                                Đăng Nhập
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Signup;