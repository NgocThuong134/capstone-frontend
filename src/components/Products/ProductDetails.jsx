import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../styles/styles";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineMessage,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { getAllProductsShop } from "../../redux/actions/product";
import { backend_url, server } from "../../server";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../redux/actions/wishlist";
import { addTocart } from "../../redux/actions/cart";
import { toast } from "react-toastify";
import Ratings from "./Ratings";
import axios from "axios";

const ProductDetails = ({ data }) => {
  const { products } = useSelector((state) => state.products);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const { wishlist } = useSelector((state) => state.wishlist);
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const [count, setCount] = useState(1);
  const [click, setClick] = useState(false);
  const [select, setSelect] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getAllProductsShop(data && data?.shop._id));
    if (wishlist && wishlist.find((i) => i._id === data?._id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [data, wishlist]);

  // Xóa khỏi danh sách yêu thích
  const removeFromWishlistHandler = (data) => {
    setClick(!click);
    dispatch(removeFromWishlist(data));
  };

  // Thêm vào danh sách yêu thích
  const addToWishlistHandler = (data) => {
    setClick(!click);
    dispatch(addToWishlist(data));
  };

  // Thêm vào giỏ hàng
  const addToCartHandler = (id) => {
    const isItemExists = cart && cart.find((i) => i._id === id);

    if (isItemExists) {
      toast.error("Sản phẩm đã có trong giỏ hàng!");
    } else {
      if (data.stock < 1) {
        toast.error("Sản phẩm đã hết hàng!");
      } else {
        const cartData = { ...data, qty: count };
        dispatch(addTocart(cartData));
        toast.success("Thêm vào giỏ hàng thành công!");
      }
    }
  };

  const incrementCount = () => {
    setCount(count + 1);
  };
  const decrementCount = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  const totalReviewsLength =
    products &&
    products.reduce((acc, product) => acc + product.reviews.length, 0);

  const totalRatings =
    products &&
    products.reduce(
      (acc, product) =>
        acc + product.reviews.reduce((sum, review) => sum + review.rating, 0),
      0
    );

  const avg = totalRatings / totalReviewsLength || 0;

  const averageRating = avg.toFixed(2);

  // Gửi tin nhắn
  const handleMessageSubmit = async () => {
    if (isAuthenticated) {
      const groupTitle = data._id + user._id;
      const userId = user._id;
      const sellerId = data.shop._id;
      await axios
        .post(`${server}/conversation/create-new-conversation`, {
          groupTitle,
          userId,
          sellerId,
        })
        .then((res) => {
          navigate(`/inbox?${res.data.conversation._id}`);
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        });
    } else {
      toast.error("Vui lòng đăng nhập để gửi tin nhắn");
    }
  };

  return (
    <div className="bg-white pb-4">
      {data ? (
        <div className={`${styles.section} w-[90%] 800px:w-[80%]`}>
          <div className="w-full py-5">
            <div className="block w-full 800px:flex">
              {/* Hình ảnh sản phẩm */}
              <div className="w-full 800px:w-[50%]">
                <img
                  src={`${backend_url}${data && data.images[select]}`}
                  alt=""
                  className="w-[80%] h-[400px] rounded-lg shadow-md"
                />
                <div className="w-full flex mt-4">
                  {data &&
                    data.images.map((i, index) => (
                      <div
                        key={index}
                        className={`${
                          select === index ? "border-2 border-teal-500" : ""
                        } cursor-pointer mr-3`}
                      >
                        <img
                          src={`${backend_url}${i}`}
                          alt=""
                          className="h-[100px] rounded-lg"
                          onClick={() => setSelect(index)}
                        />
                      </div>
                    ))}
                </div>
              </div>

              {/* Thông tin sản phẩm */}
              <div className="w-full 800px:w-[50%] pt-5">
                <h1 className={`${styles.productTitle}`}>{data.name}</h1>
                <p className="text-gray-600 mt-2">{data.description}</p>
                <div className="flex pt-3">
                  <h4 className={`${styles.productDiscountPrice}`}>
                    {data.discountPrice.toLocaleString()}đ
                  </h4>
                  <h3 className={`${styles.price} line-through ml-3`}>
                    {data.originalPrice
                      ? data.originalPrice.toLocaleString() + "đ"
                      : null}
                  </h3>
                </div>

                {/* Tăng/giảm số lượng */}
                <div className="flex items-center mt-6 justify-between pr-3">
                  <div className="flex items-center">
                    <button
                      className="bg-teal-500 text-white font-bold rounded-l px-4 py-2 hover:bg-teal-600 transition duration-300"
                      onClick={decrementCount}
                    >
                      -
                    </button>
                    <span className="bg-gray-100 text-gray-800 font-medium px-4 py-2">
                      {count}
                    </span>
                    <button
                      className="bg-teal-500 text-white font-bold rounded-r px-4 py-2 hover:bg-teal-600 transition duration-300"
                      onClick={incrementCount}
                    >
                      +
                    </button>
                  </div>
             {/* Thêm vào giỏ hàng */}
            <div
              className={`${styles.button} bg-gradient-to-r from-yellow-300 to-yellow-400 !mt-6 !rounded-lg shadow-md flex items-center justify-center py-1 px-2 w-full max-w-xs hover:bg-yellow-700 transition duration-200 transform hover:scale-105`}
              onClick={() => addToCartHandler(data._id)}
            >
              <span className="text-white font-semibold flex items-center text-center">
                <AiOutlineShoppingCart className="mr-1 scale-150 transform transition-transform duration-200 hover:scale-125" />
                Thêm vào giỏ hàng
              </span>
            </div>
                  {/* Yêu thích */}
                  <div>
                    {click ? (
                      <AiFillHeart
                        size={30}
                        className="cursor-pointer"
                        onClick={() => removeFromWishlistHandler(data)}
                        color="red"
                        title="Xóa khỏi danh sách yêu thích"
                      />
                    ) : (
                      <AiOutlineHeart
                        size={30}
                        className="cursor-pointer"
                        onClick={() => addToWishlistHandler(data)}
                        title="Thêm vào danh sách yêu thích"
                      />
                    )}
                  </div>
                  
                </div>

                

                {/* Thông tin cửa hàng */}
                <div className="flex items-center pt-8">
                  <Link to={`/shop/preview/${data?.shop._id}`}>
                    <img
                      src={`${backend_url}${data?.shop?.avatar}`}
                      alt=""
                      className="w-[50px] h-[50px] rounded-full mr-2"
                    />
                  </Link>
                  <div className="pr-8">
                    <Link to={`/shop/preview/${data?.shop._id}`}>
                      <h3 className={`${styles.shop_name} pb-1 pt-1`}>
                        {data.shop.name}
                      </h3>
                    </Link>
                    <h5 className="pb-3 text-[15px]">
                      ({averageRating}/5) Đánh giá
                    </h5>
                  </div>
                  <div
                    className={`${styles.button} bg-[#6443d1] mt-4 !rounded !h-11 hover:bg-[#4a2fa8] transition duration-300`}
                    onClick={handleMessageSubmit}
                  >
                    <span className="text-white flex items-center">
                      Gửi tin nhắn <AiOutlineMessage className="ml-1" />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Thông tin chi tiết sản phẩm */}
          <ProductDetailsInfo
            data={data}
            products={products}
            totalReviewsLength={totalReviewsLength}
            averageRating={averageRating}
          />
        </div>
      ) : null}
    </div>
  );
};

const ProductDetailsInfo = ({
  data,
  products,
  totalReviewsLength,
  averageRating,
}) => {
  const [active, setActive] = useState(1);

  return (
    <div className="bg-[#f5f6fb] px-3 800px:px-10 py-2 rounded-lg mt-6 mb-4">
      <div className="w-full flex justify-between border-b pt-10 pb-2">
        <div className="relative">
          <h5
            className={`text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px] ${
              active === 1 ? "text-teal-500" : ""
            }`}
            onClick={() => setActive(1)}
          >
            Chi tiết sản phẩm
          </h5>
          {active === 1 ? (
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-teal-500" />
          ) : null}
        </div>

        <div className="relative">
          <h5
            className={`text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px] ${
              active === 2 ? "text-teal-500" : ""
            }`}
            onClick={() => setActive(2)}
          >
            Đánh giá 
          </h5>
          {active === 2 ? (
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-teal-500" />
          ) : null}
        </div>

        <div className="relative">
          <h5
            className={`text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px] ${
              active === 3 ? "text-teal-500" : ""
            }`}
            onClick={() => setActive(3)}
          >
            Thông tin cửa hàng
          </h5>
          {active === 3 ? (
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-teal-500" />
          ) : null}
        </div>
      </div>

      {active === 1 ? (
        <>
          <p className="py-2 text-[18px] leading-8 pb-10 whitespace-pre-line">
            {data.description}
          </p>
        </>
      ) : null}

      {/* Đánh giá sản phẩm */}
      {active === 2 ? (
        <div className="w-full min-h-[40vh] flex flex-col items-center py-3 overflow-y-scroll">
          {data &&
            data.reviews.map((item, index) => (
              <div key={index} className="w-full flex my-2">
                <img
                  src={`${backend_url}/${item.user.avatar}`}
                  alt=""
                  className="w-[50px] h-[50px] rounded-full"
                />
                <div className="pl-2">
                  <div className="w-full flex items-center">
                    <h1 className="font-[500] mr-3">{item.user.name}</h1>
                    <Ratings rating={item.rating} />
                  </div>
                  <p>{item.comment}</p>
                </div>
              </div>
            ))}

          <div className="w-full flex justify-center">
            {data && data.reviews.length === 0 && (
              <h5>Chưa có đánh giá nào cho sản phẩm này!</h5>
            )}
          </div>
        </div>
      ) : null}

      {/* Thông tin cửa hàng */}
      {active === 3 ? (
        <>
          <div className="w-full block 800px:flex p-5">
            <div className="w-full 800px:w-[50%]">
              <div className="flex items-center">
                <Link to={`/shop/preview/${data.shop._id}`}>
                  <div className="flex items-center">
                    <img
                      src={`${backend_url}${data?.shop?.avatar}`}
                      className="w-[50px] h-[50px] rounded-full"
                      alt=""
                    />
                    <div className="pl-3">
                      <h3 className={`${styles.shop_name}`}>
                        {data.shop.name}
                      </h3>
                      <h5 className="pb-3 text-[15px]">
                        ({averageRating}/5) Đánh giá
                      </h5>
                    </div>
                  </div>
                </Link>
              </div>
              <p className="pt-2">{data.shop.description}</p>
            </div>

            <div className="w-full 800px:w-[50%] mt-5 800px:mt-0 800px:flex flex-col items-end">
              <div className="text-left">
                <h5 className="font-[600]">
                  Tham gia từ:{" "}
                  <span className="font-[500]">
                    {data.shop?.createdAt?.slice(0, 10)}
                  </span>
                </h5>
                <h5 className="font-[600] pt-3">
                  Tổng sản phẩm:{" "}
                  <span className="font-[500]">
                    {products && products.length}
                  </span>
                </h5>
                <h5 className="font-[600] pt-3">
                  Tổng đánh giá:{" "}
                  <span className="font-[500]">{totalReviewsLength}</span>
                </h5>
                <Link to={`/shop/preview/${data?.shop._id}`}>
                  <div
                    className={`${styles.button} bg-green !rounded-[4px] !h-[39.5px] mt-3`}
                  >
                    <h4 className="text-white">Xem cửa hàng</h4>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default ProductDetails;