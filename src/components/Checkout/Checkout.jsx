import React, { useState, useEffect } from "react";
import styles from "../../styles/styles";
import { Country, State } from "country-state-city";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { server } from "../../server";
import { toast } from "react-toastify";
import Select from 'react-select';
import OtpVerification from "../Payment/OtpVerification";

const Checkout = () => {
    const { user } = useSelector((state) => state.user);
    const { cart } = useSelector((state) => state.cart);
    const [country, setCountry] = useState("vn");
    const [city, setCity] = useState("");
    const [userInfo, setUserInfo] = useState(false);
    const [address, setAddress] = useState(""); // Gộp địa chỉ vào một trường
    const [zipCode, setZipCode] = useState(null);
    const [couponCode, setCouponCode] = useState("");
    const [couponCodeData, setCouponCodeData] = useState(null);
    const [discountPrice, setDiscountPrice] = useState(null);
    const [isOtpVerified, setIsOtpVerified] = useState(false);
    const [isPaymentInitiated, setIsPaymentInitiated] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);
    const handleOtpSuccess = () => {
        setIsOtpVerified(true);
        paymentSubmit(); // Gọi hàm paymentSubmit sau khi OTP đã được xác minh
    };

    const handlePaymentClick = () => {
        if (address === "" || zipCode === null || country === "" || city === "") {
            toast.error("Vui lòng chọn địa chỉ giao hàng!"); }
            else
        setIsPaymentInitiated(true); // Cập nhật trạng thái khi nhấn nút thanh toán
    };

    const paymentSubmit = () => {
        if (address === "" || zipCode === null || country === "" || city === "") {
            toast.error("Vui lòng chọn địa chỉ giao hàng!");
        } else {
            const shippingAddress = {
                address,
                zipCode,
                country,
                city,
            };

            const orderData = {
                cart,
                totalPrice,
                subTotalPrice,
                shipping,
                discountPrice,
                shippingAddress,
                user,
            };

            localStorage.setItem("latestOrder", JSON.stringify(orderData));
            navigate("/payment");
        }
    };

    const subTotalPrice = cart.reduce(
        (acc, item) => acc + item.qty * item.discountPrice,
        0
    );

    const shipping = subTotalPrice * 0.1; // 10%
    const formatPrice = (price) => {
        return price ? (price.toLocaleString('vi-VN') + " đ") : "0 đ";
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        const name = couponCode;
    
        try {
            const res = await axios.get(`${server}/coupon/get-coupon-value/${name}`);
            const coupon = res.data.couponCode;
    
            if (coupon) {
                const { shopId, value, minAmount, maxAmount, selectedProduct } = coupon;
    
                // Kiểm tra xem có sản phẩm nào từ cửa hàng tương ứng không
                const isCouponValid = cart.filter((item) => item.shopId === shopId);
                if (isCouponValid.length === 0) {
                    toast.error("Mã giảm giá không hợp lệ cho cửa hàng này");
                    setCouponCode("");
                    return;
                }
               
                // Kiểm tra sản phẩm được chỉ định (nếu có)
                if (selectedProduct && !isCouponValid.some(item => item._id === selectedProduct)) {
                    toast.error("Mã giảm giá không áp dụng cho sản phẩm này");
                    setCouponCode("");
                    return;
                }
    
                // Tính tổng giá trị của các sản phẩm đủ điều kiện
                const eligibleItems = isCouponValid.filter(item => item._id === selectedProduct);
                const eligiblePrice = eligibleItems.reduce(
                    (acc, item) => acc + item.qty * item.discountPrice,
                    0
                );
    
                // Kiểm tra giá trị tối thiểu và tối đa
                if (eligiblePrice < minAmount) {
                    toast.error(`Giá trị đơn hàng tối thiểu để sử dụng mã giảm giá là ${formatPrice(minAmount)} đ`);
                    setCouponCode("");
                    return;
                }
                if (maxAmount && eligiblePrice > maxAmount) {
                    toast.error(`Giá trị đơn hàng tối đa để sử dụng mã giảm giá là ${formatPrice(maxAmount)} đ`);
                    setCouponCode("");
                    return;
                }
    
                // Tính giá trị giảm giá
                const discountPrice = (eligiblePrice * value) / 100;
    
                // Cập nhật trạng thái
                setDiscountPrice(discountPrice);
                setCouponCodeData(coupon);
                setCouponCode("");
            } else {
                toast.error("Mã giảm giá không tồn tại!");
                setCouponCode("");
            }
        } catch (error) {
            console.error("Error fetching coupon value:", error);
            toast.error("Đã xảy ra lỗi trong quá trình sử dụng mã giảm giá!");
            setCouponCode("");
        }
    };
    const discountPercentage = couponCodeData ? discountPrice : "";

    const totalPrice = couponCodeData
        ? (subTotalPrice + shipping - discountPercentage)
        : (subTotalPrice + shipping);

    return (
        <div className="w-full flex flex-col items-center py-8">
            <div className="w-[90%] 1000px:w-[70%] block 800px:flex">
                <div className="w-full 800px:w-[65%]">
                    <ShippingInfo
                        user={user}
                        country={country}
                        setCountry={setCountry}
                        city={Number(city)}
                        setCity={setCity}
                        userInfo={userInfo}
                        setUserInfo={setUserInfo}
                        address={address}
                        setAddress={setAddress}
                        zipCode={zipCode}
                        setZipCode={setZipCode}
                    />
                </div>
                <div className="w-full 800px:w-[35%] 800px:mt-0 mt-8">
                    <CartData
                        handleSubmit={handleSubmit}
                        totalPrice={totalPrice}
                        shipping={shipping}
                        subTotalPrice={subTotalPrice}
                        couponCode={couponCode}
                        setCouponCode={setCouponCode}
                        discountPercentage={discountPercentage}
                    />
                </div>
            </div>
            <div>
            <div
                className={`${styles.button} bg-red w-[150px] 800px:w-[280px] mt-10`}
                onClick={handlePaymentClick}
            >
                <h5 className="text-white font-bold">Tiến hành thanh toán</h5>
            </div>

            {isPaymentInitiated && !isOtpVerified && (
                <OtpVerification email={user.email} onSuccess={handleOtpSuccess} />
            )}
        </div>
        </div>
    );
};

const ShippingInfo = ({
    user,
    country,
    setCountry,
    city,
    setCity,
    userInfo,
    setUserInfo,
    address,
    setAddress,
    zipCode,
    setZipCode,
}) => {
    const [provinces, setProvinces] = useState([]);
    const [selectedAddressIndex, setSelectedAddressIndex] = useState(null); // State để theo dõi checkbox được chọn
    useEffect(() => {
        axios.get('https://provinces.open-api.vn/api/p/')
            .then((res) => {
                setProvinces(res.data);
            })
            .catch((err) => {
                console.error("Error fetching provinces:", err);
            });
    }, []);
    return (
        <div className="w-full 800px:w-[95%] bg-white rounded-md p-5 pb-8">
            <h5 className="text-[18px] font-[500]">Địa chỉ giao hàng</h5>
            <br />
            <form>
                <div className="w-full flex pb-3">
                    <div className="w-[50%]">
                        <label className="block pb-2">Họ và tên</label>
                        <input
                            type="text"
                            value={user && user.name}
                            required
                            className={`${styles.input} !w-[95%]`}
                        />
                    </div>
                    <div className="w-[50%]">
                        <label className="block pb-2">Email</label>
                        <input
                            type="email"
                            value={user && user.email}
                            required
                            className={`${styles.input}`}
                        />
                    </div>
                </div>

                <div className="w-full flex pb-3">
                    <div className="w-[50%]">
                        <label className="block pb-2">Số điện thoại</label>
                        <input
                            type="number"
                            required
                            value={user && user.phoneNumber}
                            className={`${styles.input} !w-[95%]`}
                        />
                    </div>
                    <div className="w-[50%]">
                        <label className="block pb-2">Mã bưu điện</label>
                        <input
                            type="number"
                            value={zipCode}
                            onChange={(e) => setZipCode(e.target.value)}
                            required
                            className={`${styles.input}`}
                        />
                    </div>
                </div>

                <div className="w-full flex pb-3">
                    <div className="w-[50%]">
                        <label className="block pb-2">Quốc gia</label>
                        <select
                            className="w-[95%] border h-[40px] rounded-[5px]"
                            value={"VN"}
                            onChange={(e) => setCountry(e.target.value)}
                        >
                            <option value="">Chọn quốc gia của bạn</option>
                            {Country &&
                                Country.getAllCountries().map((item) => (
                                    <option key={item.isoCode} value={item.isoCode}>
                                        {item.name}
                                    </option>
                                ))}
                        </select>
                    </div>
                    <div className="w-[50%]">
    <label className="block text-sm font-medium text-gray-700">Tỉnh/Thành phố</label>
    <Select
        options={provinces.map((province) => ({
            value: province.code,
            label: province.name,
        }))}
        onChange={(selectedOption) => {
            setCity(selectedOption.value); // Chuyển đổi sang kiểu number
        }}
        placeholder="Chọn Tỉnh/Thành phố"
        className="mt-3"
    />
</div>
                </div>

                <div className="w-full flex pb-3">
                    <div className="w-full">
                        <label className="block pb-2">Địa chỉ</label>
                        <input
                            type="text"
                            required
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            className={`${styles.input} !w-[95%]`}
                        />
                    </div>
                </div>
            </form>
            <h5
                className="text-[18px] cursor-pointer inline-block text-blue-300"
                onClick={() => setUserInfo(!userInfo)}
            >
                Chọn từ địa chỉ đã lưu
            </h5>
            {userInfo && (
                <div>
                    {user.addresses.map((item, index) => (
                        <div className="w-full flex mt-1" key={index}>
                            <input
                                type="checkbox"
                                className="mr-3"
                                checked={selectedAddressIndex === index} // Kiểm tra checkbox nào được chọn
                                onChange={() => {
                                    setSelectedAddressIndex(index); // Cập nhật index của checkbox được chọn
                                    setAddress(item.address);
                                    setZipCode(item.zipCode);
                                    setCountry(item.country);
                                    setCity(item.city);
                                }}
                            />
                            <h2>{item.addressType}</h2>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const CartData = ({
    handleSubmit,
    totalPrice,
    shipping,
    subTotalPrice,
    couponCode,
    setCouponCode,
    discountPercentage,
}) => {
    const formatPrice = (price) => {
        return price ? (price.toLocaleString('vi-VN') + " đ") : "0 đ";
    };

    return (
        <div className="w-full bg-[#fff] rounded-md p-5 pb-8">
            <div className="flex justify-between">
                <h3 className="text-[16px] font-[400] text-[#000000a4]">Tổng giá:</h3>
                <h5 className="text-[18px] font-[600]">{formatPrice(subTotalPrice)}</h5>
            </div>
            <br />
            <div className="flex justify-between">
                <h3 className="text-[16px] font-[400] text-[#000000a4]">Phí giao hàng:</h3>
                <h5 className="text-[18px] font-[600]">{formatPrice(shipping)}</h5>
            </div>
            <br />
            <div className="flex justify-between border-b pb-3">
                <h3 className="text-[16px] font-[400] text-[#000000a4]">Giảm giá:</h3>
                <h5 className="text-[18px] font-[600]">
                    - {discountPercentage ? formatPrice(discountPercentage) : null}
                </h5>
            </div>
            <h5 className="text-[18px] font-[600] text-end pt-3">{formatPrice(totalPrice)}</h5>
            <br />
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    className={`${styles.input} h-[40px] pl-2`}
                    placeholder="Mã giảm giá"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    required
                />
                <input
                    className={`w-full h-[40px] border border-[#f63b60] text-center text-[#f63b60] rounded-[3px] mt-8 cursor-pointer`}
                    required
                    value="Áp dụng mã"
                    type="submit"
                />
            </form>
        </div>
    );
};

export default Checkout;