import React from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Banner = () => {
    // Slider settings
    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 3000,
        arrows: true,
        pauseOnHover: true,
    };

    // Sample banner images (replace with your own images)
    const banners = [
        {
            src: "/assets/images/banners/slider_6.jpg",
            alt: "Banner 1",
        },
        {
            src: "/assets/images/banners/slider_2.webp",
            alt: "Banner 2",
        },
        {
            src: "/assets/images/banners/slider_3.webp",
            alt: "Banner 3",
        },
    ];

    return (
        <div className="w-full aspect-[21/5] mb-4 overflow-hidden"> {/* aspect thấp hơn */}
            <Slider {...settings}>
                {banners.map((banner, index) => (
                    <div key={index} className="flex items-center justify-center bg-white h-full w-full">
                        <img
                            src={banner.src}
                            alt={banner.alt}
                            className="w-full h-full object-contain"
                            style={{ objectPosition: "center" }} // Đảm bảo ảnh nằm giữa
                        />
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default Banner;