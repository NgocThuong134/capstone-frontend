import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { backend_url, server } from "../../server";
import { AiOutlineCamera } from "react-icons/ai";
import styles from "../../styles/styles";
import axios from "axios";
import { loadSeller } from "../../redux/actions/user";
import { toast } from "react-toastify";

const ShopSettings = () => {
    const { seller } = useSelector((state) => state.seller);
    const [avatar, setAvatar] = useState();
    const [name, setName] = useState(seller?.name);
    const [description, setDescription] = useState(seller?.description || "");
    const [address, setAddress] = useState(seller?.address);
    const [phoneNumber, setPhoneNumber] = useState(seller?.phoneNumber);
    const [zipCode, setZipCode] = useState(seller?.zipCode);

    const dispatch = useDispatch();

    // Xử lý tải hình ảnh
    const handleImage = async (e) => {
        e.preventDefault();
        const file = e.target.files[0];
        setAvatar(file);

        const formData = new FormData();
        formData.append("image", file);

        try {
            await axios.put(`${server}/shop/update-shop-avatar`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
            });
            dispatch(loadSeller());
            toast.success("Cập nhật hình đại diện thành công!");
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    const updateHandler = async (e) => {
        e.preventDefault();

        try {
            await axios.put(`${server}/shop/update-seller-info`, {
                name,
                address,
                zipCode,
                phoneNumber,
                description,
            }, { withCredentials: true });
            toast.success("Thông tin cửa hàng đã được cập nhật thành công!");
            dispatch(loadSeller());
        } catch (error) {
            toast.error(error.response.data.message);
        }
    };

    return (
        <div className="w-full min-h-screen flex flex-col items-center bg-gray-50">
            <div className="flex w-full max-w-lg flex-col justify-center my-5 bg-white shadow-lg rounded-lg p-5">
                <div className="flex items-center justify-center">
                    <div className="relative">
                        <img
                            src={avatar ? URL.createObjectURL(avatar) : `${backend_url}/${seller.avatar}`}
                            alt=""
                            className="w-48 h-48 rounded-full object-cover border-2 border-gray-300"
                        />
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer absolute bottom-2 right-2">
                            <input
                                type="file"
                                id="image"
                                className="hidden"
                                onChange={handleImage}
                            />
                            <label htmlFor="image">
                                <AiOutlineCamera className="text-gray-600" />
                            </label>
                        </div>
                    </div>
                </div>

                {/* Biểu mẫu thông tin cửa hàng */}
                <form className="flex flex-col items-center mt-5" onSubmit={updateHandler}>
                    <div className="w-full flex flex-col items-start mb-4">
                        <label className="block pb-2">Tên Cửa Hàng</label>
                        <input
                            type="text"
                            placeholder="Nhập tên cửa hàng"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={`${styles.input} w-full`}
                            required
                        />
                    </div>
                    <div className="w-full flex flex-col items-start mb-4">
                        <label className="block pb-2">Mô Tả Cửa Hàng</label>
                        <input
                            type="text"
                            placeholder="Nhập mô tả cửa hàng"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className={`${styles.input} w-full`}
                        />
                    </div>
                    <div className="w-full flex flex-col items-start mb-4">
                        <label className="block pb-2">Địa Chỉ Cửa Hàng</label>
                        <input
                            type="text"
                            placeholder="Nhập địa chỉ cửa hàng"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className={`${styles.input} w-full`}
                            required
                        />
                    </div>
                    <div className="w-full flex flex-col items-start mb-4">
                        <label className="block pb-2">Số Điện Thoại Cửa Hàng</label>
                        <input
                            type="tel"
                            placeholder="Nhập số điện thoại"
                            value={phoneNumber}
                            onChange={(e) => setPhoneNumber(e.target.value)}
                            className={`${styles.input} w-full`}
                            required
                        />
                    </div>
                    <div className="w-full flex flex-col items-start mb-4">
                        <label className="block pb-2">Mã Bưu Điện</label>
                        <input
                            type="text"
                            placeholder="Nhập mã bưu điện"
                            value={zipCode}
                            onChange={(e) => setZipCode(e.target.value)}
                            className={`${styles.input} w-full`}
                            required
                        />
                    </div>
                    <div className="w-full flex items-center justify-center">
                        <input
                            type="submit"
                            value="Cập Nhật Cửa Hàng"
                            className={`${styles.input} w-full bg-blue-500 text-white cursor-pointer`}
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ShopSettings;