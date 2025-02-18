import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "../../styles/styles";
import { backend_url } from "../../server";

const DropDown = ({ categoriesData, setDropDown }) => {
    const navigate = useNavigate();

    const submitHandle = (i) => {
        navigate(`/products?category=${i._id}`);
        setDropDown(false); 
    };

    return (
        <div className="pb-4 w-[270px] bg-[#fff] absolute z-30 rounded-b-md shadow-sm border border-gray-200">
            {/* Hiển thị thông báo nếu không có danh mục */}
            {!categoriesData || categoriesData.length === 0 ? (
                <div className="p-3 text-center text-gray-500">Không có danh mục nào</div>
            ) : (
                categoriesData.map((i, index) => (
                    <div
                        key={index}
                        className={`${styles.noramlFlex} p-2 hover:bg-gray-100 cursor-pointer transition-all duration-200 z-30`}
                        onClick={() => submitHandle(i)}
                    >
                        {/* Hiển thị hình ảnh nếu có */}
                        {i.thumbnail && i.thumbnail.url && (
                            <img
                                src={`${backend_url}${i.thumbnail.url}`}
                                style={{
                                    width: "50px",
                                    height: "50px",
                                    objectFit: "contain",
                                    marginLeft: "10px",
                                    userSelect: "none",
                                }}
                                alt="Drop Down img"
                                className="rounded-full"
                            />
                        )}
                        <h3 className="m-3 cursor-pointer select-none text-gray-700 hover:text-blue-500">
                            {i.title}
                        </h3>
                    </div>
                ))
            )}
        </div>
    );
};

export default DropDown;