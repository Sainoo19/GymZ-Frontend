import { useState, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/autoplay";

const images = [
  [
    "https://images.unsplash.com/photo-1651315283944-852219dff97b?q=80&w=1925&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1734668485281-c1d03fee6023?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1734668480921-2a34650b043e?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1685633224402-3410df959f98?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ],
  [
    "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1549576490-b0b4831ef60a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1593358578769-b7a7cf27cba7?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1599447421321-1c96150f0f6b?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  ],
  [
    "https://images.pexels.com/photos/7991653/pexels-photo-7991653.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/4753893/pexels-photo-4753893.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/4754135/pexels-photo-4754135.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/4753929/pexels-photo-4753929.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  ],
  [
    "https://images.pexels.com/photos/863977/pexels-photo-863977.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://plus.unsplash.com/premium_photo-1685202713512-5442057c5e77?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.unsplash.com/photo-1637632474878-8a6e873e3d94?q=80&w=2066&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.pexels.com/photos/4807082/pexels-photo-4807082.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  ],
  [
    "https://images.unsplash.com/photo-1652363723082-b1fdca4bdbd2?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://plus.unsplash.com/premium_photo-1661692296765-fc002f942423?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    "https://images.pexels.com/photos/7689285/pexels-photo-7689285.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
    "https://images.pexels.com/photos/6388513/pexels-photo-6388513.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2",
  ],
];

const buttonInfo = [
  {
    title: "Khu tập Gym",
    description:
      "Tự tin sở hữu máy móc hoàn hảo với hệ thống máy móc hiện đại và đội ngũ huấn luyện viên chuyên nghiệp.",
  },
  {
    title: "Khu tập Yoga",
    description:
      "Tìm lại sự cân bằng với phòng Tập Yoga GymZ đa dạng, huấn luyện viên kinh nghiệm sẽ giúp bạn thư giãn và giảm stress hiệu quả.",
  },
  {
    title: "Khu tập KickFit",
    description:
      "Giải phóng năng lượng và đốt cháy calo với KickFit. Kết hợp võ thuật và cadrio, giúp cải thiện sức khỏe tim mạch và sự linh hoạt.",
  },
  {
    title: "Khu tập Group X",
    description:
      "Tận hưởng không khí tập luyện sôi động với các lớp Group-X như Zumba, Aerobic, và Body Combat, mang lại năng lượng và hứng thú.",
  },
  {
    title: "Khu tập Cycling",
    description:
      "Trải nghiệm cycling đỉnh cao với hệ thống xe đạp hiện đại và âm thanh sống động. Mỗi buổi tập là một hành trình khám phá bản thân đầy thú vị.",
  },
];

export default function BranchesFlex() {
  const [selectedSlide, setSelectedSlide] = useState(0);
  const swiperRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(null); // Để hiển thị mô tả
  const [expandedIndex, setExpandedIndex] = useState(null); // theo dõi nút nào đang mở rộng

  const handleButtonClick = (index) => {
    setSelectedSlide(index);
    setExpandedIndex((prev) => (prev === index ? null : index)); // toggle mở rộng
    if (swiperRef.current) {
      swiperRef.current.swiper.slideToLoop(0, 0);
    }
  };
  const goToSlide = (index) => {
    setSelectedSlide(index); // Cập nhật slide đang được chọn
    if (swiperRef.current) {
      swiperRef.current.swiper.slideToLoop(0, 0);
    }
  };

  return (
    <div className="relative w-full h-full">
      {/* Swiper Carousel */}
      <Swiper
        ref={swiperRef}
        modules={[Pagination, Navigation, Autoplay]}
        spaceBetween={10}
        slidesPerView={1}
        loop={true}
        simulateTouch={true}
        touchRatio={0.9}
        autoplay={{ delay: 1000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        className="shadow-lg swiper-container"
      >
        {images[selectedSlide].map((img, index) => (
          <SwiperSlide key={index}>
            <div className="w-full" style={{ height: "790px" }}>
              <img
                src={img}
                alt={`Slide ${selectedSlide + 1} Image ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Buttons */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex flex-col md:flex-row justify-center items-center gap-2 z-10 w-full px-2 sm:px-0">
        {buttonInfo.map((btn, index) => {
          const isExpanded = expandedIndex === index;
          const isMobile = window.innerWidth < 640;
          const shouldShow = !isMobile || expandedIndex === null || isExpanded;

          if (!shouldShow) return null;

          return (
            <button
              key={index}
              className="relative w-1/2 sm:w-56 px-4 py-2 rounded-lg  text-xs font-bold transition-all border shadow-lg bg-opacity-40"
              onClick={() => handleButtonClick(index)}
              style={{
                color:  "white",
                backgroundColor: isExpanded
                  ? "rgba(61, 61, 61, 0.7)"
                  : "rgba(61, 61, 61, 0.7)",
                height: isExpanded ? "180px" : "45px",
                overflow: "hidden",
                transform: isExpanded ? "translateY(-20px)" : "translateY(0)",
                opacity: isExpanded ? 1 : 0.95,
                zIndex: isExpanded ? 10 : 1,
                transition:
                  "height 0.5s ease, transform 0.3s ease, opacity 0.5s ease, z-index 0s",
              }}
            >
              <div className="transition-opacity duration-300 text-sm sm:text-sm">
                {btn.title}
              </div>
              {isExpanded && (
                <div className="mt-2 text-xs ">{btn.description}</div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
