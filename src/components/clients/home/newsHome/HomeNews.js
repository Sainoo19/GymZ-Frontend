import CardNews from "./CardNews";
import { Link } from "react-router-dom";


const HomeNews = () => {
  const mainImage = "https://khanhanlaw.com/Uploads/ho-so-xin-giay-phep-mo-phong-tap-gym-gom-nhung-giay-to-phap-ly-nao0.png";
  const eventName = "HỘI THAO THỂ HÌNH 2025 - GYMZ HÀ NỘI";

  const newsList = [
    {
      image: "https://khanhanlaw.com/Uploads/ho-so-xin-giay-phep-mo-phong-tap-gym-gom-nhung-giay-to-phap-ly-nao0.png",
      date: "10-02-2025",
      title: "Bí quyết tập luyện hiệu quả - Bí quyết tập luyện hiệu quả - Bí quyết tập luyện hiệu quả",
      time: "08:00 AM - 11:00 AM",
    },
    {
      image: "https://khanhanlaw.com/Uploads/ho-so-xin-giay-phep-mo-phong-tap-gym-gom-nhung-giay-to-phap-ly-nao0.png",
      date: "12-02-2025",
      title: "Dinh dưỡng cho gymer - Dinh dưỡng cho gymer - Dinh dưỡng cho gymer",
      time: "10:30 AM - 11:30 AM",
    },
    {
      image: "https://khanhanlaw.com/Uploads/ho-so-xin-giay-phep-mo-phong-tap-gym-gom-nhung-giay-to-phap-ly-nao0.png",
      date: "15-02-2025",
      title: "Lịch tập giảm mỡ tăng cơ - Lịch tập giảm mỡ tăng cơ - Lịch tập giảm mỡ tăng cơ",
      time: "02:00 PM - 04:00 PM",
    },
  ];

  return (
    <div className="relative p-8 bg-gray-100">
      {/* Banner nền */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{ backgroundImage: `url(${mainImage})` }}
      ></div>

      <h1 className="relative text-4xl font-bold text-center text-primary mb-2">
        BÀI VIẾT HỮU ÍCH
      </h1>
      <h1
        className="relative text-3xl font-bold text-center text-secondary mb-6"
        style={{ textShadow: "2px 2px 4px rgba(0, 0, 0, 0.8)" }}
      >
        DÀNH CHO GYMER
      </h1>

      <div className="relative flex flex-col lg:flex-row gap-8">
        {/* Phần trái - Sự kiện chính */}
        <div className="flex-1 border border-white bg-white shadow-lg rounded-lg mx-4 md:mx-16">
          <a href="/">
            <img
              src={mainImage}
              alt={eventName}
              className="w-full object-cover rounded-t-lg"
              style={{ height: "300px" }}
            />
          </a>
          <h2 className="text-lg text-secondary text-center font-bold my-2">{eventName}</h2>
        </div>

        {/* Phần phải - Danh sách tin tức */}
        <div className="flex-1 flex flex-col gap-4 mr-4 md:mr-8">
          {newsList.map((news, index) => (
            <a href="/" key={index}>
              <CardNews {...news} />
            </a>
          ))}
        </div>
      </div>

    </div>
  );
};

export default HomeNews;
