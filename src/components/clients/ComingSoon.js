import React from "react";
import { Construction } from "lucide-react"; // icon đẹp từ lucide-react

const ComingSoon = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-md text-center max-w-md w-full">
        <div className="flex justify-center mb-4">
          <Construction className="h-16 w-16 text-yellow-500" />
        </div>
        <h1 className="text-2xl font-bold mb-2 text-gray-800">
          Chức năng đang phát triển
        </h1>
        <p className="text-gray-600 mb-4">
          Tính năng này hiện đang được hoàn thiện. Vui lòng quay lại sau!
        </p>
        <button
          onClick={() => window.history.back()}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition"
        >
          Quay lại
        </button>
      </div>
    </div>
  );
};

export default ComingSoon;
