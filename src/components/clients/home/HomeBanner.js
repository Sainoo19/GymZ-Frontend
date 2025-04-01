import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";



const banner1 = "https://sv1.anhsieuviet.com/2025/03/28/banner1.jpg";
const banner2 = "https://images.unsplash.com/photo-1651315283944-852219dff97b?q=80&w=1925&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
const banner3 = "https://images.pexels.com/photos/7689285/pexels-photo-7689285.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";
const banner4 = "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";
const banner5 = "https://images.pexels.com/photos/7991653/pexels-photo-7991653.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2";


const HomeBanner = () => {
  const images = [banner1, banner2, banner3, banner4, banner5];

  return (
    <div className="w-full h-[690px]">
      <Swiper
        style={{ height: '690px' }}
        modules={[Autoplay, Pagination, Navigation]}
        spaceBetween={0}
        slidesPerView={1}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        // navigation
        loop={true}
        className="w-full swiper-container"
      >
        {images.map((src, index) => (
          <SwiperSlide key={index}>
            <img src={src} alt={`Slide ${index}`} className="w-full h-[680px] object-cover" />
            {/* Button overlay */}
            <button className="text-3xl absolute bottom-10 left-10 bg-yellow-500 text-white py-2 px-6 rounded-md">
              Đăng ký ngay(tạm thôi)
            </button>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HomeBanner;
