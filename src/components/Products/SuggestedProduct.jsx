import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";
import styles from "../../styles/styles";
import ProductCard from "../Route/ProductCard/ProductCard";
import ProductDetailsCard from '../Route/ProductDetailsCard/ProductDetailsCard';

const SuggestedProduct = ({ data }) => {
    const { allProducts } = useSelector((state) => state.products);
    const [productData, setProductData] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [openModal, setOpenModal] = useState(false);

    // Lọc sản phẩm khi category giống với sản phẩm hiện tại
    useEffect(() => {
        if (data) {
            const filteredProducts = allProducts.filter((i) => i.category === data.category);
            setProductData(filteredProducts.slice(0, 5)); // Chỉ lấy 5 sản phẩm
        }
    }, [data, allProducts]);

    const handleProductClick = (item) => {
        setSelectedProduct(item);
        setOpenModal(true);
    };

    return (
        <div className='mt-4'>
            {data && (
                <div className={`p-4 ${styles.section}`}>
                    <h2 className={`${styles.heading} text-[25px] font-[500] border-b mb-5`}>
                        Sản phẩm tương tự
                    </h2>
                    <div className="grid grid-cols-1 gap-[20px] md:grid-cols-2 md:gap-[25px] lg:grid-cols-4 lg:gap-[25px] xl:grid-cols-5 xl:gap-[30px] mb-12">
                        {productData.map((item, index) => (
                            <ProductCard key={item._id} data={item} onProductClick={handleProductClick} />
                        ))}
                    </div>
                    {openModal && (
                        <ProductDetailsCard 
                            setOpen={setOpenModal} 
                            data={selectedProduct} 
                        />
                    )}
                </div>
            )}
        </div>
    );
}

export default SuggestedProduct;