import React, { useEffect, useState } from "react";
import styles from "../../styles/styles";
import { BsFillBagFill } from "react-icons/bs";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { backend_url, server } from "../../server";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import { useDispatch, useSelector } from "react-redux";

const OrderDetails = () => {
  const { orders } = useSelector((state) => state.order);
  const { seller } = useSelector((state) => state.seller);
  const dispatch = useDispatch();

  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    dispatch(getAllOrdersOfShop(seller._id));
  }, [dispatch]);

  const data = orders && orders.find((item) => item._id === id);

  const orderUpdateHandler = async () => {
    await axios
      .put(
        `${server}/order/update-order-status/${id}`,
        { status },
        { withCredentials: true }
      )
      .then(() => {
        toast.success("Cập nhật đơn hàng thành công!");
        navigate("/dashboard-orders");
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  const refundOrderUpdateHandler = async () => {
    await axios
      .put(
        `${server}/order/order-refund-success/${id}`,
        { status },
        { withCredentials: true }
      )
      .then(() => {
        toast.success("Cập nhật đơn hàng thành công!");
        dispatch(getAllOrdersOfShop(seller._id));
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  return (
    <div className={`py-4 min-h-screen ${styles.section}`}>
      <div className="w=full flex items-center justify-between">
        <div className="flex items-center">
          <BsFillBagFill size={30} color="crimson" />
          <h1 className="pl-2 text-[25px]">Chi Tiết Đơn Hàng</h1>
        </div>
        <Link to="/dashboard-orders">
  <div
    className={`${styles.button} bg-[#fce1e6] rounded-[8px] text-[#e94560] font-bold w-[250px] h-[50px] text-[18px] flex items-center justify-center shadow-md transition-transform transform hover:scale-105`}
  >
    <span className="mr-2">📦</span> {/* Thêm biểu tượng */}
    Danh sách đơn hàng
  </div>
</Link>
      </div>

      <div className="w-full flex items-center justify-between pt-6">
        <h5 className="text-[#00000084]">
          Mã Đơn Hàng: <span>#{data?._id?.slice(0, 8)}</span>
        </h5>
        <h5 className="text-[#00000084]">
          Ngày Đặt: <span>{data?.createdAt?.slice(0, 10)}</span>
        </h5>
      </div>

      {/* Order Items */}
      <br />
      <br />
      {data &&
        data?.cart.map((item, index) => (
          <div className="w-full flex items-start mb-5" key={index}>
            <img
              src={`${backend_url}/${item.images[0]}`}
              alt="Sản phẩm trong đơn hàng"
              className="w-[80px] h-[80px]"
            />
            <div className="w-full">
              <h5 className="pl-3 text-[20px]">{item.name}</h5>
              <h5 className="pl-3 text-[20px] text-[#00000091]">
                {item.discountPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} đ x {item.qty}
              </h5>
            </div>
          </div>
        ))}
      <div className="border-t w-full text-right">
        <h5>
          Tổng Giá: <strong>{data?.totalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")} đ</strong>
        </h5>
      </div>
      <br />
      <br />

      {/* Shipping Address */}
      <div className="w-full 800px:flex items-center">
        <div className="w-full 800px:w-[60%]">
          <h4 className="pt-3 text-[20px] font-[600]">Địa Chỉ Giao Hàng:</h4>
          <h4 className="pt-3 text-[20px]">
            {data?.shippingAddress.address}
          </h4>
          <h4 className="text-[20px]">{data?.shippingAddress.country}</h4>
          <h4 className="text-[20px]">{data?.shippingAddress.city}</h4>
          <h4 className="text-[20px]">{data?.user?.phoneNumber}</h4>
        </div>

        <div className="w-full 800px:w-[40%]">
          <h4 className="pt-3 text-[20px]">Thông Tin Thanh Toán:</h4>
          <h4>
            Trạng Thái:{" "}
            {data?.paymentInfo?.status ? data?.paymentInfo?.status : "Chưa Thanh Toán"}
          </h4>
        </div>
      </div>
      <br />
      <br />

      <h4 className="pt-3 text-[20px] font-[600]">Trạng Thái Đơn Hàng:</h4>
      {data?.status !== "Đang Xử Lý Hoàn Tiền" && data?.status !== "Hoàn Tiền Thành Công" && (
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-[200px] mt-2 border h-[35px] rounded-[5px]"
        >
          {[
            "Đang xử lý",
            "Đã chuyển đến đối tác giao hàng",
            "Đang giao hàng",
            "Đã nhận",
            "Đang trên đường",
            "Đã giao",
          ]
            .slice(
              [
                "Đang xử lý",
                "Đã chuyển đến đối tác giao hàng",
                "Đang giao hàng",
                "Đã nhận",
                "Đang trên đường",
                "Đã giao",
              ].indexOf(data?.status)
            )
            .map((option, index) => (
              <option value={option} key={index}>
                {option}
              </option>
            ))}
        </select>
      )}

      {data?.status === "Đang xử lý hoàn tiền" || data?.status === "Hoàn tiền thành công" ? (
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className="w-[200px] mt-2 border h-[35px] rounded-[5px]"
        >
          {["Đang xử lý hoàn tiền", "Hoàn tiền thành công"]
            .slice(
              ["Đang xử lý hoàn tiền", "Hoàn tiền thành công"].indexOf(data?.status)
            )
            .map((option, index) => (
              <option value={option} key={index}>
                {option}
              </option>
            ))}
        </select>
      ) : null}

<div
  className={`${styles.button} mt-5 bg-blue-600 rounded-[8px] text-white font-bold w-[200px] h-[30px] text-[16px] flex items-center justify-center shadow-lg transition-transform transform hover:scale-105 cursor-pointer`}
  onClick={
    data?.status !== "Đang xử lý hoàn tiền"
      ? orderUpdateHandler
      : refundOrderUpdateHandler
  }
>
  <span className="mr-2">🔄</span> {/* Thêm biểu tượng */}
  Cập nhật
</div>
    </div>
  );
};

export default OrderDetails;