import React, { useEffect, useState } from "react";
import Header from "../components/Layout/Header";
import { useSelector } from "react-redux";
import Loader from "../components/Layout/Loader";
import styles from "../styles/styles";
import Footer from "../components/Layout/Footer";
import ProductCard from "../components/Route/ProductCard/ProductCard";
import Slider from "@mui/material/Slider"; // Sử dụng Material-UI Slider
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const BestSellingPage = () => {
  const [data, setData] = useState([]); 
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8); // 8 sản phẩm mỗi trang
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState([0, 1000000]); // Khoảng giá từ 0 đến 1 triệu
  const [selectedRating, setSelectedRating] = useState(null);

  const { allProducts, isLoading } = useSelector((state) => state.products);
  const { categoriesData } = useSelector((state) => state.category)

  console.log("Danh muc: ", categoriesData)
  useEffect(() => {
    if (Array.isArray(allProducts)) {
      const sortedProducts = [...allProducts].sort((a, b) => b.sold_out - a.sold_out);

      let filteredProducts = sortedProducts;

      // Áp dụng các bộ lọc
      if (selectedCategory) {
        filteredProducts = filteredProducts.filter(product => product.category === selectedCategory);
      }

      const [minPrice, maxPrice] = priceRange;
      filteredProducts = filteredProducts.filter(product => 
        product.discountPrice >= minPrice && product.discountPrice <= maxPrice
      );

      if (selectedRating) {
        filteredProducts = filteredProducts.filter(product => product.ratings >= selectedRating);
      }

      setData(filteredProducts);
      setCurrentPage(1);
      window.scrollTo(0, 0);
    }
  }, [allProducts, selectedCategory, priceRange, selectedRating]);

  const totalPages = Math.ceil(data.length / itemsPerPage);
  const paginatedData = data.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Định dạng giá thành tiền tệ
  const formatCurrency = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div>
          <Header activeHeading={2} />
          <br />
          <br />
          <div className={`${styles.section} flex flex-col md:flex-row gap-4`}>
            {/* Filter Section */}
            <div className="w-full md:w-1/4 p-4 bg-white rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Bộ lọc</h3>
              <div className="space-y-5">
                {/* Category Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">Danh mục</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">Tất cả</option>
                    {categoriesData.map((category, index) => (
                      <option key={index} value={category._id}>{category.title}</option>
                    ))}
                  </select>
                </div>

                {/* Price Filter Slider */}
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Khoảng giá: {formatCurrency(priceRange[0])} - {formatCurrency(priceRange[1])}
                  </label>
                  <Slider
                    value={priceRange}
                    onChange={(_, newValue) => setPriceRange(newValue)}
                    min={0}
                    max={1000000}
                    step={10000}
                    valueLabelDisplay="auto"
                    valueLabelFormat={formatCurrency}
                    className="w-full"
                  />
                </div>

                {/* Rating Filter */}
                <div>
                  <label className="block text-sm font-medium mb-2">Đánh giá</label>
                  <div className="flex gap-1">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <button
                        key={rating}
                        onClick={() => setSelectedRating(selectedRating === rating ? null : rating)}
                        className={`px-3 py-1 rounded-md ${
                          selectedRating === rating 
                            ? 'bg-blue-500 text-white' 
                            : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                      >
                        {rating}+
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Product Grid */}
            <div className="w-full md:w-3/4">
              <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-4 mb-12">
                {paginatedData.length === 0 ? (
                  <div className="text-center py-8 col-span-full">Không tìm thấy sản phẩm</div>
                ) : (
                  paginatedData.map((i, index) => <ProductCard data={i} key={index} />)
                )}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center gap-2 my-8">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
                  >
                   <FiChevronLeft className="w-5 h-5" />
                  </button>
                  
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`px-4 py-2 rounded-md ${
                        currentPage === i + 1 
                          ? 'bg-blue-500 text-white' 
                          : 'bg-gray-200'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 bg-gray-200 rounded-md disabled:opacity-50"
                  >
                    <FiChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

export default BestSellingPage;