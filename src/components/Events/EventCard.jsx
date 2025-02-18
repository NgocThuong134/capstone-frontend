import React, { useEffect } from "react";
import { backend_url } from "../../server";
import styles from "../../styles/styles";
import CountDown from "./CountDown";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { addTocart } from "../../redux/actions/cart";
import { toast } from "react-toastify";

const EventCard = ({ active, data }) => {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const addToCartHandler = (data) => {
    const isItemExists = cart && cart.find((i) => i._id === data._id);
    if (isItemExists) {
      toast.error("Sản phẩm đã có trong giỏ hàng!");
    } else {
      if (data.stock < 1) {
        toast.error("Sản phẩm hết hàng!");
      } else {
        const cartData = { ...data, qty: 1 };
        dispatch(addTocart(cartData));
        toast.success("Sản phẩm đã được thêm vào giỏ hàng thành công!");
      }
    }
  };

  const formatCurrency = (amount) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " đ";
  };

  return (
    <div
      className={`w-full block bg-white rounded-lg ${
        active ? "unset" : "mb-12"
      } lg:flex p-4 shadow-md transition-transform duration-300 hover:shadow-lg`}
    >
      <div className="w-full lg:w-[50%] m-auto">
        <img src={`${backend_url}${data.images[0]}`} alt={data.name} className="rounded-lg" />
      </div>

      <div className="w-full lg:w-[50%] flex flex-col justify-center p-4">
        <h2 className={`${styles.productTitle} text-xl font-bold text-[#333]`}>{data.name}</h2>
        <p className="text-gray-600">{data.description}</p>

        <div className="flex py-2 justify-between items-center">
          <div className="flex gap-2">
            <h5 className="font-bold text-[20px] text-red">
              {formatCurrency(data.discountPrice)}
            </h5>

            <h5 className="font-medium text-[18px] text-gray-300 pr-3 line-through">
              {formatCurrency(data.originalPrice)}
            </h5>
          </div>
          <span className="font-normal text-[17px] text-[#44a55e]">
            {data.sold_out} đã bán
          </span>
        </div>
        <CountDown data={data} />
        <br />
        <div className="flex items-center">
          <Link to={`/product/${data._id}?isEvent=true`}>
            <div className={`${styles.button} bg-blue-400 text-[#fff]`}>Xem Chi Tiết</div>
          </Link>
          <div
            className={`${styles.button} bg-yellow-300 text-[#fff] ml-5`}
            onClick={() => addToCartHandler(data)}
          >
            Thêm vào giỏ hàng
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventCard;