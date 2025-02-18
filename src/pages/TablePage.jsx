import React from "react";
import Footer from "../components/Layout/Footer";
import Header from "../components/Layout/Header";

const TablePage = () => {
    return (
        <div className="flex flex-col min-h-screen">
            <Header activeHeading={7} />
            <main className="flex-grow flex items-center justify-center bg-gray-100">
                <h1 className="text-3xl font-bold text-gray-800">
                    Chức năng đang phát triển
                </h1>
            </main>
            <Footer />
        </div>
    );
};

export default TablePage;