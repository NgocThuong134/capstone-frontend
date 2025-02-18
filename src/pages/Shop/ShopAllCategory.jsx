import React from "react";
import DashboardHeader from "../../components/Shop/Layout/DashboardHeader";
import DashboardSideBar from "../../components/Shop/Layout/DashboardSideBar";
import AllCategories from "../../components/Shop/AllCategory";

const ShopAllCategories = () => {
  return (
    <div>
      <DashboardHeader />
      <div className="flex justify-between w-full">
        <div className="w-[80px] 800px:w-[330px]">
          <DashboardSideBar active={13} />
        </div>
        <div className="w-full justify-center flex">
          <AllCategories />
        </div>
      </div>
    </div>
  );
};

export default ShopAllCategories;
