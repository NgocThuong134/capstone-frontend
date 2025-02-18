import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import styles from "../../../styles/styles";
import ProductCard from "../ProductCard/ProductCard";
import ProductDetailsCard from "../ProductDetailsCard/ProductDetailsCard"; // Import modal component

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "../../../styles/styles.css";
import { Pagination, Navigation } from "swiper/modules";

const BestDeals = () => {
  const [data, setData] = useState([]);
  const { allProducts } = useSelector((state) => state.products);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const allProductsData = allProducts ? [...allProducts] : [];
    const sortedData = allProductsData.sort((a, b) => b.sold_out - a.sold_out);
    const topTenDeals = sortedData.slice(0, 10);
    setData(topTenDeals);
  }, [allProducts]);

  const handleProductClick = (item) => {
    setSelectedProduct(item);
    setOpenModal(true);
  };

  return (
    <div className={`py-10 ${styles.section}`}>
      <div className={`${styles.heading} mb-6`}>
        <h1 className="text-3xl font-bold text-left">Ưu Đãi Tốt Nhất</h1>
      </div>
      {data.length > 0 ? (
        <>
          <Swiper
            slidesPerView={4}
            spaceBetween={10}
            pagination={{
              clickable: true,
            }}
            navigation={true}
            breakpoints={{
              640: {
                slidesPerView: 1,
                spaceBetween: 20,
              },
              768: {
                slidesPerView: 2,
                spaceBetween: 30,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 40,
              },
              1280: {
                slidesPerView: 4,
                spaceBetween: 50,
              },
            }}
            modules={[Pagination, Navigation]}
            className="mySwiper"
          >
            {data.map((item, index) => (
              <SwiperSlide key={index}>
                <ProductCard data={item} onProductClick={handleProductClick} />
              </SwiperSlide>
            ))}
          </Swiper>

          {openModal && (
            <ProductDetailsCard 
              setOpen={setOpenModal} 
              data={selectedProduct} 
            />
          )}
        </>
      ) : (
        <p className="text-center text-gray-500">Không có sản phẩm nào!</p>
      )}
    </div>
  );
};

export default BestDeals;