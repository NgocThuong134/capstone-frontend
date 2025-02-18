import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { brandingData } from "../../../static/data";
import { useSelector, useDispatch } from "react-redux";
import { getAllcategories } from "../../../redux/actions/category";
import styles from "../../../styles/styles";
import "../../../styles/styles.css"
import { backend_url } from "../../../server";
import { FiArrowRight } from "react-icons/fi";

// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

// import required modules
import { Pagination, Navigation } from "swiper/modules";

const Categories = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { categoriesData } = useSelector((state) => state.category);

  useEffect(() => {
    dispatch(getAllcategories());
  }, [dispatch]);

  return (
    <>
      {/* Phần Thương hiệu */}
      <div className={`${styles.section} hidden sm:block`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 my-12">
          {brandingData.map((i, index) => (
            <div 
              key={index}
              className="flex items-center p-4 bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <div className="flex-shrink-0 bg-[#e5faf6] p-3 rounded-lg">
                {React.cloneElement(i.icon, { className: "w-8 h-8 text-green" })}
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-semibold text-gray-800">{i.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{i.Description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Phần Danh mục */}
      <div className={`${styles.section} bg-white p-6 rounded-2xl shadow-sm mb-12`}>
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Khám Phá Danh Mục</h2>
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
          {categoriesData?.map((i) => (
            <SwiperSlide key={i._id}>
              <div
                onClick={() => navigate(`/products?category=${i._id}`)}
                className="group relative h-48 rounded-xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-lg"
              >
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent z-10"/>
                
                <img
                  src={`${backend_url}${i.thumbnail.url}`}
                  alt={i.title}
                  className="w-full h-full object-cover transform group-hover:scale-105 transition-all duration-300"
                />
                
                <div className="absolute bottom-0 left-0 z-20 p-4">
                  <h5 className="text-xl font-semibold text-white">{i.title}</h5>
                  <div className="flex items-center mt-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <span className="text-white text-sm">Khám Phá Ngay</span>
                    <FiArrowRight className="ml-2 text-white" />
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
};

export default Categories;