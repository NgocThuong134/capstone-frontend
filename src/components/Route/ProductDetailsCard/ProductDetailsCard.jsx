import React, { useEffect, useState } from 'react';
import {
    AiFillHeart,
    AiOutlineHeart,
    AiOutlineShoppingCart,
} from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import { Link } from "react-router-dom";
import { backend_url } from "../../../server";
import styles from "../../../styles/styles";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addTocart } from "../../../redux/actions/cart";
import { addToWishlist, removeFromWishlist } from '../../../redux/actions/wishlist';

const ProductDetailsCard = ({ setOpen, data }) => {
    const { cart } = useSelector((state) => state.cart);
    const { wishlist } = useSelector((state) => state.wishlist);
    const dispatch = useDispatch();
    const [count, setCount] = useState(1);
    const [click, setClick] = useState(false);
    const [select, setSelect] = useState(0);

    useEffect(() => {
        if (wishlist && wishlist.find((i) => i._id === data._id)) {
            setClick(true);
        } else {
            setClick(false);
        }
    }, [wishlist]);

    const decrementCount = () => {
        if (count > 1) {
            setCount(count - 1);
        }
    };

    const incrementCount = () => {
        setCount(count + 1);
    };

    const addToCartHandler = (id) => {
        const isItemExists = cart && cart.find((i) => i._id === id);

        if (isItemExists) {
            toast.error("Sản phẩm đã có trong giỏ hàng!");
        } else {
            if (data.stock < count) {
                toast.error("Số lượng sản phẩm có hạn!");
            } else {
                const cartData = { ...data, qty: count };
                dispatch(addTocart(cartData));
                toast.success("Sản phẩm đã được thêm vào giỏ hàng!");
            }
        }
    };

    const removeFromWishlistHandler = (data) => {
        setClick(!click);
        dispatch(removeFromWishlist(data));
    };

    const addToWishlistHandler = (data) => {
        setClick(!click);
        dispatch(addToWishlist(data));
    };

    const formatCurrency = (amount) => {
        return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " đ";
    };

    return (
        <div className='fixed inset-0 bg-[#00000080] z-50 flex items-center justify-center p-6'>
            {data && (
                <div className='w-[80%] max-w-6xl bg-white rounded-lg shadow-2xl overflow-hidden flex flex-col md:flex-row relative'>
                    {/* Close Button */}
                    <RxCross1
                        size={30}
                        className="absolute right-4 top-4 z-50 cursor-pointer text-gray-700 hover:text-red-600 transition duration-150"
                        onClick={() => setOpen(false)}
                    />

                    {/* Product Image Section */}
                    <div className='w-[70%] md:w-1/2 p-6 flex flex-col items-center'>
                        <img
                            src={`${backend_url}${data.images && data.images[select]}`}
                            alt="Sản phẩm"
                            className='rounded-lg shadow-md w-full h-64 md:h-96 object-cover'
                        />
                        <div className="w-full flex mt-4 overflow-x-auto">
                            {data.images.map((i, index) => (
                                <div
                                    key={index}
                                    className={`${
                                        select === index ? "border-2 border-teal-500" : "border border-gray-200"
                                    } cursor-pointer mr-3 rounded-lg overflow-hidden flex-shrink-0`}
                                    onClick={() => setSelect(index)}
                                >
                                    <img
                                        src={`${backend_url}${i}`}
                                        alt=""
                                        className="h-[80px] w-[80px] object-cover"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Product Details Section */}
                    <div className='w-[50%] md:w-1/2 p-6 flex flex-col justify-between'>
                        <div>
                            <h1 className={`${styles.productTitle} text-3xl font-bold text-gray-800 mb-4`}>
                                {data.name}
                            </h1>
                            <p className="text-gray-600 mb-6">{data.description}</p>

                            {/* Price Section */}
                            <div className='flex items-center mb-6'>
                                <h4 className={`${styles.productDiscountPrice} text-3xl font-semibold text-red`}>
                                    {formatCurrency(data.discountPrice)}
                                </h4>
                                {data.originalPrice && (
                                    <h3 className={`${styles.price} text-x text-gray-400 line-through ml-4`}>
                                        {formatCurrency(data.originalPrice)}
                                    </h3>
                                )}
                            </div>

                            {/* Quantity and Wishlist Section */}
                            <div className="flex items-center justify-between mb-6">
                                <div className="flex items-center">
                                    <button
                                        className="bg-teal-400 text-gray-600 font-bold rounded-l px-4 py-2 hover:bg-teal-500 transition duration-300"
                                        onClick={decrementCount}
                                    >
                                        -
                                    </button>
                                    <span className="bg-gray-100 text-gray-800 font-medium px-4 py-2">
                                        {count}
                                    </span>
                                    <button
                                        className="bg-teal-400 text-gray-600 font-bold rounded-r px-4 py-2 hover:bg-teal-500 transition duration-300"
                                        onClick={incrementCount}
                                    >
                                        +
                                    </button>
                                </div>
                                <div className="flex items-center">
                                    <h5 className="text-red mr-4">({data.sold_out}) Đã bán</h5>
                                    {click ? (
                                        <AiFillHeart
                                            size={30}
                                            className='cursor-pointer text-red hover:text-red transition duration-300'
                                            onClick={() => removeFromWishlistHandler(data)}
                                            title="Xóa khỏi danh sách yêu thích"
                                        />
                                    ) : (
                                        <AiOutlineHeart
                                            size={30}
                                            className="cursor-pointer text-gray-400 hover:text-red transition duration-300"
                                            onClick={() => addToWishlistHandler(data)}
                                            title="Thêm vào danh sách yêu thích"
                                        />
                                    )}
                                </div>
                            </div>

                            {/* Add to Cart Button */}
                            <div className="mt-6 flex items-center justify-center">
                                <button
                                    className={`w-[70%] flex items-center justify-center bg-gradient-to-r from-yellow-300 to-yellow-300 text-white rounded-lg h-12 px-6 shadow-lg hover:scale-110 transition duration-200`}
                                    onClick={() => addToCartHandler(data._id)}
                                >
                                    <AiOutlineShoppingCart className="mr-2" />
                                    <span className="font-semibold text-lg">Thêm vào giỏ hàng</span>
                                </button>
                            </div>

                            {/* Shop Info Section */}
                            <div className='mt-6 flex items-center'>
                                <Link to={`/shop/preview/${data.shop._id}`} className="flex items-center">
                                    <img
                                        src={`${backend_url}${data?.shop?.avatar}`}
                                        alt="Shop Avatar"
                                        className='w-12 h-12 rounded-full mr-3 border-2 border-gray-300'
                                    />
                                    <div>
                                        <h3 className={`${styles.shop_name} text-lg font-semibold`}>
                                            {data.shop.name}
                                        </h3>
                                        <h5 className="text-gray-500">(4.5) Đánh giá</h5>
                                    </div>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductDetailsCard;