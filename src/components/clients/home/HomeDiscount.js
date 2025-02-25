import { useState, useEffect } from "react";
import { Link } from "react-router-dom";




const HomeDiscount = () => {


  // truyền tạm 
  const imageSrc = "https://bizweb.dktcdn.net/100/011/344/products/on-whey-gold-standard-mocha-cappuccino-5lbs-whey-protein-gymstore-jpeg.jpg?v=1688460891693";
  const startTime = "2025-02-19T00:00:00";
  const endTime = "2025-04-25T15:02:00";
  // const discount = 20 ;


  const calculateTimeLeft = () => {
    if (!endTime) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

    const now = new Date().getTime();
    const end = new Date(endTime).getTime();

    if (isNaN(end)) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

    const difference = end - now;

    return difference > 0
      ? {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / (1000 * 60)) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      }
      : { days: 0, hours: 0, minutes: 0, seconds: 0 };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  const [isExpired, setIsExpired] = useState(false); // Trạng thái kiểm tra hết hạn

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft();
      setTimeLeft(newTimeLeft);

      // Kiểm tra nếu đã hết hạn
      if (
        newTimeLeft.days === 0 &&
        newTimeLeft.hours === 0 &&
        newTimeLeft.minutes === 0 &&
        newTimeLeft.seconds === 0
      ) {
        setIsExpired(true);
        clearInterval(timer); // Dừng setInterval để tối ưu hiệu suất
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (isExpired) return null; // Ẩn component khi hết thời gian



  return (
    <div className="bg-primary text-white p-10 flex justify-between items-center">
      {/* Hình ảnh sản phẩm */}
      <img src={imageSrc} alt="Khuyến mãi" className="w-1/3 object-contain" />

      {/* Nội dung */}
      <div className="text-center flex-1 px-8">
        <p className="text-xl font-semibold pb-8">SẢN PHẨM MỚI</p>
        <h2 className="text-4xl font-bold mt-2 pb-4">
          GIẢM GIÁ CỰC SỐC {/* <span className="text-secondary text-7xl">{discount}%</span>  */}
        </h2>

        {/* Bộ đếm ngược */}
        <div className="flex justify-center gap-3 mt-4 pb-8">
          {["Ngày", "Giờ", "Phút", "Giây"].map((unit, index) => {
            const values = [
              timeLeft.days,
              timeLeft.hours,
              timeLeft.minutes,
              timeLeft.seconds,
            ];
            return (
              <div key={unit} className="text-center border p-3 rounded-md">
                <p className="text-2xl font-bold">{values[index]}</p>
                <p className="text-sm">{unit}</p>
              </div>
            );
          })}
        </div>

        {/* Nút Mua Sắm tạm thời để chạy đến product */}
        <Link
          to="/productsclient"
          className="text-xl mt-6 px-6 py-2 border border-secondary text-secondary rounded-lg hover:bg-secondary hover:text-black transition"
        >
          MUA SẮM
        </Link>
      </div>
    </div>
  );
};

export default HomeDiscount;
