import React, { useEffect, useState } from 'react'
import { backend_url, server } from "../../server";
import { useDispatch, useSelector } from 'react-redux';
import {
    deleteUserAddress,
    loadUser,
    updatUserAddress,
    updateUserInformation,
} from "../../redux/actions/user";
import { AiOutlineArrowRight, AiOutlineCamera, AiOutlineDelete } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import styles from "../../styles/styles";
import { DataGrid } from "@material-ui/data-grid";
import { Button } from "@material-ui/core";
import { RxCross1 } from 'react-icons/rx'
import { MdTrackChanges } from "react-icons/md";
import { toast } from "react-toastify";
import axios from 'axios';
import Select from 'react-select';
import { getAllOrdersOfUser } from '../../redux/actions/order';
import UserInbox from '../../pages/UserInbox';
import AllOrders from './AllOrder';
import Swal from 'sweetalert2';


const ProfileContent = ({ active }) => {
    const { user, error, successMessage } = useSelector((state) => state.user);
    const [name, setName] = useState(user && user.name);
    const [email, setEmail] = useState(user && user.email);
    const [phoneNumber, setPhoneNumber] = useState(user && user.phoneNumber);
    const [password, setPassword] = useState("");
    const [avatar, setAvatar] = useState(null);

    const dispatch = useDispatch();


    useEffect(() => {
        if (error) {
            toast.error(error);
            dispatch({ type: "clearErrors" });
        }
        if (successMessage) {
            toast.success(successMessage);
            dispatch({ type: "clearMessages" });
        }
    }, [error, successMessage]);


    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(updateUserInformation(name, email, phoneNumber, password));
    }

    // Image update
    const handleImage = async (e) => {
        const file = e.target.files[0];
        setAvatar(file);

        const formData = new FormData();

        formData.append("image", e.target.files[0]);

        await axios
            .put(`${server}/user/update-avatar`, formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                withCredentials: true,
            })
            .then((response) => {
                dispatch(loadUser());
                toast.success("Cập nhật ảnh đại diện thành công!");
            })
            .catch((error) => {
                toast.error(error);
            });
    };


    return (
        <div className='w-full p-6 bg-gray-50'>
            {/* Hồ sơ */}
            {active === 1 && (
                <>
                    <div className="flex justify-center w-full mb-6">
                        <div className='relative'>
                            <img
                                src={`${backend_url}${user?.avatar}`}
                                className="w-[150px] h-[150px] rounded-full object-cover border-4 border-green-500 shadow-lg"
                                alt="profile img"
                            />
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center cursor-pointer absolute bottom-1 right-1 transition-transform duration-200 hover:scale-110">
                                <input
                                    type="file"
                                    id="image"
                                    className="hidden"
                                    onChange={handleImage}
                                />
                                <label htmlFor="image" className="cursor-pointer">
                                    <AiOutlineCamera className="text-gray-600" />
                                </label>
                            </div>
                        </div>
                    </div>
    
                    <div className='w-full px-5'>
                        <form onSubmit={handleSubmit} aria-required={true}>
                            <div className='w-full flex flex-col md:flex-row pb-4'>
                                <div className='w-full md:w-1/2 pr-2'>
                                    <label className='block pb-2 font-semibold text-gray-700'>Họ và Tên</label>
                                    <input
                                        type="text"
                                        className={`${styles.input} w-full mb-4 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                </div>
    
                                <div className='w-full md:w-1/2 pl-2'>
                                    <label className='block pb-2 font-semibold text-gray-700'>Địa Chỉ Email</label>
                                    <input
                                        type="email"
                                        className={`${styles.input} w-full mb-4 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                </div>
                            </div>
    
                            <div className="w-full flex flex-col md:flex-row pb-4">
                                <div className="w-full md:w-1/2 pr-2">
                                    <label className="block pb-2 font-semibold text-gray-700">Số Điện Thoại</label>
                                    <input
                                        type="tel"
                                        className={`${styles.input} w-full mb-4 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                        required
                                        value={phoneNumber}
                                        onChange={(e) => setPhoneNumber(e.target.value)}
                                    />
                                </div>
    
                                <div className="w-full md:w-1/2 pl-2">
                                    <label className="block pb-2 font-semibold text-gray-700">Nhập Mật Khẩu</label>
                                    <input
                                        type="password"
                                        className={`${styles.input} w-full mb-4 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                </div>
                            </div>
    
                            <button
                                className="w-64 h-10 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                                type="submit"
                            >
                                Cập Nhật
                            </button>
                        </form>
                    </div>
                </>
            )}
    
            {/* Đơn hàng */}
            {active === 2 && (
                <div>
                    <AllOrders />
                </div>
            )}
    
            {/* Hoàn tiền */}
            {active === 3 && (
                <div>
                    <AllRefundOrders />
                </div>
            )}
    
            {/* Hộp thư */}
            {active === 4 && (
                <div>
                    <UserInbox />
                </div>
            )}
    
            {/* Theo dõi đơn hàng */}
            {active === 5 && (
                <div>
                    <TrackOrder />
                </div>
            )}
    
            {/* Đổi mật khẩu */}
            {active === 6 && (
                <div>
                    <ChangePassword />
                </div>
            )}
    
            {/* Địa chỉ người dùng */}
            {active === 7 && (
                <div>
                    <Address />
                </div>
            )}
        </div>
    )
            }
        // Hàm định dạng số tiền
const formatCurrency = (amount) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " đ";
};
// Refund page

const AllRefundOrders = () => {
    const { user } = useSelector((state) => state.user);
    const { orders } = useSelector((state) => state.order);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllOrdersOfUser(user._id));
    }, [dispatch, user._id]);

    const eligibleOrders = orders?.filter((item) => item.status === "Đang xử lý hoàn tiền");

    const columns = [
        { field: "id", headerName: "Mã đơn hàng", minWidth: 150, flex: 0.7 },
        {
            field: "status",
            headerName: "Trạng thái",
            minWidth: 130,
            flex: 0.7,
            cellClassName: (params) => {
                return params.getValue(params.id, "status") === "Đã Giao"
                    ? "greenColor"
                    : "redColor";
            },
        },
        {
            field: "itemsQty",
            headerName: "Số lượng",
            type: "number",
            minWidth: 130,
            flex: 0.7,
        },
        {
            field: "total",
            headerName: "Tổng",
            type: "number",
            minWidth: 130,
            flex: 0.8,
        },
        {
            field: " ",
            flex: 1,
            minWidth: 150,
            headerName: "",
            type: "number",
            sortable: false,
            renderCell: (params) => {
                return (
                    <Link to={`/user/order/${params.id}`}>
                        <Button variant="contained" color="primary">
                            <AiOutlineArrowRight size={20} />
                        </Button>
                    </Link>
                );
            },
        },
    ];

    const rows = eligibleOrders?.map((item) => ({
        id: item._id,
        itemsQty: item.cart.length,
        total: item.totalPrice + " đ",
        status: item.status === "Đang xử lý hoàn tiền" ? "Đang xử lý hoàn tiền" : item.status,
    }));

    return (
        <div className="pl-8 pt-1">
            <h2 className="text-2xl font-bold mb-4">Danh Sách Đơn Hoàn Tiền</h2>
            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={10}
                autoHeight
                disableSelectionOnClick
                getRowClassName={(params) =>
                    params.getValue(params.id, "status") === "Đang xử lý hoàn tiền"
                        ? "bg-yellow-100"
                        : ""
                }
            />
        </div>
    );
};

const TrackOrder = () => {
    const { user } = useSelector((state) => state.user);
    const { orders } = useSelector((state) => state.order);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllOrdersOfUser(user._id));
    }, [dispatch, user._id]);

    const columns = [
        { field: "id", headerName: "Mã đơn hàng", minWidth: 150, flex: 0.7 },
        {
            field: "status",
            headerName: "Trạng thái",
            minWidth: 150,
            flex: 0.7,
            cellClassName: (params) => {
                return params.getValue(params.id, "status") === "Đã giao"
                    ? "greenColor"
                    : "redColor";
            },
        },
        {
            field: "itemsQty",
            headerName: "Số lượng",
            type: "number",
            minWidth: 130,
            flex: 0.7,
        },
        {
            field: "total",
            headerName: "Tổng",
            type: "number",
            minWidth: 130,
            flex: 0.8,
        },
        {
            field: " ",
            flex: 1,
            minWidth: 150,
            headerName: "",
            type: "number",
            sortable: false,
            renderCell: (params) => {
                return (
                    <Link to={`/user/track/order/${params.id}`}>
                        <Button variant="contained" color="primary">
                            <MdTrackChanges size={20} />
                        </Button>
                    </Link>
                );
            },
        },
    ];

    const rows = orders?.map((item) => ({
        id: item._id,
        itemsQty: item.cart.length,
        total: formatCurrency(item.totalPrice), // Định dạng số tiền
        status: item.status,
    }));

    return (
        <div className="pl-8 pt-1">
            <h2 className="text-2xl font-bold mb-4">Theo Dõi Đơn Hàng</h2>
            <DataGrid
                rows={rows}
                columns={columns}
                pageSize={10}
                autoHeight
                disableSelectionOnClick
                getRowClassName={(params) =>
                    params.getValue(params.id, "status") === "Đã giao"
                        ? "bg-green-100"
                        : "bg-red-100"
                }
            />
        </div>
    );
};


const ChangePassword = () => {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);

    const passwordChangeHandler = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (newPassword !== confirmPassword) {
            toast.error("Mật khẩu mới và xác nhận không khớp.");
            setLoading(false);
            return;
        }

        try {
            const res = await axios.put(
                `${server}/user/update-user-password`,
                { oldPassword, newPassword, confirmPassword },
                { withCredentials: true }
            );
            toast.success("Mật khẩu đã được cập nhật.");
            setOldPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error) {
            toast.error(error.response?.data?.message || "Đã xảy ra lỗi.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='w-full px-5'>
            <h1 className='text-[25px] text-center font-bold text-[#000000ba] pb-4'>
                Đổi Mật Khẩu
            </h1>
            <div className='w-full max-w-md mx-auto'>
                <form
                    onSubmit={passwordChangeHandler}
                    className="flex flex-col items-center"
                >
                    <div className="w-full mt-5">
                        <label className='block pb-2'>Nhập Mật Khẩu Cũ</label>
                        <input
                            type="password"
                            className={`${styles.input} !w-full mb-4`}
                            required
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                        />
                    </div>

                    <div className="w-full mt-2">
                        <label className='block pb-2'>Nhập Mật Khẩu Mới</label>
                        <input
                            type="password"
                            className={`${styles.input} !w-full mb-4`}
                            required
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>

                    <div className="w-full mt-2">
                        <label className="block pb-2">Xác Nhận Mật Khẩu Mới</label>
                        <input
                            type="password"
                            className={`${styles.input} !w-full mb-4`}
                            required
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        className={`w-full h-[40px] bg-[#3a24db] text-white rounded-md mt-4 ${loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                        disabled={loading}
                    >
                        {loading ? "Đang Cập Nhật..." : "Cập Nhật"}
                    </button>
                </form>
            </div>
        </div>
    );
};
const Address = () => {
    const [open, setOpen] = useState(false);
    const [country, setCountry] = useState("VN");
    const [city, setCity] = useState("");
    const [district, setDistrict] = useState("");
    const [ward, setWard] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [address, setAddress] = useState("");
    const [addressType, setAddressType] = useState("");
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [addressSuggestions, setAddressSuggestions] = useState([]);

    const { user } = useSelector((state) => state.user);
    const dispatch = useDispatch();

    const addressTypeData = [
        { name: "Mặc định" },
        { name: "Nhà" },
        { name: "Văn phòng" },
    ];

    // Fetch provinces data
    useEffect(() => {
        axios.get('https://provinces.open-api.vn/api/p/')
            .then((res) => {
                setProvinces(res.data);
            })
            .catch((err) => {
                console.error("Error fetching provinces:", err);
            });
    }, []);

    // Fetch districts data based on selected province
    useEffect(() => {
        if (city) {
            axios.get(`https://provinces.open-api.vn/api/p/${city}?depth=2`)
                .then((res) => {
                    setDistricts(res.data.districts);
                })
                .catch((err) => {
                    console.error("Error fetching districts:", err);
                });
        }
    }, [city]);

    // Fetch wards data based on selected district
    useEffect(() => {
        if (district) {
            axios.get(`https://provinces.open-api.vn/api/d/${district}?depth=2`)
                .then((res) => {
                    setWards(res.data.wards);
                })
                .catch((err) => {
                    console.error("Error fetching wards:", err);
                });
        }
    }, [district]);



    const fetchAddressSuggestions = async (query, city, district, ward) => {
        // Xây dựng câu truy vấn đầy đủ
        let fullQuery = query;
        
        // Thêm các thông tin địa lý nếu có
        if (ward) fullQuery += `, ${ward}`;
        if (district) fullQuery += `, ${district}`;
        if (city) fullQuery += `, ${city}`;
    
    
        try {
            const response = await axios.get(
                `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(fullQuery)}&countrycodes=vn&limit=5`
            );
            setAddressSuggestions(response.data);
        
        } catch (error) {
            console.error("Error fetching address suggestions:", error);
        }
    };
    // Handle address input change
    const handleAddressChange = (e) => {
        const value = e.target.value;
        
        setAddress(value);
        if (value.length > 2) {
            fetchAddressSuggestions(value);
        } else {
            setAddressSuggestions([]);
        }
    };

    // Handle address selection from suggestions
    const handleAddressSelect = (suggestion) => {
        setAddress(suggestion.display_name);
        setAddressSuggestions([]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!addressType || !country || !city || !district || !ward || !address) {
            toast.error("Vui lòng điền đầy đủ thông tin!");
            return;
        }
        const parsedZipCode = parseInt(zipCode);

        dispatch(
            updatUserAddress(
                country,
                city,
                district,
                ward,
                address,
                parsedZipCode,
                addressType
            )
        );

        setOpen(false);
        setCountry("VN");
        setCity("");
        setDistrict("");
        setWard("");
        setAddress("");
        setZipCode("");
        setAddressType("");
    };
    
    // Hàm xóa địa chỉ
    const handleDelete = (item) => {
        const id = item._id;
    
        // Hiển thị hộp thoại xác nhận
        Swal.fire({
            title: 'Bạn có chắc chắn muốn xóa địa chỉ này?',
            text: "Hành động này không thể phục hồi!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Có, xóa!',
            cancelButtonText: 'Hủy'
        }).then((result) => {
            if (result.isConfirmed) {
                // Nếu xác nhận, dispatch hành động xóa
                dispatch(deleteUserAddress(id));
                Swal.fire(
                    'Đã xóa!',
                    'Địa chỉ của bạn đã được xóa.',
                    'success'
                );
            }
        });
    };
    return (
        <div className='w-full px-5'>
            {open && (
                <div className="fixed w-full h-screen bg-[#0000004b] top-0 left-0 flex items-center justify-center">
                    <div className="w-[35%] h-[80vh] bg-white rounded-lg shadow-lg relative overflow-y-scroll">
                        <div className="w-full flex justify-end p-3">
                            <RxCross1
                                size={30}
                                className="cursor-pointer text-gray-600 hover:text-gray-800"
                                onClick={() => setOpen(false)}
                            />
                        </div>
                        <h1 className="text-center text-2xl font-bold text-gray-800">Thêm Địa Chỉ Mới</h1>
                        <form onSubmit={handleSubmit} className="w-full p-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Quốc Gia</label>
                                <input
                                    type="text"
                                    value="Việt Nam"
                                    disabled
                                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Tỉnh/Thành Phố</label>
                                <Select
                                    options={provinces.map((province) => ({
                                        value: province.code,
                                        label: province.name,
                                    }))}
                                    onChange={(selectedOption) => setCity(selectedOption.value)}
                                    placeholder="Chọn Tỉnh/Thành Phố"
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Quận/Huyện</label>
                                <Select
                                    options={districts.map((district) => ({
                                        value: district.code,
                                        label: district.name,
                                    }))}
                                    onChange={(selectedOption) => setDistrict(selectedOption.value)}
                                    placeholder="Chọn Quận/Huyện"
                                    className="mt-1"
                                    isDisabled={!city}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Phường/Xã</label>
                                <Select
                                    options={wards.map((ward) => ({
                                        value: ward.code,
                                        label: ward.name,
                                    }))}
                                    onChange={(selectedOption) => setWard(selectedOption.value)}
                                    placeholder="Chọn Phường/Xã"
                                    className="mt-1"
                                    isDisabled={!district}
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Địa Chỉ</label>
                                <input
                                    type="text"
                                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                                    required
                                    value={address}
                                    onChange={handleAddressChange}
                                    placeholder="Nhập địa chỉ chi tiết"
                                />
                                {addressSuggestions.length > 0 && (
                                    <ul className="mt-2 border border-gray-300 rounded-md">
                                        {addressSuggestions.map((suggestion, index) => (
                                            <li
                                                key={index}
                                                className="p-2 hover:bg-gray-100 cursor-pointer"
                                                onClick={() => handleAddressSelect(suggestion)}
                                            >
                                                {suggestion.display_name}
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Mã Bưu Chính</label>
                                <input
                                    type="number"
                                    className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                                    value={zipCode}
                                    onChange={(e) => setZipCode(e.target.value)}
                                    placeholder="Nhập mã bưu chính"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Loại Địa Chỉ</label>
                                <Select
                                    options={addressTypeData.map((item) => ({
                                        value: item.name,
                                        label: item.name,
                                    }))}
                                    onChange={(selectedOption) => setAddressType(selectedOption.value)}
                                    placeholder="Chọn Loại Địa Chỉ"
                                    className="mt-1"
                                />
                            </div>

                            <div>
                                <button
                                    type="submit"
                                    className="w-full mt-5 p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                                >
                                    Thêm Địa Chỉ
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className='flex w-full items-center justify-between'>
                <h1 className='text-2xl font-bold text-gray-800'>Địa Chỉ Của Tôi</h1>
                <button
                    className="p-2 bg-blue-500 text-white rounded-md hover:bg-gray-800"
                    onClick={() => setOpen(true)}
                >
                    Thêm Mới
                </button>
            </div>

            <br />

            {user && user.addresses.length > 0 ? (
                user.addresses.map((item, index) => (
                    <div
                        className="w-full bg-white rounded-lg shadow-md p-4 mb-4 flex items-center justify-between"
                        key={index}
                    >
                        <div className="flex items-center space-x-4">
                            <h5 className="font-semibold text-gray-800">{item.addressType}</h5>
                            <p className="text-sm text-gray-600">
                                {item.address}
                            </p>
                        </div>
                        <AiOutlineDelete
                            size={25}
                            className="cursor-pointer text-red hover:scale-125"
                            onClick={() => handleDelete(item)}
                        />
                    </div>
                ))
            ) : (
                <h5 className="text-center pt-8 text-lg text-gray-600">
                    Bạn chưa có địa chỉ nào được lưu!
                </h5>
            )}
        </div>
    );
};

export default ProfileContent