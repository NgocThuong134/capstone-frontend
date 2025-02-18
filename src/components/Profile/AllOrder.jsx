import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllOrdersOfUser } from '../../redux/actions/order';
import { Link } from "react-router-dom";
import { AiOutlineArrowRight } from "react-icons/ai";

// Hàm định dạng số tiền
const formatCurrency = (amount) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " đ";
};

const AllOrders = () => {
    const { user } = useSelector((state) => state.user);
    const { orders } = useSelector((state) => state.order);
    const dispatch = useDispatch();

    const [filteredOrders, setFilteredOrders] = useState([]);
    const [statusFilter, setStatusFilter] = useState("Tất cả");
    const [sortOrder, setSortOrder] = useState("none");

    // Phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(5); // Số mục trên mỗi trang

    useEffect(() => {
        if (user && user._id) {
            dispatch(getAllOrdersOfUser(user._id));
        }
    }, [dispatch, user]);

    useEffect(() => {
        let filtered = orders;

        // Lọc theo trạng thái
        if (statusFilter !== "Tất cả") {
            filtered = filtered.filter(order => order.status === statusFilter);
        }

        // Sắp xếp theo tổng tiền
        if (sortOrder === "asc") {
            filtered = [...filtered].sort((a, b) => a.totalPrice - b.totalPrice);
        } else if (sortOrder === "desc") {
            filtered = [...filtered].sort((a, b) => b.totalPrice - a.totalPrice);
        }

        setFilteredOrders(filtered);
    }, [orders, statusFilter, sortOrder]);

    const handleStatusFilterChange = (e) => {
        setStatusFilter(e.target.value);
        setCurrentPage(1); // Đặt lại trang hiện tại về 1 khi thay đổi bộ lọc
    };

    const handleSortOrderChange = (e) => {
        setSortOrder(e.target.value);
        setCurrentPage(1); // Đặt lại trang hiện tại về 1 khi thay đổi sắp xếp
    };

    // Tính toán các mục cần hiển thị
    const indexOfLastOrder = currentPage * itemsPerPage;
    const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
    const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);

    // Điều khiển phân trang
    const renderPagination = () => {
        const pages = [];
        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => setCurrentPage(i)}
                    className={`px-3 py-1 rounded-lg ${currentPage === i ? 'bg-blue-500 text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                >
                    {i}
                </button>
            );
        }
        return <div className="flex justify-center gap-1 mt-4">{pages}</div>;
    };

    return (
        <div className='pl-8 pt-1'>
            <h2 className="text-2xl font-bold mb-4">Danh Sách Đơn Hàng</h2>

            {/* Bộ lọc và sắp xếp */}
            <div className="flex gap-4 mb-4">
            <select
                value={statusFilter}
                onChange={handleStatusFilterChange}
                className="px-4 py-2 border rounded-lg shadow-sm"
            >
                <option value="Tất cả">Tất cả trạng thái</option>
                <option value="Đang xử lý">Đang xử lý</option>
                <option value="Đã chuyển đến đối tác giao hàng">Đã chuyển đến đối tác giao hàng</option>
                <option value="Đang giao hàng">Đang giao hàng</option>
                <option value="Đã nhận">Đã nhận</option>
                <option value="Đang trên đường">Đang trên đường</option>
                <option value="Đã giao">Đã giao</option>
                <option value="Đang xử lý hoàn tiền">Đã xử lý hoàn tiền</option>
                <option value="Hoàn tiền thành công">Hoàn tiền thành công</option>
            </select>

                <select
                    value={sortOrder}
                    onChange={handleSortOrderChange}
                    className="px-4 py-2 border rounded-lg shadow-sm"
                >
                    <option value="none">Sắp xếp theo tổng tiền</option>
                    <option value="asc">Tăng dần</option>
                    <option value="desc">Giảm dần</option>
                </select>
            </div>

            {/* Bảng đơn hàng */}
            {currentOrders.length > 0 ? (
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-gray-200">
                            <th className="p-3 text-left">Mã đơn hàng</th>
                            <th className="p-3 text-left">Trạng thái</th>
                            <th className="p-3 text-left">Số lượng</th>
                            <th className="p-3 text-left">Tổng tiền</th>
                            <th className="p-3 text-left">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentOrders.map((order) => (
                            <tr key={order._id} className="border-b">
                                <td className="p-3">{order._id}</td>
                                <td className="p-3">
                                <span
                                    className={`px-2 py-1 rounded-full text-sm ${
                                        order.status === "Đã giao"
                                            ? "bg-green text-white"
                                            : order.status === "Đã hủy"
                                            ? "bg-red text-white"
                                            : order.status === "Đang xử lý"
                                            ? "bg-yellow-400 text-white"
                                            : order.status === "Đã chuyển đến đối tác giao hàng"
                                            ? "bg-blue-100 text-blue-800"
                                            : order.status === "Đang giao hàng"
                                            ? "bg-orange-100 text-orange-800"
                                            : order.status === "Đã nhận"
                                            ? "bg-teal-100 text-teal-800"
                                            : order.status === "Đang trên đường"
                                            ? "bg-purple-100 text-purple-800"
                                            : order.status === "Đang xử lý hoàn tiền"
                                            ? "bg-pink-100 text-pink-800"
                                            : order.status === "Hoàn tiền thành công"
                                            ? "bg-gray-100 text-gray-800"
                                            : "bg-gray-200 text-gray-600" 
                                    }`}
                                >
                                    {order.status}
                                </span>
                                </td>
                                <td className="p-3">{order.cart.length}</td>
                                <td className="p-3">{formatCurrency(order.totalPrice)}</td>
                                <td className="p-3">
                                    <Link to={`/user/order/${order._id}`}>
                                        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                                            <AiOutlineArrowRight size={20} />
                                        </button>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className="text-center text-gray-500">Không có đơn hàng nào.</p>
            )}

            {/* Phân trang */}
            {totalPages > 1 && renderPagination()}
        </div>
    );
};

export default AllOrders;