import { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";

const images = [
  ["https://images.unsplash.com/photo-1651315283944-852219dff97b?q=80&w=1925&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 
    "https://images.unsplash.com/photo-1734668485281-c1d03fee6023?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 
    "https://images.unsplash.com/photo-1734668480921-2a34650b043e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1685633224402-3410df959f98?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
   ],
  ["https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 
    "https://images.unsplash.com/photo-1549576490-b0b4831ef60a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 
    "https://images.unsplash.com/photo-1593358578769-b7a7cf27cba7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1599447421321-1c96150f0f6b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    ],
  ["https://images.pexels.com/photos/7991653/pexels-photo-7991653.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/4753893/pexels-photo-4753893.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", 
    "https://images.pexels.com/photos/4754135/pexels-photo-4754135.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",  
    "https://images.pexels.com/photos/4753929/pexels-photo-4753929.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    ],
  ["https://images.pexels.com/photos/863977/pexels-photo-863977.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://plus.unsplash.com/premium_photo-1685202713512-5442057c5e77?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 
    "https://images.unsplash.com/photo-1637632474878-8a6e873e3d94?q=80&w=2066&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 
    "https://images.pexels.com/photos/4807082/pexels-photo-4807082.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", 
    ],
    ["https://images.unsplash.com/photo-1652363723082-b1fdca4bdbd2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 
    "https://plus.unsplash.com/premium_photo-1661692296765-fc002f942423?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D", 
    "https://images.pexels.com/photos/7689285/pexels-photo-7689285.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2", 
    "https://images.pexels.com/photos/6388513/pexels-photo-6388513.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"],
];

const buttonInfo = [
  { title: "Khu tập Gym", description: "Tự tin sở hữu máy móc hoàn hảo với hệ thống máy móc hiện đại và đội ngũ huấn luyện viên chuyên nghiệp." },
  { title: "Khu tập Yoga", description: "Tìm lại sự cân bằng với phòng Tập Yoga GymZ đa dạng, huấn luyện viên kinh nghiệm sẽ giúp bạn thư giãn và giảm stress hiệu quả." },
  { title: "Khu tập KickFit", description: "Giải phóng năng lượng và đốt cháy calo với KickFit. Kết hợp võ thuật và cadrio, giúp cải thiện sức khỏe tim mạch và sự linh hoạt." },
  { title: "Khu tập Group X", description: "Tận hưởng không khí tập luyện sôi động với các lớp Group-X như Zumba, Aerobic, và Body Combat, mang lại năng lượng và hứng thú." },
  { title: "Khu tập Cycling", description: "Trải nghiệm cycling đỉnh cao với hệ thống xe đạp hiện đại và âm thanh sống động. Mỗi buổi tập là một hành trình khám phá bản thân đầy thú vị." },
];

export default function BranchesFlex() {
    const [selectedSlide, setSelectedSlide] = useState(0);
    const swiperRef = useRef(null);
  
    const goToSlide = (index) => {
      setSelectedSlide(index); // Cập nhật slide đang được chọn
      if (swiperRef.current) {
        swiperRef.current.swiper.slideToLoop(0,0);
      }
    };
  
    return (
        <div className="relative w-full h-full ">
          {/* Slide hình ảnh - Chứa nhiều ảnh lớn trong mỗi slide */}
          <Swiper
            ref={swiperRef}
            modules={[ Pagination, Navigation]}
            spaceBetween={10}
            slidesPerView={1}
            loop={true}
            simulateTouch={true} // Bật tính năng kéo chuột
            touchRatio={0.9} // Tỉ lệ nhạy cảm với thao tác kéo
            pagination={{ clickable: true }}
            // navigation
            // autoplay={{
            //     delay: 3000, // Thời gian chuyển ảnh (3 giây)
            //     disableOnInteraction: false, // Đảm bảo auto-play vẫn tiếp tục khi người dùng tương tác
            //   }}
            className=" shadow-lg swiper-container"
            // initialSlide={selectedSlide} // Đảm bảo slide ban đầu là slide đã chọn
          >
            {/* Hiển thị nhiều ảnh lớn trong mỗi slide */}
            {images[selectedSlide].map((img, index) => (
              <SwiperSlide key={index}>
                <div className="w-full" style={{height : '790px'}}>
                  <img
                    src={img}
                    alt={`Slide ${selectedSlide + 1} Image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
    
          {/* Nút điều hướng với tên và 3 dòng giới thiệu */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-6 z-10 ">
            {buttonInfo.map((btn, index) => (
              <button
                key={index}
                className="px-4 py-2 rounded-lg shadow-md text-sm font-bold 
                 transition-all w-56 transition-all border border-white"
                onClick={() => goToSlide(index)} // Chuyển đến slide tương ứng khi nhấn
                style={{
                    color: selectedSlide === index
                        ? "black"
                        : "white" ,
                    backgroundColor: selectedSlide === index
                        ? "rgba(251, 191, 36, 1)"
                        : "rgba(251, 191, 36, 0.4)" , 
                    height: selectedSlide === index ? "150px" : "80px",                    
                    overflow: "hidden",
                    transform: selectedSlide === index ? "translateY(-15%)" : "translateY(60%)",
                    opacity: selectedSlide === index ? 1 : 0.9,
                    transition: selectedSlide === index
                        ? "height 0s ease, transform 0s ease" // Khi nhấn vào, thay đổi nhanh
                        : "height 0.9s ease, transform 0.9s ease", // Khi bỏ nhấn, thay đổi chậm
                    }}
              >
                <h4 className="text-center text-lg font-bold">{btn.title}</h4>
                <p className="text-center text-s mt-1">{btn.description}</p>
              </button>
            ))}
          </div>
        </div>
      );
  }