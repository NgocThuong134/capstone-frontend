import React, { useState } from "react";
import { useSelector } from "react-redux";
import styles from "../../../styles/styles";
import ProductCard from "../ProductCard/ProductCard";
import ProductDetailsCard from "../ProductDetailsCard/ProductDetailsCard"; // Import modal component

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// Import required modules
import { Pagination, Navigation } from "swiper/modules";

const FeaturedProduct = () => {
  const { allProducts } = useSelector((state) => state.products);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setOpenModal(true);
  };

  return (
    <div>
      <div className={`${styles.section} mb-12`}>
        <div className={`${styles.heading} mb-6`}>
          <h1 className="text-3xl font-bold text-left">Sản Phẩm Nổi Bật</h1>
        </div>
        {allProducts && allProducts.length > 0 ? (
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
                  slidesPerView: 3,
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
              {allProducts.map((product, index) => (
                <SwiperSlide key={index}>
                    <ProductCard data={product} onProductClick={handleProductClick} />                
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Modal Hiển Thị Chi Tiết Sản Phẩm */}
            {openModal && (
              <ProductDetailsCard 
                setOpen={setOpenModal} 
                data={selectedProduct} 
              />
            )}
          </>
        ) : (
          <h4 className="text-center text-gray-500">Không có sản phẩm nào!</h4>
        )}
      </div>
    </div>
  );
};

export default FeaturedProduct;