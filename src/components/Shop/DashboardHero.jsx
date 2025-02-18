import React, { useEffect, useState } from "react";
import { AiOutlineArrowRight, AiOutlineMoneyCollect } from "react-icons/ai";
import styles from "../../styles/styles";
import { Link } from "react-router-dom";
import { MdBorderClear } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { getAllOrdersOfShop } from "../../redux/actions/order";
import { getAllProductsShop } from "../../redux/actions/product";
import { Button } from "@material-ui/core";
import { DataGrid } from "@material-ui/data-grid";
import Loader from "../Layout/Loader";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar, ResponsiveContainer } from "recharts";
// Hàm định dạng tiền tệ
const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return "0 đ";
  return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " đ";
};
// Hàm lọc dữ liệu theo thời gian
const filterDataByTime = (data, timeRange) => {
  console.log("2222")
  const now = new Date();
  switch (timeRange) {
    case "today":
      return data.filter((item) => {
        const itemDate = new Date(item.createdAt);
        return itemDate.toDateString() === now.toDateString();
      });
    case "yesterday":
      const yesterday = new Date(now);
      yesterday.setDate(now.getDate() - 1);
      return data.filter((item) => {
        const itemDate = new Date(item.createdAt);
        return itemDate.toDateString() === yesterday.toDateString();
      });
    case "thisWeek":
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      return data.filter((item) => {
        const itemDate = new Date(item.createdAt);
        return itemDate >= startOfWeek;
      });
    case "thisMonth":
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      return data.filter((item) => {
        const itemDate = new Date(item.createdAt);
        return itemDate >= startOfMonth;
      });
    case "thisQuarter":
      const currentQuarter = Math.floor((now.getMonth() + 3) / 3);
      const startOfQuarter = new Date(now.getFullYear(), (currentQuarter - 1) * 3, 1);
      const endOfQuarter = new Date(now.getFullYear(), currentQuarter * 3, 0);
      return data.filter((item) => {
        const itemDate = new Date(item.createdAt);
        return itemDate >= startOfQuarter && itemDate <= endOfQuarter;
      });
    case "thisYear":
      const startOfYear = new Date(now.getFullYear(), 0, 1);
      return data.filter((item) => {
        const itemDate = new Date(item.createdAt);
        return itemDate >= startOfYear;
      });
    default:
      return data;
  }
};

const DashboardHero = () => {
  const dispatch = useDispatch();
    const { orders, isLoading } = useSelector((state) => state.order);
    const { seller } = useSelector((state) => state.seller);
    const { products } = useSelector((state) => state.products);

  const [timeRange, setTimeRange] = useState("today"); // Mặc định là hôm nay
  
  useEffect(() => {
    dispatch(getAllOrdersOfShop(seller._id));
}, [dispatch]);

useEffect(() => {
 dispatch(getAllProductsShop(seller._id));
  
}, [dispatch]);


  const availableBalance = formatCurrency(seller?.availableBalance);

  // Lọc dữ liệu theo thời gian được chọn
  const filteredOrders = filterDataByTime(orders, timeRange);

  // Chuẩn bị dữ liệu cho biểu đồ doanh số bán hàng theo thời gian
  const salesData = filteredOrders?.map((order) => ({
    date: new Date(order.createdAt).toLocaleDateString(), // Lấy ngày đơn hàng
    total: order.totalPrice, // Tổng giá trị đơn hàng
  }));

  // Chuẩn bị dữ liệu cho biểu đồ sản phẩm bán được theo thời gian
  const productSalesData = filteredOrders?.reduce((acc, order) => {
    order.cart.forEach((item) => {
      const productName = item.name;
      const qty = item.qty;
      if (!acc[productName]) {
        acc[productName] = 0;
      }
      acc[productName] += qty;
    });
    return acc;
  }, {});

  const productSalesChartData = Object.keys(productSalesData || {}).map((productName) => ({
    name: productName,
    quantity: productSalesData[productName],
  }));

  const columns = [
    { field: "id", headerName: "Mã Đơn Hàng", minWidth: 150, flex: 0.7 },
    {
      field: "status",
      headerName: "Trạng Thái",
      minWidth: 130,
      flex: 0.7,
      cellClassName: (params) => {
        return params.getValue(params.id, "status") === "Đã giao"
          ? "greenColor"
          : "redColor";
      },
    },
    {
      field: "itemsQty",
      headerName: "Số Lượng",
      type: "number",
      minWidth: 130,
      flex: 0.7,
    },
    {
      field: "total",
      headerName: "Tổng",
      type: "number",
      minWidth: 130,
      flex: 0.8,
      valueFormatter: (params) => formatCurrency(params.value),
    },
    {
      field: " ",
      flex: 1,
      minWidth: 150,
      headerName: "",
      type: "number",
      sortable: false,
      renderCell: (params) => {
        return (
          <Link to={`/order/${params.id}`}>
            <Button>
              <AiOutlineArrowRight size={20} />
            </Button>
          </Link>
        );
      },
    },
  ];

  const row = [];

  filteredOrders && filteredOrders.forEach((item) => {
    row.push({
      id: item._id,
      itemsQty: item.cart.reduce((acc, item) => acc + item.qty, 0),
      total: item.totalPrice,
      status: item.status,
    });
  });




  return (
    <> {isLoading ? (
      <Loader />
  ) : (
    <div className="w-full p-8">
      <h3 className="text-[22px] font-Poppins pb-2">Tổng Quan</h3>
      <div className="w-full block 800px:flex items-center justify-between">
        {/* Số dư tài khoản */}
        <div className="w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white shadow rounded px-2 py-5 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center">
            <AiOutlineMoneyCollect
              size={30}
              className="mr-2"
              fill="#00000085"
            />
            <h3 className={`${styles.productTitle} !text-[18px] leading-5 !font-[400] text-[#00000085]`}>
              Số Dư Tài Khoản{" "}
              <span className="text-[16px]">(đã bao gồm phí dịch vụ 10%)</span>
            </h3>
          </div>
          <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">{availableBalance}</h5>
          <Link to="/dashboard-withdraw-money">
            <h5 className="pt-4 pl-[2] text-[#077f9c] hover:text-[#055c75] transition-colors duration-300">Rút Tiền</h5>
          </Link>
        </div>

        {/* Tất cả đơn hàng */}
        <div className="w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white shadow rounded px-2 py-5 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center">
            <MdBorderClear size={30} className="mr-2" fill="#00000085" />
            <h3 className={`${styles.productTitle} !text-[18px] leading-5 !font-[400] text-[#00000085]`}>
              Tất Cả Đơn Hàng
            </h3>
          </div>
          <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">{filteredOrders && filteredOrders.length}</h5>
          <Link to="/dashboard-orders">
            <h5 className="pt-4 pl-2 text-[#077f9c] hover:text-[#055c75] transition-colors duration-300">Xem Đơn Hàng</h5>
          </Link>
        </div>

        {/* Tất cả sản phẩm */}
        <div className="w-full mb-4 800px:w-[30%] min-h-[20vh] bg-white shadow rounded px-2 py-5 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center">
            <AiOutlineMoneyCollect size={30} className="mr-2" fill="#00000085" />
            <h3 className={`${styles.productTitle} !text-[18px] leading-5 !font-[400] text-[#00000085]`}>
              Tất Cả Sản Phẩm
            </h3>
          </div>
          <h5 className="pt-2 pl-[36px] text-[22px] font-[500]">{products && products.length}</h5>
          <Link to="/dashboard-products">
            <h5 className="pt-4 pl-2 text-[#077f9c] hover:text-[#055c75] transition-colors duration-300">Xem Sản Phẩm</h5>
          </Link>
        </div>
      </div>
      <br />

      {/* Dropdown chọn thời gian */}
      <div className="flex justify-end mb-4">
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="today">Hôm nay</option>
          <option value="yesterday">Hôm qua</option>
          <option value="thisWeek">Tuần này</option>
          <option value="thisMonth">Tháng này</option>
          <option value="thisQuarter">Quý này</option>
          <option value="thisYear">Năm nay</option>
        </select>
      </div>

      <h3 className="text-[22px] font-Poppins pb-2">Đơn Hàng Mới Nhất</h3>
      <div className="w-full min-h-[45vh] bg-white rounded shadow">
        <DataGrid
          rows={row}
          columns={columns}
          pageSize={10}
          disableSelectionOnClick
          autoHeight
        />
      </div>

      {/* Biểu đồ Doanh Số Bán Hàng Theo Thời Gian */}
      <h3 className="text-[22px] font-Poppins pt-8 pb-2">Doanh Số Bán Hàng Theo Thời Gian</h3>
      <div className="w-full min-h-[45vh] bg-white rounded p-4 shadow">
        <ResponsiveContainer width="100%" height={400}>
          <LineChart
            data={salesData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis tickFormatter={(value) => formatCurrency(value)} />
            <Tooltip formatter={(value) => formatCurrency(value)} />
            <Legend />
            <Line type="monotone" dataKey="total" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Biểu đồ Sản Phẩm Bán Được */}
      <h3 className="text-[22px] font-Poppins pt-8 pb-2">Sản Phẩm Bán Được</h3>
      <div className="w-full min-h-[45vh] bg-white rounded p-4 shadow">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={productSalesChartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="quantity" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )}
    </>
  );
};

export default DashboardHero;