import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "../../../styles/styles";
import banner1 from "../../../Assests/images/banner.jpeg";
import banner2 from "../../../Assests/images/banner.jpeg";
import banner3 from "../../../Assests/images/banner.jpeg";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"; // Biểu tượng mũi tên

const Hero = () => {
  const [currentBanner, setCurrentBanner] = useState(0);

  // Danh sách các banner
  const banners = [banner1, banner2, banner3];

  // Tự động chuyển đổi banner sau mỗi 3 giây
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % banners.length);
    }, 3000);

    return () => clearInterval(interval); // Dọn dẹp interval khi component bị hủy
  }, [banners.length]);

  // Chuyển đến banner trước đó
  const goToPreviousBanner = () => {
    setCurrentBanner((prev) =>
      prev === 0 ? banners.length - 1 : prev - 1
    );
  };

  // Chuyển đến banner tiếp theo
  const goToNextBanner = () => {
    setCurrentBanner((prev) => (prev + 1) % banners.length);
  };

  return (
    <div
      className={`relative min-h-[70vh] 800px:min-h-[80vh] w-full bg-no-repeat ${styles.noramlFlex} bg-gradient-to-r from-0% from-[#FAFAFA] to-[#FCFCFC] to-100%`}
      style={{
        backgroundImage: `url(${banners[currentBanner]})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "300px",
        transition: "background-image 0.5s ease-in-out", // Hiệu ứng chuyển đổi mượt mà
      }}
    >
      {/* Nút điều hướng trái */}
      <button
        onClick={goToPreviousBanner}
        className="absolute left-4 bg-white bg-opacity-50 p-2 rounded-full hover:bg-opacity-80 transition-all duration-200"
      >
        <FaChevronLeft className="text-gray-800" />
      </button>

      {/* Nội dung chính */}
      <div className={`${styles.section} w-[90%] 800px:w-[65%]`}>
        <div className="md:w-2/3 px-4 space-y-7">
          <h2 className="md:text-5xl text-4xl font-bold md:leading-snug leading-snug">
            Khám Phá Hương Vị Tuyệt Đỉnh Của{" "}
            <span className="text-green">Ẩm Thực</span>
          </h2>
          <p className="text-[#4A4A4A] text-xl">
            Mỗi Món Ăn Đều Kể Một Câu Chuyện Về Nghệ Thuật Ẩm Thực Và Niềm Đam Mê
          </p>
          <Link to="/products" className="inline-block">
            <div className={`${styles.button} mt-5`}>
              <button className="bg-green font-semibold btn text-white px-8 py-3 rounded-full">
                Đặt Hàng Ngay
              </button>
            </div>
          </Link>
        </div>
      </div>

      {/* Nút điều hướng phải */}
      <button
        onClick={goToNextBanner}
        className="absolute right-4 bg-white bg-opacity-50 p-2 rounded-full hover:bg-opacity-80 transition-all duration-200"
      >
        <FaChevronRight className="text-gray-800" />
      </button>

      {/* Dots điều hướng */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {banners.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentBanner(index)}
            className={`w-3 h-3 rounded-full ${
              currentBanner === index ? "bg-green" : "bg-gray-300"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;