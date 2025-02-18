import React, { useState } from "react";
import { RxCross1 } from "react-icons/rx";
import { IoBagHandleOutline } from "react-icons/io5";
import { HiOutlineMinus, HiPlus } from "react-icons/hi";
import { FaTrash } from "react-icons/fa"; // Thêm icon thùng rác
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { backend_url } from "../../server";
import { addTocart, removeFromCart } from "../../redux/actions/cart";
import Swal from 'sweetalert2';

// Hàm định dạng giá tiền
const formatCurrency = (amount) => {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " đ";
};

const Cart = ({ setOpenCart }) => {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const removeFromCartHandler = (data) => {
    Swal.fire({
        title: 'Bạn có chắc chắn muốn xóa sản phẩm này?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy'
    }).then((result) => {
        if (result.isConfirmed) {
            dispatch(removeFromCart(data));
            Swal.fire(
                'Đã xóa!',
                'Sản phẩm đã được xóa khỏi giỏ hàng.',
                'success'
            );
        }
    });
};
  // Tổng giá
  const totalPrice = cart.reduce(
    (acc, item) => acc + item.qty * item.discountPrice,
    0
  );

  const quantityChangeHandler = (data) => {
    dispatch(addTocart(data));
  };

  return (
    <div className="fixed top-0 left-0 w-full bg-[#0000004b] h-screen z-50">
      <div className="fixed top-0 right-0 h-full w-[80%] 800px:w-[25%] bg-white flex flex-col overflow-y-scroll justify-between shadow-lg rounded-l-lg">
        {cart && cart.length === 0 ? (
          <div className="w-full h-screen flex items-center justify-center">
            <div className="flex w-full justify-end pt-5 pr-5 fixed top-3 right-3">
              <RxCross1
                size={25}
                className="cursor-pointer text-gray-600 hover:text-gray-800"
                onClick={() => setOpenCart(false)}
              />
            </div>
            <h5 className="text-lg font-bold text-gray-700">
              Giỏ hàng của bạn đang trống!
            </h5>
          </div>
        ) : (
          <>
            <div>
              <div className="flex w-full justify-end pt-5 pr-5">
                <RxCross1
                  size={25}
                  className="cursor-pointer text-gray-600 hover:text-gray-800"
                  onClick={() => setOpenCart(false)}
                />
              </div>
              {/* Số lượng sản phẩm */}
              <div className="flex items-center p-4 border-b">
                <IoBagHandleOutline size={25} className="text-gray-700" />
                <h5 className="pl-2 text-[20px] font-[500] text-gray-700">
                  {cart.length} sản phẩm
                </h5>
              </div>

              {/* Sản phẩm trong giỏ hàng */}
              <div className="w-full">
                {cart.map((item, index) => (
                  <CartSingle
                    key={index}
                    data={item}
                    quantityChangeHandler={quantityChangeHandler}
                    removeFromCartHandler={removeFromCartHandler}
                  />
                ))}
              </div>
            </div>

            <div className="px-5 mb-3">
              {/* Tổng giá */}
              <div className="flex justify-between items-center py-4 border-t">
                <h3 className="text-lg font-semibold text-gray-700">Tổng cộng:</h3>
                <h3 className="text-lg font-bold text-[#d02222]">
                  {formatCurrency(totalPrice)}
                </h3>
              </div>

              {/* Nút thanh toán */}
              <Link to="/checkout">
                <div
                  className={`h-[50px] flex items-center justify-center w-[100%] bg-[#e44343] rounded-lg shadow-md hover:bg-[#d02222] transition-colors duration-200`}
                >
                  <h1 className="text-[#fff] text-[18px] font-[600]">
                    Thanh toán ngay
                  </h1>
                </div>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const CartSingle = ({ data, quantityChangeHandler, removeFromCartHandler }) => {
  const [value, setValue] = useState(data.qty);
  const totalPrice = data.discountPrice * value;

  const increment = (data) => {
    if (data.stock < value) {
      toast.error("Hàng trong kho có hạn!");
    } else {
      setValue(value + 1);
      const updateCartData = { ...data, qty: value + 1 };
      quantityChangeHandler(updateCartData);
    }
  };

  // Giảm số lượng
  const decrement = (data) => {
    setValue(value === 1 ? 1 : value - 1);
    const updateCartData = { ...data, qty: value === 1 ? 1 : value - 1 };
    quantityChangeHandler(updateCartData);
  };

  return (
    <div className="border-b p-3 flex flex-col">
      {/* Tên sản phẩm */}
      <h1 className="text-lg font-semibold text-gray-800">{data.name}</h1>
  
      <div className="flex items-center justify-between mt-2">
        {/* Hình ảnh sản phẩm */}
        <Link to={`/product/${data._id}`} className="flex-shrink-0">
          <img
            src={`${backend_url}${data?.images[0]}`}
            className="w-[80px] h-[80px] rounded-lg object-cover"
            alt={data.name}
          />
        </Link>
  
        {/* Chi tiết giá sản phẩm */}
        <div className="flex-1 mx-3 py-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <h5 className="text-sm font-normal text-red-600 whitespace-nowrap">
              {formatCurrency(data.originalPrice === 0 ? data.originalPrice : data.discountPrice)}
            </h5>
            {data.originalPrice && (
              <h4 className="text-sm font-semibold text-gray-400 line-through ml-2 whitespace-nowrap">
                {formatCurrency(data.originalPrice)}
              </h4>
            )}
          </div>
        </div>
        {/* Dòng tính tổng */}
        <h4 className="text-lg font-bold text-[#d02222] mt-1 whitespace-nowrap">
          {formatCurrency(totalPrice)}
        </h4>
      </div>
  
        {/* Nút tăng/giảm số lượng và nút xóa */}
        <div className="flex items-center space-x-2">
          {/* Nút tăng/giảm số lượng */}
          <div className="flex items-center space-x-1">
            <button
              className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              onClick={() => decrement(data)}
            >
              <HiOutlineMinus size={14} className="text-gray-600" />
            </button>
            <span className="text-lg font-medium">{value}</span>
            <button
              className="w-6 h-6 flex items-center justify-center bg-gray-100 rounded-full hover:bg-gray-200 transition-colors"
              onClick={() => increment(data)}
            >
              <HiPlus size={14} className="text-gray-600" />
            </button>
          </div>
  
          {/* Nút xóa */}
          <button
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            onClick={() => removeFromCartHandler(data)}
          >
            <FaTrash size={20} className="text-red hover:scale-125" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;