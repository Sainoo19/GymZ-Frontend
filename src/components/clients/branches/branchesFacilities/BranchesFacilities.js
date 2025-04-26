import React, { useState, useEffect } from "react";
import axios from 'axios';
import CardFacilities from "./CardFacilities";

const BranchesFacilities = () => {
  const [branches, setBranches] = useState({});
  const [selectedCity, setSelectedCity] = useState(null);
  const URL_API = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await axios.get(`${URL_API}branches/all/nopagination`);
        const groupedBranches = groupByCity(response.data.data);
        setBranches(groupedBranches);
        setSelectedCity(Object.keys(groupedBranches)[0] || null);
      } catch (error) {
        console.error("Lỗi khi lấy danh sách chi nhánh:", error);
      }
    };

    fetchBranches();
  }, []);

  // Hàm nhóm danh sách chi nhánh theo thành phố
  const groupByCity = (data) => {
    return data.reduce((acc, branch) => {
      const city = branch.address?.city || "Khác";
      if (!acc[city]) acc[city] = [];
      acc[city].push(branch);
      return acc;
    }, {});
  };

  return (
    <div className="flex justify-center items-center bg-secondary flex-col relative">
      {/* Lớp phủ đen tối nền */}
      <div className="absolute inset-0 bg-black opacity-30 z-10"></div>
  
      <div className="w-full max-w-6xl p-6 m-6 rounded-lg shadow-lg relative z-20"
            style={{
          backgroundImage: `url('https://png.pngtree.com/thumb_back/fw800/background/20230623/pngtree-sci-fi-tunnel-with-ornamental-design-in-4k-uhd-a-3d-image_3657746.jpg')`, // Thay bằng URL ảnh nền
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          position: "relative",
        }}
      >
        {/* Lớp phủ tối màu */}
        <div className="absolute inset-0 bg-black opacity-70 rounded-lg"></div>
        
        {Object.keys(branches).length === 0 ? (
          <p className="text-center text-gray-600 ">Đang tải dữ liệu...</p>
        ) : (
          <>
            {/* Danh sách nút chọn tỉnh/thành */}
            <div className="flex justify-center gap-4 mb-6 relative z-10">
              {Object.keys(branches).map((city) => (
                <button
                  key={city}
                  className={`px-4 py-2 shadow-lg border rounded-lg transition-all duration-300 text-lg ${
                    selectedCity === city
                      ? "bg-secondary text-black font-bold text-xl"
                      : "text-white hover:bg-yellow-100 hover:text-black"
                  }`}
                  onClick={() => setSelectedCity(city)}
                >
                  {city}
                </button>
              ))}
            </div>
  
            {/* Danh sách cơ sở theo tỉnh/thành */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center relative z-10">
              {branches[selectedCity]?.map((branch) => (
                <CardFacilities
                  key={branch._id}
                  image={
                    branch.image ||
                    "https://khanhanlaw.com/Uploads/ho-so-xin-giay-phep-mo-phong-tap-gym-gom-nhung-giay-to-phap-ly-nao0.png"
                  }
                  street={branch.address?.street || "Chưa cập nhật"}
                  name={branch.name}
                />
              ))}
            </div>
          </>
        )}
      </div>
  
      {/* Phần chứa các đoạn văn ở ngoài */}
      <div className="w-full p-6 text-white text-xl relative z-20">
        <p className=" ml-24 mb-4 max-w-3xl text-left">
          Bạn đang tìm kiếm một phòng tập hiện đại và tiện nghi gần đây? GymZ với nhiều chi nhánh trải khắp đất nước, chắc chắn sẽ có một địa điểm phù hợp với bạn.
        </p>
        <p className="text-gray-700 mb-4 text-right mr-12 font-bold text-2xl blinking-text">
          Các cơ sở GymZ tại các thành phố khác nhau sẽ luôn sẵn sàng chào đón bạn.
        </p>
        <p className="max-w-3xl text-left ml-48 text-lg">
          Với không gian rộng rãi, thoáng mát và đầy đủ các loại máy móc, thiết bị, chúng tôi cam kết mang đến cho bạn những trải nghiệm tập luyện tốt nhất.
        </p>
      </div>
  
      {/* Phần chạy chữ marquee */}
      <div className="w-full max-w-full text-white animate-marquee-container-branches-facilities z-20 bg-gray-900"
       >
        <p className="text-2xl my-4 animate-marquee-text-branches">
          Hãy chọn cơ sở gần bạn nhất để bắt đầu hành trình sức khỏe!
        </p>
      </div>
    </div>
  );
  
};

export default BranchesFacilities;
