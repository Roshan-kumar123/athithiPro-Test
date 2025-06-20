import React from "react";

const Header = () => {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Insights & Analytics
          </h1>
          <p className="text-gray-600 mt-1">
            Data-driven insights to improve your business
          </p>
        </div>
      </div>
    </div>
  );
};

export default Header;
