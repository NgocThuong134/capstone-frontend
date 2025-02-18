import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getAllOrdersOfUser } from "../../redux/actions/order";

const TrackOrder = () => {
    const { orders } = useSelector((state) => state.order);
    const { user } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    const { id } = useParams();

    useEffect(() => {
        if (user?._id) {
            dispatch(getAllOrdersOfUser(user._id));
        }
    }, [dispatch, user]);

    const data = orders && orders.find((item) => item._id === id);

    return (
        <div className="w-full h-[80vh] flex justify-center items-center bg-gray-100">
            <div className="text-center p-5 bg-white shadow-md rounded-lg">
                {data ? (
                    <>
                        {data.status === "Đang xử lý" && (
                        <h1 className="text-[20px] text-blue-600">Đơn hàng của bạn đang được xử lý tại cửa hàng.</h1>
                        )}
                        {data.status === "Đã chuyển đến đối tác giao hàng" && (
                            <h1 className="text-[20px] text-blue-600">Đơn hàng của bạn đã được chuyển cho đối tác giao hàng.</h1>
                        )}
                        {data.status === "Đang giao" && (
                            <h1 className="text-[20px] text-blue-600">Đơn hàng của bạn đang trên đường giao với đối tác giao hàng.</h1>
                        )}
                        {data.status === "Đã nhận" && (
                            <h1 className="text-[20px] text-blue-600">Đơn hàng của bạn đã đến thành phố. Nhân viên giao hàng sẽ giao hàng cho bạn.</h1>
                        )}
                        {data.status === "Đang trên đường" && (
                            <h1 className="text-[20px] text-blue-600">Nhân viên giao hàng đang trên đường giao đơn hàng của bạn.</h1>
                        )}
                        {data.status === "Đã giao" && (
                            <h1 className="text-[20px] text-green-600">Đơn hàng của bạn đã được giao!</h1>
                        )}
                        {data.status === "Đang xử lý hoàn tiền" && (
                            <h1 className="text-[20px] text-red-600">Đơn hoàn tiền của bạn đang được xử lý!</h1>
                        )}
                        {data.status === "Hoàn tiền thành công" && (
                            <h1 className="text-[20px] text-green-600">Đơn hoàn tiền của bạn đã thành công!</h1>
                        )}
                    </>
                ) : (
                    <h1 className="text-[20px] text-red-600">Không tìm thấy thông tin đơn hàng.</h1>
                )}
            </div>
        </div>
    );
};

export default TrackOrder;