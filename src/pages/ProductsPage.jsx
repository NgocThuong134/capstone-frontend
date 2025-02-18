import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";
import Loader from "../components/Layout/Loader";
import ProductCard from "../components/Route/ProductCard/ProductCard";
import { FiFilter, FiTag, FiStar, FiDollarSign, FiCheckSquare, FiList, FiChevronLeft, FiChevronRight, FiSearch } from "react-icons/fi";
import { getAllShops } from "../redux/actions/sellers";

const ProductsPage = () => {
  const [searchParams] = useSearchParams();
  const categoryData = searchParams.get("category");
  const searchData = searchParams.get("search");
  const { allProducts, isLoading } = useSelector((state) => state.products);
  const { sellers } = useSelector((state) => state.seller);
  const dispatch = useDispatch();

  // State management
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [sortOptionPrice, setSortOptionPrice] = useState("none"); // Tùy chọn sắp xếp theo giá
  const [sortOptionAlpha, setSortOptionAlpha] = useState("none"); // Tùy chọn sắp xếp theo bảng chữ cái
  const [minRating, setMinRating] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(4);
  const [selectedShop, setSelectedShop] = useState("");

  // Lấy danh sách quán khi component được mount
  useEffect(() => {
    dispatch(getAllShops());
  }, [dispatch]);

  const filteredData = useMemo(() => {
    if (!allProducts) return [];
  
    // Lọc sản phẩm theo các tiêu chí
    const filteredProducts = allProducts.filter(product => {
      const matchesCategory = !categoryData || product.category === categoryData;
      const matchesPrice = product.discountPrice >= priceRange[0] && product.discountPrice <= priceRange[1];
  
      // Kiểm tra tìm kiếm theo searchData
      const normalizedSearchData = searchData ? searchData.toLowerCase() : "";
      const matchesSearch =
    product.name.toLowerCase().includes(normalizedSearchData) ||
    (Array.isArray(product.tags) && product.tags.some(tag => tag.toLowerCase().includes(normalizedSearchData))) || 
    product.description.toLowerCase().includes(normalizedSearchData);
    
      const matchesRating = product.ratings >= minRating;
      const matchesShop = !selectedShop || product.shop.name === selectedShop;
  
      return matchesCategory && matchesPrice && matchesSearch && matchesRating && matchesShop;
    });
  
    // Sắp xếp theo giá
    let sortedProducts = filteredProducts.slice(); // Tạo bản sao của mảng đã lọc để sắp xếp
    if (sortOptionPrice === "price-asc") {
      sortedProducts.sort((a, b) => a.discountPrice - b.discountPrice);
    } else if (sortOptionPrice === "price-desc") {
      sortedProducts.sort((a, b) => b.discountPrice - a.discountPrice);
    }
  
    // Sắp xếp theo tên
    if (sortOptionAlpha === "alphabetical") {
      sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
    }
  
    return sortedProducts;
  }, [allProducts, categoryData, priceRange, sortOptionPrice, sortOptionAlpha, minRating, selectedShop, searchData]);
  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [priceRange, sortOptionPrice, sortOptionAlpha, minRating, itemsPerPage, selectedShop, searchData]);

  // Pagination controls
  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const visiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(visiblePages / 2));
    let endPage = Math.min(totalPages, startPage + visiblePages - 1);

    if (endPage - startPage < visiblePages - 1) {
      startPage = Math.max(1, endPage - visiblePages + 1);
    }

    return (
      <div className="flex flex-col items-center mt-8">
        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiChevronLeft className="w-5 h-5" />
          </button>

          {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded-lg ${
                currentPage === page
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 hover:bg-gray-200'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Hiển thị {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredData.length)} trong tổng số {filteredData.length} sản phẩm
        </div>
      </div>
    );
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="bg-gray-50 min-h-screen">
          <Header activeHeading={3} /> 
          <div className="container mx-auto px-4 py-8">
            {/* Filters Section */}
            <div className="bg-white p-6 rounded-xl shadow-lg mb-8 border border-gray-100 z-10 block sticky top-20">
              <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
                <FiFilter className="text-blue-600" />
                Bộ lọc & Sắp xếp
              </h2>

              <div className="flex items-center gap-4 overflow-x-auto pb-2">
                {/* Shop Name Filter */}
                <div className="min-w-[180px] pl-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <FiSearch className="text-blue-600" />
                    Chọn quán
                  </label>  
                  <div className="relative">
                    <select
                      value={selectedShop}
                      onChange={(e) => setSelectedShop(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                    >
                      <option value="">Tất cả quán</option>
                      {sellers.map((seller) => (
                        <option key={seller._id} value={seller.name}>
                          {seller.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Price Range Filter */}
                <div className="min-w-[350px]">
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <FiDollarSign className="text-green-600" />
                    Khoảng giá
                  </label>
                  <div className="px-2 pt-2 pb-1">
                    <Slider
                      range
                      min={0}
                      max={1000000}
                      value={priceRange}
                      onChange={setPriceRange}
                      trackStyle={{ backgroundColor: "#3B82F6", height: 4 }}
                      handleStyle={[
                        {
                          borderColor: "#3B82F6",
                          backgroundColor: "#fff",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          height: 20,
                          width: 20,
                          marginTop: -8,
                        },
                      ]}
                      railStyle={{ backgroundColor: "#E5E7EB", height: 4 }}
                    />
                  </div>
                  <div className="flex justify-between text-sm text-gray-600 mt-1 px-1">
                    <span>{priceRange[0].toLocaleString()}đ</span>
                    <span>{priceRange[1].toLocaleString()}đ</span>
                  </div>
                </div>
               
                {/* Rating Filter */}
                <div className="min-w-[170px]">
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <FiStar className="text-yellow-500" />
                    Đánh giá tối thiểu
                  </label>
                  <div className="relative">
                    <select
                      value={minRating}
                      onChange={(e) => setMinRating(+e.target.value)}
                      className="text-yellow-400 w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                    >
                      <option value={0} className="text-black">Tất cả đánh giá</option>
                      {[1, 2, 3, 4, 5].map((num) => (
                        <option key={num} value={num} className="text-yellow-500">
                          <span className="text-yellow-500">{Array(num).fill("★").join("")}</span>
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Sort by Price */}
                <div className="min-w-[200px]">
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <FiDollarSign className="text-green-600" />
                    Sắp xếp theo giá
                  </label>
                  <div className="relative">
                    <select
                      value={sortOptionPrice}
                      onChange={(e) => setSortOptionPrice(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                    >
                      <option value="none">Chọn sắp xếp</option>
                      <option value="price-asc">Giá: Thấp đến cao</option>
                      <option value="price-desc">Giá: Cao đến thấp</option>
                    </select>
                  </div>
                </div>

                {/* Sort by Alphabetical */}
                <div className="min-w-[200px]">
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <FiList className="text-green-600" />
                    Sắp xếp theo bảng chữ cái
                  </label>
                  <div className="relative">
                    <select
                      value={sortOptionAlpha}
                      onChange={(e) => setSortOptionAlpha(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                    >
                      <option value="none">Chọn sắp xếp</option>
                      <option value="alphabetical">Theo bảng chữ cái</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Products Grid and Pagination */}
            <div className="mb-8">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
                {currentItems.length > 0 ? (
                  currentItems.map((product) => (
                    <ProductCard 
                      key={product._id} 
                      data={product} 
                      className="transition-transform duration-300 hover:scale-105"
                    />
                  ))
                ) : (
                  <div className="col-span-full text-center py-12">
                    <div className="inline-block p-6 bg-white rounded-lg shadow-md border border-gray-100">
                      <h1 className="text-xl font-medium text-gray-700">
                        Không tìm thấy sản phẩm phù hợp
                      </h1>
                      <p className="mt-2 text-gray-500">
                        Hãy thử điều chỉnh bộ lọc của bạn
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Pagination Controls */}
              {renderPagination()}

              {/* Items Per Page Selector */}
              <div className="mt-6 flex items-center justify-end">
                <div className="text-sm text-gray-600 px-3">
                  Số sản phẩm mỗi trang:   
                </div>
                <select
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                  className="px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={4}>4</option>
                  <option value={8}>8</option>
                  <option value={12}>12</option>
                  <option value={16}>16</option>
                </select>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      )}
    </>
  );
};

export default ProductsPage;