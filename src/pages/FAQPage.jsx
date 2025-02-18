import React, { useState } from "react";
import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";
import styles from "../styles/styles";
import { MdArrowBack } from "react-icons/md"; // Biểu tượng mũi tên quay về

const FAQPage = () => {
    return (
        <div>
            <Header activeHeading={6} />
            <Faq />
            <Footer />
        </div>
    );
};

const Faq = () => {
    const [activeTab, setActiveTab] = useState(0);

    const toggleTab = (tab) => {
        if (activeTab === tab) {
            setActiveTab(0);
        } else {
            setActiveTab(tab);
        }
    };

    return (
        <div className={`${styles.section} my-8`}>
            <h2 className="text-3xl font-bold text-gray-900 mb-8">Câu Hỏi Thường Gặp (FAQ)</h2>
            <div className="mx-auto space-y-4">
                {/* single Faq */}

                {[
                    {
                        question: "Chính sách hoàn trả của bạn là gì?",
                        answer: "Nếu bạn không hài lòng với sản phẩm của mình, chúng tôi chấp nhận hoàn trả trong vòng 30 ngày kể từ ngày giao hàng. Để bắt đầu quá trình hoàn trả, vui lòng gửi email cho chúng tôi tại support@shopNT.com với số đơn hàng của bạn và một lời giải thích ngắn gọn về lý do bạn hoàn trả sản phẩm.",
                    },
                    {
                        question: "Tôi có thể theo dõi đơn hàng của mình như thế nào?",
                        answer: "Bạn có thể theo dõi đơn hàng của mình bằng cách nhấp vào liên kết theo dõi trong email xác nhận giao hàng của bạn, hoặc bằng cách đăng nhập vào tài khoản của bạn trên trang web của chúng tôi và xem chi tiết đơn hàng.",
                    },
                    {
                        question: "Làm thế nào tôi có thể liên hệ với bộ phận hỗ trợ khách hàng?",
                        answer: "Bạn có thể liên hệ với đội ngũ hỗ trợ khách hàng của chúng tôi bằng cách gửi email cho chúng tôi tại support@myecommercestore.com, hoặc gọi cho chúng tôi theo số (555) 123-4567 trong giờ làm việc từ 9 giờ sáng đến 5 giờ chiều EST, từ thứ Hai đến thứ Sáu.",
                    },
                    {
                        question: "Tôi có thể thay đổi hoặc hủy đơn hàng của mình không?",
                        answer: "Rất tiếc, một khi đơn hàng đã được đặt, chúng tôi không thể thực hiện thay đổi hoặc hủy bỏ. Nếu bạn không còn muốn những sản phẩm đã đặt, bạn có thể hoàn trả chúng để được hoàn tiền trong vòng 30 ngày kể từ ngày giao hàng.",
                    },
                    {
                        question: "Bạn có cung cấp dịch vụ giao hàng quốc tế không?",
                        answer: "Hiện tại, chúng tôi chỉ cung cấp dịch vụ giao hàng trong nước.",
                    },
                    {
                        question: "Bạn chấp nhận những phương thức thanh toán nào?",
                        answer: "Chúng tôi chấp nhận thanh toán qua thẻ visa, mastercard, paypal và cũng có hệ thống thanh toán khi giao hàng.",
                    },
                ].map((item, index) => (
                    <div key={index} className="border-b border-gray-200 pb-4">
                        <button
                            className="flex items-center justify-between w-full"
                            onClick={() => toggleTab(index + 1)}
                        >
                            <span className="text-lg font-medium text-gray-900">
                                {item.question}
                            </span>
                            {activeTab === index + 1 ? (
                                <MdArrowBack className="h-6 w-6 text-gray-500 transform rotate-180" />
                            ) : (
                                <MdArrowBack className="h-6 w-6 text-gray-500" />
                            )}
                        </button>
                        {activeTab === index + 1 && (
                            <div className="mt-4">
                                <p className="text-base text-gray-500">
                                    {item.answer}
                                </p>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FAQPage;