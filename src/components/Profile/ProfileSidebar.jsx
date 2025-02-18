import React from "react";
import { AiOutlineLogin, AiOutlineMessage } from "react-icons/ai";
import { RiLockPasswordLine } from "react-icons/ri";
import { HiOutlineReceiptRefund, HiOutlineShoppingBag } from "react-icons/hi";
import { RxPerson } from "react-icons/rx";
import { Link, useNavigate } from "react-router-dom";
import {
  MdOutlineAdminPanelSettings,
  MdOutlineTrackChanges,
} from "react-icons/md";
import { TbAddressBook } from "react-icons/tb";
import { FaUserPlus } from "react-icons/fa";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const ProfileSidebar = ({ active, setActive }) => {
  const { isSeller } = useSelector((state) => state.seller);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  const logoutHandler = () => {
    axios
      .get(`${server}/user/logout`, { withCredentials: true })
      .then((res) => {
        toast.success(res.data.message);
        window.location.reload(true);
        navigate("/login");
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  const menuItems = [
    { icon: <RxPerson />, label: "Hồ Sơ", value: 1 },
    { icon: <HiOutlineShoppingBag />, label: "Đơn Hàng", value: 2 },
    { icon: <HiOutlineReceiptRefund />, label: "Hoàn Tiền", value: 3 },
    { icon: <AiOutlineMessage />, label: "Hộp Thư", value: 4 },
    { icon: <RiLockPasswordLine />, label: "Đổi Mật Khẩu", value: 6 },
    { icon: <TbAddressBook />, label: "Địa Chỉ", value: 7 },
  ];

  return (
    <div className="w-full bg-white shadow-lg rounded-lg p-6">
      <h2 className="text-xl font-bold mb-6 text-center">Thông Tin Tài Khoản</h2>
      {menuItems.map((item) => (
        <div
          key={item.value}
          className={`flex items-center cursor-pointer w-full mb-4 p-2 rounded-lg hover:bg-gray-100 transition duration-200 ${
            active === item.value ? "bg-gray-200" : ""
          }`}
          onClick={() => setActive(item.value)}
        >
          {React.cloneElement(item.icon, {
            size: 24,
            color: active === item.value ? "red" : "gray",
          })}
          <span
            className={`pl-3 ${
              active === item.value ? "text-red-600 font-semibold" : "text-gray-700"
            }`}
          >
            {item.label}
          </span>
        </div>
      ))}

      <div className="flex items-center cursor-pointer w-full mb-4 p-2 rounded-lg hover:bg-gray-100 transition duration-200">
        <Link to={`${isSeller ? "/dashboard" : "/shop-create"}`}>
          <h1 className="text-gray-800 flex items-center">
            <FaUserPlus size={24} />
            <span className="pl-3">
              {isSeller ? "Đi tới Bảng Điều Khiển" : "Trở Thành Người Bán"}
            </span>
          </h1>
        </Link>
      </div>

      {user && user.role === "Admin" && (
        <Link to="/admin/dashboard">
          <div
            className="flex items-center cursor-pointer w-full mb-4 p-2 rounded-lg hover:bg-gray-100 transition duration-200"
            onClick={() => setActive(8)}
          >
            <MdOutlineAdminPanelSettings
              size={24}
              color={active === 8 ? "red" : "gray"}
            />
            <span
              className={`pl-3 ${
                active === 8 ? "text-red-600 font-semibold" : "text-gray-700"
              }`}
            >
              Bảng Điều Khiển Admin
            </span>
          </div>
        </Link>
      )}

      <div
        className="flex items-center cursor-pointer w-full mb-4 p-2 rounded-lg hover:bg-gray-100 transition duration-200"
        onClick={logoutHandler}
      >
        <AiOutlineLogin size={24} color={active === 9 ? "red" : "gray"} />
        <span
          className={`pl-3 ${
            active === 9 ? "text-red-600 font-semibold" : "text-gray-700"
          }`}
        >
          Đăng Xuất
        </span>
      </div>
    </div>
  );
};

export default ProfileSidebar;