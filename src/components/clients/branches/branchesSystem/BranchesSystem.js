import React, { useState, useEffect } from "react";
import axios from 'axios';
import CardBranchesSystem from "./CardBranchesSystem";
import gradientAnimation from "../../home/gradientAnimation";


const BranchesSystem = () => {

    const [branches, setBranches] = useState([]);

    const BACKGROUND_IMAGE_URL = "https://png.pngtree.com/background/20230526/original/pngtree-futuristic-image-of-blue-lines-intersecting-the-dark-picture-image_2746757.jpg";


    useEffect(() => {
        const fetchBranches = async () => {
            try {
                const response = await axios.get("http://localhost:3000/branches/all/nopagination"); // 🔹 Thay URL_API bằng API thực tế
                setBranches(response.data.data); // 🔹 Cập nhật danh sách chi nhánh
            } catch (error) {
                console.error("Lỗi khi lấy danh sách chi nhánh:", error);
            }
        };

        fetchBranches();

    }, []);



  return (
    <div className="relative bg-cover bg-center" style={{ backgroundImage: `url('${BACKGROUND_IMAGE_URL}')`}}>
      <div className="absolute inset-0 bg-black opacity-70"></div>

      <div className="relative z-10 text-center py-10 text-white">
        <style>
              {gradientAnimation}
        </style>
        <h1 className="text-3xl md:text-4xl font-bold py-4 gradient-text">HỆ THỐNG GYMZ</h1>
      </div>

      <div className="relative z-10 flex flex-col items-center gap-6 px-6 pb-16">
        {branches.map((branch) => (
          <CardBranchesSystem key={branch._id} {...branch} />
        ))}
      </div>
    </div>
  );
};

export default BranchesSystem;
