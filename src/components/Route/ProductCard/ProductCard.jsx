import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import styles from "../../../styles/styles";
import {
    AiFillHeart,
    AiOutlineEye,
    AiOutlineHeart,
    AiOutlineShoppingCart,
} from "react-icons/ai";
import { backend_url } from "../../../server";
import ProductDetailsCard from "../ProductDetailsCard/ProductDetailsCard.jsx";
import { useDispatch, useSelector } from 'react-redux';
import { addToWishlist, removeFromWishlist } from '../../../redux/actions/wishlist';
import { addTocart } from '../../../redux/actions/cart';
import { toast } from 'react-toastify';
import Ratings from "../../Products/Ratings";

// Hàm định dạng tiền tệ
const formatCurrency = (amount) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " đ";
};

const ProductCard = ({ data, isEvent, onProductClick }) => {
    const { wishlist } = useSelector((state) => state.wishlist);
    const { cart } = useSelector((state) => state.cart);
    const [isInWishlist, setIsInWishlist] = useState(false);
    const dispatch = useDispatch();

    useEffect(() => {
        setIsInWishlist(wishlist && wishlist.some((item) => item._id === data._id));
    }, [wishlist, data._id]);

    // Xóa khỏi danh sách yêu thích
    const handleRemoveFromWishlist = () => {
        setIsInWishlist(false);
        dispatch(removeFromWishlist(data));
    };

    // Thêm vào danh sách yêu thích
    const handleAddToWishlist = () => {
        setIsInWishlist(true);
        dispatch(addToWishlist(data));
    };

    // Thêm vào giỏ hàng
    const handleAddToCart = () => {
        const itemExists = cart && cart.some((item) => item._id === data._id);

        if (itemExists) {
            toast.error("Sản phẩm đã có trong giỏ hàng!");
        } else if (data.stock < 1) {
            toast.error("Sản phẩm hết hàng!");
        } else {
            const cartData = { ...data, qty: 1 };
            dispatch(addTocart(cartData));
            toast.success("Sản phẩm đã được thêm vào giỏ hàng!");
        }
    };

    return (
        <div className='w-full h-[370px] bg-white rounded-lg shadow-md p-3 relative cursor-pointer transition-transform duration-300 hover:scale-105 hover:shadow-lg'> 
            <Link to={`${isEvent ? `/product/${data._id}?isEvent=true` : `/product/${data._id}`}`}>
                <img
                    src={`${backend_url}${data.images && data.images[0]}`}
                    alt="Sản phẩm"
                    className='w-full h-[170px] object-contain'
                />
            </Link>
            <Link to={`${isEvent ? `/product/${data._id}?isEvent=true` : `/product/${data._id}`}`}>
                <h5 className={`${styles.shop_name}`}>{data.shop.name}</h5>
            </Link>
            <Link to={`/product/${data._id}`}>
                <h4 className='pb-3 font-medium'>
                    {data.name.length > 30 ? `${data.name.slice(0, 30)}...` : data.name}
                </h4>
                <div className='flex'>
                    <Ratings rating={data?.ratings} />
                </div>
                <div className='py-2 flex items-center justify-between'>
                    <div className='flex'>
                        <h5 className={`${styles.productDiscountPrice}`}>
                            {formatCurrency(data.originalPrice === 0 ? data.originalPrice : data.discountPrice)}
                        </h5>
                        <h4 className={`${styles.price}`}>
                            {data.originalPrice ? formatCurrency(data.originalPrice) : null}
                        </h4>
                    </div>
                    <span className="font-normal text-[17px] text-[#68d284]">
                        {data?.sold_out} đã bán
                    </span>
                </div>
            </Link>

            {/* Tùy chọn bên cạnh */}
            <div>
                {isInWishlist ? (
                    <AiFillHeart
                        size={22}
                        className="cursor-pointer absolute right-2 top-5 transition-transform duration-300 hover:scale-125"
                        onClick={handleRemoveFromWishlist}
                        color="red"
                        title='Xóa khỏi danh sách yêu thích'
                    />
                ) : (
                    <AiOutlineHeart
                        size={22}
                        className="cursor-pointer absolute right-2 top-5 transition-transform duration-300 hover:scale-125"
                        onClick={handleAddToWishlist}
                        color="#333"
                        title='Thêm vào danh sách yêu thích'
                        onMouseEnter={(e) => e.currentTarget.style.color = '#FF0000'} // Màu khi hover
                        onMouseLeave={(e) => e.currentTarget.style.color = '#333'} // Màu trở lại
                    />
                )}
                <AiOutlineEye
                    size={22}
                    className="cursor-pointer absolute right-2 top-14 transition-transform duration-300 hover:scale-125"
                    onClick={() => onProductClick(data)}
                    color="#333"
                    title='Xem nhanh'
                    onMouseEnter={(e) => e.currentTarget.style.color = '#0000FF'} // Màu khi hover
                    onMouseLeave={(e) => e.currentTarget.style.color = '#333'} // Màu trở lại
                />
                <AiOutlineShoppingCart
                    size={25}
                    className="cursor-pointer absolute right-2 top-24 transition-transform duration-300 hover:scale-125"
                    onClick={handleAddToCart}
                    color="#444"
                    title="Thêm vào giỏ hàng"
                    onMouseEnter={(e) => e.currentTarget.style.color = '#FFD700'} // Màu khi hover
                    onMouseLeave={(e) => e.currentTarget.style.color = '#444'} // Màu trở lại
                />
            </div>
        </div>
    );
};

export default ProductCard;