import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import styles from "../../styles/styles";
import ProductCard from "../Route/ProductCard/ProductCard";
import { backend_url } from "../../server";
import Ratings from "../Products/Ratings";
import { getAllEventsShop } from "../../redux/actions/event";

const ShopProfileData = ({ isOwner }) => {
    const { products } = useSelector((state) => state.products);
    const { events } = useSelector((state) => state.events);
    const { id } = useParams();

    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(getAllEventsShop(id));
    }, [dispatch]);

    const [active, setActive] = useState(1);

    const allReviews =
        products && products.map((product) => product.reviews).flat();

    return (
        <div className="w-full">
            <div className="flex w-full items-center justify-between border-b pb-4 mb-4">
                <div className="flex space-x-6">
                    <div className="cursor-pointer" onClick={() => setActive(1)}>
                        <h5 className={`font-semibold text-lg ${active === 1 ? "text-red-500 border-b-2 border-red-500" : "text-gray-800"}`}>
                            Sản Phẩm Của Cửa Hàng
                        </h5>
                    </div>
                    <div className="cursor-pointer" onClick={() => setActive(2)}>
                        <h5 className={`font-semibold text-lg ${active === 2 ? "text-red-500 border-b-2 border-red-500" : "text-gray-800"}`}>
                            Sự Kiện Đang Diễn Ra
                        </h5>
                    </div>
                    <div className="cursor-pointer" onClick={() => setActive(3)}>
                        <h5 className={`font-semibold text-lg ${active === 3 ? "text-red-500 border-b-2 border-red-500" : "text-gray-800"}`}>
                            Đánh Giá Của Cửa Hàng
                        </h5>
                    </div>
                </div>
                {isOwner && (
                    <Link to="/dashboard">
                    <div className={`${styles.button} bg-green rounded-md w-[200px] h-12 flex items-center justify-center shadow-lg transition-transform transform hover:scale-105 hover:bg-gray-800`}>
                        <span className="text-white font-semibold text-lg">Bảng điều khiển</span>
                    </div>
                    </Link>
                )}
            </div>

            {active === 1 && (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-12">
                    {products && products.map((product, index) => (
                        <ProductCard data={product} key={index} isShop={true} />
                    ))}
                </div>
            )}

            {active === 2 && (
                <div className="w-full">
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 mb-12">
                        {events && events.map((event, index) => (
                            <ProductCard data={event} key={index} isShop={true} isEvent={true} />
                        ))}
                    </div>
                    {events && events.length === 0 && (
                        <h5 className="w-full text-center py-5 text-lg text-gray-500">
                            Không có sự kiện nào cho cửa hàng này!
                        </h5>
                    )}
                </div>
            )}

            {active === 3 && (
                <div className="w-full">
                    {allReviews && allReviews.map((item, index) => (
                        <div className="w-full flex my-4" key={index}>
                            <img
                                src={`${backend_url}/${item.user.avatar}`}
                                className="w-12 h-12 rounded-full"
                                alt=""
                            />
                            <div className="pl-2">
                                <div className="flex items-center">
                                    <h1 className="font-semibold pr-2">{item.user.name}</h1>
                                    <Ratings rating={item.rating} />
                                </div>
                                <p className="text-gray-700">{item?.comment}</p>
                                <p className="text-gray-500 text-sm">{item.createdAt.substring(0, 10)}</p>
                            </div>
                        </div>
                    ))}
                    {allReviews && allReviews.length === 0 && (
                        <h5 className="w-full text-center py-5 text-lg text-gray-500">
                            Không có đánh giá nào cho cửa hàng này!
                        </h5>
                    )}
                </div>
            )}
        </div>
    );
};

export default ShopProfileData;