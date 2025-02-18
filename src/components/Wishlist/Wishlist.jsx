import React, { useState } from "react";
import { Link } from "react-router-dom"; // Nhập Link
import { RxCross1 } from "react-icons/rx";
import styles from "../../styles/styles";
import { BsCartPlus } from "react-icons/bs";
import { AiOutlineHeart } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { removeFromWishlist } from "../../redux/actions/wishlist";
import { addTocart } from "../../redux/actions/cart";
import { backend_url } from "../../server";

// Hàm định dạng giá tiền
const formatCurrency = (amount) => {
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " đ";
};

const Wishlist = ({ setOpenWishlist }) => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();

  const removeFromWishlistHandler = (data) => {
    dispatch(removeFromWishlist(data));
  };

  const addToCartHandler = (data) => {
    const newData = { ...data, qty: 1 };
    dispatch(addTocart(newData));
    setOpenWishlist(false);
  };

  return (
    <div className="fixed top-0 left-0 w-full bg-[#0000004b] h-screen z-50">
      <div className="fixed top-0 right-0 h-full w-[80%] overflow-y-scroll 800px:w-[25%] bg-white flex flex-col justify-between shadow-md">
        {wishlist && wishlist.length === 0 ? (
          <div className="w-full h-screen flex items-center justify-center">
            <div className="flex w-full justify-end pt-5 pr-5 fixed top-3 right-3">
              <RxCross1
                className="cursor-pointer"
                onClick={() => setOpenWishlist(false)}
              />
            </div>
            <h5>Danh sách yêu thích trống!</h5>
          </div>
        ) : (
          <>
            <div>
              <div className="flex w-full justify-end pt-5 pr-5">
                <RxCross1
                  size={25}
                  className="cursor-pointer"
                  onClick={() => setOpenWishlist(false)}
                />
              </div>
              <div className={`${styles.noramlFlex} p-4`}>
                <AiOutlineHeart size={25} />
                <h5 className="pl-2 text-[20px] font-[500]">
                  {wishlist && wishlist.length} sản phẩm
                </h5>
              </div>

              <br />
              <div className="w-full border-t">
                {wishlist &&
                  wishlist.map((item, index) => (
                    <WishlistItem
                      key={index}
                      data={item}
                      removeFromWishlistHandler={removeFromWishlistHandler}
                      addToCartHandler={addToCartHandler}
                    />
                  ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const WishlistItem = ({ data, removeFromWishlistHandler, addToCartHandler }) => {
  const [value, setValue] = useState(1);
  const totalPrice = data.discountPrice * value;

  return (
    <div className="border-b p-4">
      <div className="w-full 800px:flex items-center">
        <RxCross1
          className="cursor-pointer 800px:mb-0 800px:ml-0 mb-2 ml-2 hover:text-red hover:scale-125"
          onClick={() => removeFromWishlistHandler(data)}
        />

        {/* Bọc phần sản phẩm trong Link */}
        <Link to={`/product/${data._id}`} className="flex-1 flex items-center">
          <img
            src={`${backend_url}${data?.images[0]}`}
            alt={data.name}
            className="w-[130px] h-[130px] ml-2 mr-2 rounded-[5px]"
          />
          <div className="pl-[15px]">
            <h1 className="text-[16px] font-[500]">{data.name}</h1>
            <h4 className="font-[600] pt-3 800px:pt-[3px] text-[17px] text-[#d02222] font-Roboto">
              {formatCurrency(totalPrice)}
            </h4>
          </div>
        </Link>

        <div className="ml-auto">
          <BsCartPlus
            size={20}
            className="cursor-pointer hover:text-yellow-500 transition-colors scale-120 hover:scale-150 duration-200"
            title="Thêm vào giỏ hàng"
            onClick={() => addToCartHandler(data)}
          />
        </div>
      </div>
    </div>
  );
};

export default Wishlist;