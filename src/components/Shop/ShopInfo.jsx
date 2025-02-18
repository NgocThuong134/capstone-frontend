import axios from "axios";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { getAllProductsShop } from "../../redux/actions/product";
import { backend_url, server } from "../../server";
import styles from "../../styles/styles";
import Loader from "../Layout/Loader";

const ShopInfo = ({ isOwner }) => {
    const [data, setData] = useState({});
    const { products } = useSelector((state) => state.products);
    const [isLoading, setIsLoading] = useState(false);

    const { id } = useParams();
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getAllProductsShop(id));
        setIsLoading(true);
        axios.get(`${server}/shop/get-shop-info/${id}`)
            .then((res) => {
                setData(res.data.shop);
                setIsLoading(false);
            })
            .catch((error) => {
                console.log(error);
                setIsLoading(false);
            });
    }, [dispatch, id]);

    const logoutHandler = async () => {
        await axios.get(`${server}/shop/logout`, {
            withCredentials: true,
        });
        window.location.reload();
    };

    const totalReviewsLength =
        products?.reduce((acc, product) => acc + product.reviews.length, 0) || 0;

    const totalRatings = products?.reduce((acc, product) => acc + product.reviews.reduce((sum, review) => sum + review.rating, 0), 0) || 0;

    const averageRating = totalReviewsLength ? (totalRatings / totalReviewsLength).toFixed(1) : 0;

    return (
        <>
            {isLoading ? (
                <Loader />
            ) : (
                <div className="w-full max-w-md mx-auto bg-white shadow-md rounded-lg p-5">
                    <div className="flex flex-col items-center">
                        <img
                            src={`${backend_url}${data.avatar}`}
                            alt=""
                            className="w-36 h-36 object-cover rounded-full border-2 border-gray-200"
                        />
                        <h3 className="text-center py-2 text-2xl font-semibold">{data.name}</h3>
                        <p className="text-center text-lg text-gray-600">{data.description}</p>
                    </div>
                    <div className="mt-4">
                        <h5 className="font-semibold">Địa chỉ</h5>
                        <h4 className="text-gray-600">{data.address}</h4>
                    </div>
                    <div className="mt-2">
                        <h5 className="font-semibold">Số điện thoại</h5>
                        <h4 className="text-gray-600">{data.phoneNumber}</h4>
                    </div>
                    <div className="mt-2">
                        <h5 className="font-semibold">Tổng số sản phẩm</h5>
                        <h4 className="text-gray-600">{products?.length}</h4>
                    </div>
                    <div className="mt-2">
                        <h5 className="font-semibold">Đánh giá cửa hàng</h5>
                        <h4 className="text-gray-600">{averageRating}/5</h4>
                    </div>
                    <div className="mt-2">
                        <h5 className="font-semibold">Ngày tham gia</h5>
                        <h4 className="text-gray-600">{data?.createdAt?.slice(0, 10)}</h4>
                    </div>
                    {isOwner && (
                        <div className="mt-4">
                            <Link to="/settings">
                                <div className={`${styles.button} bg-blue-500 w-full h-12 rounded-md flex items-center justify-center`}>
                                    <span className="text-white font-semibold">Chỉnh sửa cửa hàng</span>
                                </div>
                            </Link>
                            <div
                                className={`${styles.button} bg-red bg-red-600 w-full h-12 rounded-md flex items-center justify-center mt-2 cursor-pointer`}
                                onClick={logoutHandler}
                            >
                                <span className="text-white font-semibold">Đăng xuất</span>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </>
    );
};

export default ShopInfo;