import React from "react";
import { FaMapMarkerAlt } from 'react-icons/fa';
import gradientAnimation from "./gradientAnimation";
import { Link } from "react-router-dom";


 
const HomeBranches = () => {


  return (
    <div className="w-full py-8 px-4">
        <style>
            {gradientAnimation}
        </style>
      {/* Tiêu đề */}
      <h1 className="text-5xl sm:text-5xl font-bold text-center mb-10">
        <span className="gradient-text">
          GymZ – Hệ Thống Phòng Gym Hiện Đại Số 1
        </span>
      </h1>

      <div className="flex flex-wrap justify-between">
          {/* Bên trái: Số 20 và phần mô tả */}
          <div className="w-full sm:w-1/2 mb-6 sm:mb-0 flex items-center pl-16">
            <div>
                {/* Số 20 lớn */}
                <p className="text-6xl font-bold inline-block mr-4 text-secondary">{`20`}</p>
                {/* Mô tả nằm ngang với số 20 */}
                <div className="inline-block">
                <p className="text-xl font-bold text-secondary">
                    Chi nhánh trải dài khắp Thành phố Hồ Chí Minh
                </p>
                <p className="text-sm">
                    Tọa lạc tại các vị trí đắc địa, dễ dàng di chuyển từ mọi khu vực.
                </p>
                </div>
            </div>
            </div>


        {/* Bên phải chia thành 3 hàng */}
        <div className="w-full sm:w-1/2">
            <div className="flex flex-col space-y-6 pr-16 pl-6 ">
                {/* Hàng 1 */}
                <div className="flex items-center pb-6">
                <p className="text-3xl font-bold mr-4">
                    <span className="bg-secondary text-black py-2 px-1 border rounded-md">01</span>
                </p>
                  <p className="text-sm">
                    Không gian rộng lớn, chuẩn quốc tế, mỗi chi nhánh sở hữu diện tích trung bình hơn 3.000m², mang đến trải nghiệm tập luyện thoải mái.
                </p>
                </div>
                
                {/* Hàng 2 */}
                <div className="flex items-center pb-6">
                <p className="text-3xl font-bold mr-4">
                    <span className="bg-secondary text-black py-2 px-1 border rounded-md">02</span>
                </p>
                <p className="text-sm">
                    Mỗi phòng tập mang phong cách riêng biệt, từ không gian tối giản hiện đại đến kiến trúc thể thao năng động, tạo cảm hứng tập luyện và khẳng định đẳng cấp.
                </p>
                </div>

                {/* Hàng 3 */}
                <div className="flex items-center pb-6">
                <p className="text-3xl font-bold mr-4">
                    <span className="bg-secondary text-black py-2 px-1 border rounded-md">03</span>
                </p>                
                <p className="text-sm">
                    Trang thiết bị tiên tiến, kết hợp cùng đội ngũ huấn luyện viên chuyên nghiệp, giúp bạn đạt được mục tiêu thể hình nhanh chóng.
                </p>
                </div>
            </div>
        </div>

      </div>
        
      <div className="ml-16">
        <a 
            href="/branches"
            className="w-56 font-bold flex items-center border border-primary rounded-md py-2 px-8 text-primary bg-transparent hover:bg-secondary"
            style={{ fontSize: '22px' }} // Kích thước chữ
        >
            <FaMapMarkerAlt className="mr-2" /> {/* Icon ở bên trái */}
            Xem ngay
        </a>
    </div>

    </div>
  );
};

export default HomeBranches;
