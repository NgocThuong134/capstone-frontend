import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AiOutlineSearch, AiOutlineClose, AiOutlineDelete } from 'react-icons/ai';
import { backend_url } from '../../server';
import removeAccents from 'remove-accents';
import Swal from 'sweetalert2';
import { useNavigate } from "react-router-dom";

// Định dạng tiền tệ
const formatCurrency = (amount) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + ' đ';
};

const SearchComponent = ({ allProducts }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [searchData, setSearchData] = useState([]);
    const [recentSearches, setRecentSearches] = useState(() => {
        const savedSearches = localStorage.getItem('recentSearches');
        return savedSearches ? JSON.parse(savedSearches) : [];
    });
    const [isSearching, setIsSearching] = useState(false);
    const navigate = useNavigate();
    const handleSearchChange = (e) => {
        const term = e.target.value;
        setSearchTerm(term);
        
        if (!term.trim()) {
            setSearchData([]);
            return;
        }
        if (isSearching) return null;
        const normalizedTerm = removeAccents(term.toLowerCase());
        const filteredProducts = allProducts?.filter((product) => {
            const normalizedProductName = removeAccents(product.name.toLowerCase());
            const normalizedProductDescription = removeAccents(product.description.toLowerCase());
            return (
                normalizedProductName.includes(normalizedTerm) ||
                normalizedProductDescription.includes(normalizedTerm)
            );
        }).slice(0, 5) || [];
        
        setSearchData(filteredProducts);
    };

    const handleSelectProduct = (term) => {
        
        setSearchTerm(term);
        // Đặt cờ tìm kiếm thành true
        setIsSearching(true);
        if (!term.trim()) {
            setSearchData([]);
            return;
        }
        setSearchData([]);
        if (!recentSearches.includes(term) && term.trim() !== '') {
            const updatedSearches = [...recentSearches, term].slice(-5);
            setRecentSearches(updatedSearches);
            localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
        }
    };

    const handleClearSearch = () => {
        setIsSearching(false)
        setSearchTerm('');
        setSearchData([]);
    };

    const handleRecentSearch = (term) => {
        // Đặt cờ tìm kiếm thành true
        setIsSearching(true);
        setSearchTerm(term);
        navigate(`/products?search=${term}`);
    };

    const submitSearch = (term) => {
        if (!term.trim()) {
            setSearchData([]);
            return;
        }
        // Đặt cờ tìm kiếm thành true
        setIsSearching(true);
        if (!recentSearches.includes(term) && term.trim() !== '') {
            const updatedSearches = [...recentSearches, term].slice(-5);
            setRecentSearches(updatedSearches);
            localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
        }
        navigate(`/products?search=${term}`);
    }

    const handleDeleteSearchTerm = (term) => {
        Swal.fire({
            title: 'Xác nhận xóa?',
            text: "Bạn có chắc chắn muốn xóa từ khóa này?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Có, xóa!',
            cancelButtonText: 'Không'
        }).then((result) => {
            if (result.isConfirmed) {
                const updatedSearches = recentSearches.filter((search) => search !== term);
                setRecentSearches(updatedSearches);
                localStorage.setItem('recentSearches', JSON.stringify(updatedSearches)); 
                Swal.fire(
                    'Đã xóa!',
                    'Từ khóa đã được xóa.',
                    'success'
                );
            }
        });
    }

    return (
        <div className="relative w-[50%]">
            <div className="relative">
                <input
                    type="text"
                    placeholder="Nhập thông tin cần tìm..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            submitSearch(searchTerm);
                        }
                    }}
                    className="h-[40px] w-full px-3 border-2 border-[#3957db] rounded-md focus:outline-none"
                />
                <AiOutlineSearch
                    size={24}
                    className="absolute right-3 top-2 cursor-pointer text-gray-600 hover:scale-125"
                    onClick={()=> submitSearch(searchTerm)}
                />
                {searchTerm && (
                    <AiOutlineClose
                        size={20}
                        className="absolute right-10 top-2 cursor-pointer text-gray-600 hover:text-red"
                        onClick={handleClearSearch}
                    />
                )}
            </div>

            {recentSearches.length > 0 && (
                <div className="flex gap-2 flex-wrap mt-2">
                    {recentSearches.map((term, index) => (
                        <div key={index} className="flex items-center bg-gray-200 py-1 px-2 rounded-md cursor-pointer hover:bg-blue-300 transition">
                            <span
                                onClick={() => handleRecentSearch(term)}
                            >
                                {term}
                            </span>
                            <AiOutlineDelete
                                size={16}
                                className="ml-2 text-red cursor-pointer hover:text-red-700"
                                onClick={() => handleDeleteSearchTerm(term)}
                            />
                        </div>
                    ))}
                </div>
            )}

            {searchData.length > 0 && (
                <div className="absolute bg-white shadow-lg rounded-md z-50 p-4 w-full mt-2">
                    {searchData.map((item, index) => (
                        <Link
                            to={`/product/${item._id}`}
                            key={index}
                            onClick={() => handleSelectProduct(item.name)} 
                            className="flex items-center py-2 px-3 hover:bg-gray-100 rounded-md transition-all"
                        >
                            <img
                                src={`${backend_url}${item.images[0]}`}
                                alt={item.name}
                                className="w-[50px] h-[50px] object-cover rounded-md mr-3"
                            />
                            <div className="flex flex-col">
                                <h1 className="text-md font-semibold text-gray-800">{item.name}</h1>
                                <p className="text-sm text-gray-600 line-clamp-2">{item.description}</p>
                                <div className="flex items-center mt-1">
                                    <span className="text-lg font-bold text-red">
                                        {formatCurrency(item.discountPrice)}
                                    </span>
                                    {item.originalPrice && (
                                        <span className="text-sm text-gray-500 line-through ml-2">
                                            {formatCurrency(item.originalPrice)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchComponent;