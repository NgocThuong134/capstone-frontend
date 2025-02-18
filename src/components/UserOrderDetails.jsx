import React, { useEffect, useState } from "react";
import { BsFillBagFill } from "react-icons/bs";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { backend_url, server } from "../server";
import { RxCross1 } from "react-icons/rx";
import { getAllOrdersOfUser } from "../redux/actions/order";
import { useDispatch, useSelector } from "react-redux";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { MdArrowBack } from "react-icons/md";

const UserOrderDetails = () => {
  const { orders } = useSelector((state) => state.order);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [comment, setComment] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [rating, setRating] = useState(1);

  const { id } = useParams();

  useEffect(() => {
    dispatch(getAllOrdersOfUser(user._id));
  }, [dispatch, user._id]);

  const data = orders && orders.find((item) => item._id === id);

  const reviewHandler = async (type) => {
    try {
      const endpoint =
        type === "product"
          ? "/product/create-new-review"
          : "/event/create-new-review-event";

      const res = await axios.put(
        `${server}${endpoint}`,
        {
          user,
          rating,
          comment,
          productId: selectedItem?._id,
          orderId: id,
        },
        { withCredentials: true }
      );

      toast.success(res.data.message);
      dispatch(getAllOrdersOfUser(user._id));
      setComment("");
      setRating(null);
      setOpen(false);
    } catch (error) {
      console.error(error);
      toast.error("Đã xảy ra lỗi. Vui lòng thử lại.");
    }
  };

  const combinedHandler = async () => {
    if (rating > 0) {
      await reviewHandler("product");
     // await reviewHandler("event");
    }
  };

  // Refund
  const refundHandler = async () => {
    await axios
      .put(`${server}/order/order-refund/${id}`, {
        status: "Đang xử lý hoàn tiền",
      })
      .then((res) => {
        toast.success(res.data.message);
        dispatch(getAllOrdersOfUser(user._id));
      })
      .catch((error) => {
        toast.error(error.response.data.message);
      });
  };

  // Hàm định dạng tiền tệ
  const formatCurrency = (amount) => {
    return amount.toLocaleString("vi-VN") + " đ";
  };

  return (
    <div className="py-8 min-h-screen bg-gray-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <BsFillBagFill size={30} color="crimson" />
            <h1 className="pl-2 text-2xl font-bold">Chi Tiết Đơn Hàng</h1>
          </div>
          <Link to="/profile">
            <button className="flex items-center text-gray-700 hover:text-gray-900">
              <MdArrowBack size={30} />
              <span className="ml-2">Quay lại</span>
            </button>
          </Link>
        </div>

        {/* Order Info */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <div className="flex justify-between mb-4">
            <h5 className="text-gray-700">
              Mã đơn hàng: <span className="font-semibold">#{data?._id?.slice(0, 8)}</span>
            </h5>
            <h5 className="text-gray-700">
              Ngày đặt: <span className="font-semibold">{data?.createdAt?.slice(0, 10)}</span>
            </h5>
          </div>

          {/* Order Items */}
          <div className="space-y-4">
            {data && data?.cart.map((item, index) => (
              <div key={index} className="flex items-start border-b pb-4">
                <img
                  src={`${backend_url}/${item.images[0]}`}
                  alt={item.name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="ml-4 flex-1">
                  <h5 className="text-lg font-semibold">{item.name}</h5>
                  <p className="text-gray-600">
                    {formatCurrency(item.discountPrice)} x {item.qty}
                  </p>
                </div>
                {!item.isReviewed && data?.status === "Đã giao" && (
                  <button
                    className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-800 transition duration-300"
                    onClick={() => {
                      setOpen(true);
                      setSelectedItem(item);
                    }}
                  >
                    Viết đánh giá
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Total Price */}
          <div className="mt-6 pt-4 border-t text-right">
            <h5 className="text-xl font-semibold">
              Tổng tiền: <span className="text-red-600">{formatCurrency(data?.totalPrice)}</span>
            </h5>
          </div>
        </div>

        {/* Shipping Address and Payment Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Shipping Address */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h4 className="text-xl font-semibold mb-4">Địa Chỉ Giao Hàng</h4>
            <p className="text-gray-700">
              {data?.shippingAddress.address}
            </p>
            <p className="text-gray-700">{data?.shippingAddress.country}</p>
            <p className="text-gray-700">{data?.shippingAddress.city}</p>
            <p className="text-gray-700">{data?.user?.phoneNumber}</p>
          </div>

          {/* Payment Info */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h4 className="text-xl font-semibold mb-4">Thông Tin Thanh Toán</h4>
            <p className="text-gray-700">
              Trạng thái:{" "}
              <span className="font-semibold">
                {data?.paymentInfo?.status ? data?.paymentInfo?.status : "Chưa thanh toán"}
              </span>
            </p>
            {data?.status === "Đã giao" && (
              <button
                className="mt-4 bg-red text-white px-4 py-2 rounded-md hover:bg-gray-800 transition duration-300"
                onClick={refundHandler}
              >
                Yêu Cầu Hoàn Tiền
              </button>
            )}
          </div>
        </div>

        {/* Review Popup */}
        {open && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg">
              <div className="flex justify-end">
                <RxCross1
                  size={24}
                  onClick={() => setOpen(false)}
                  className="cursor-pointer text-gray-600 hover:text-gray-800"
                />
              </div>
              <h2 className="text-2xl font-bold text-center mb-6">Viết Đánh Giá</h2>
              <div className="flex items-center mb-6">
                <img
                  src={`${backend_url}/${selectedItem?.images[0]}`}
                  alt={selectedItem?.name}
                  className="w-16 h-16 object-cover rounded-lg"
                />
                <div className="ml-4">
                  <h4 className="text-lg font-semibold">{selectedItem?.name}</h4>
                  <p className="text-gray-600">
                    {formatCurrency(selectedItem?.discountPrice)} x {selectedItem?.qty}
                  </p>
                </div>
              </div>

              {/* Rating */}
              <div className="mb-6">
                <h5 className="text-lg font-semibold mb-2">
                  Đánh giá của bạn <span className="text-red-500">*</span>
                </h5>
                <div className="flex space-x-2">
                  {[1, 2, 3, 4, 5].map((i) =>
                    rating >= i ? (
                      <AiFillStar
                        key={i}
                        className="cursor-pointer text-yellow-400"
                        size={24}
                        onClick={() => setRating(i)}
                      />
                    ) : (
                      <AiOutlineStar
                        key={i}
                        className="cursor-pointer text-yellow-400"
                        size={24}
                        onClick={() => setRating(i)}
                      />
                    )
                  )}
                </div>
              </div>

              {/* Comment */}
              <div className="mb-6">
                <label className="block text-lg font-semibold mb-2">
                  Nhận xét <span className="text-gray-500">(Tùy chọn)</span>
                </label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Sản phẩm của bạn như thế nào? Hãy chia sẻ cảm nhận của bạn!"
                  className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                  rows="4"
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition duration-300"
                onClick={rating > 1 ? combinedHandler : null}
              >
                Gửi Đánh Giá
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default UserOrderDetails;