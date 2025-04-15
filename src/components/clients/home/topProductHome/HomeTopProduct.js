import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import 'swiper/css';
import "swiper/css/pagination";
import "swiper/css/navigation";
import CardTopProduct from "./CardTopProduct";
import { Link } from "react-router-dom";
import axios from 'axios';

const HomeTopProduct = () => {
  const [productData, setProductData] = useState([]);
  const [loading, setLoading] = useState(true);
  const URL_API = process.env.REACT_APP_API_URL;

  // Fetch product data
  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${URL_API}orders/products/top`);

        if (response.data.status === "success") {
          setProductData(response.data.data);
        } else {
          console.error("API returned an error:", response.data.message);
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh sách:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTopProducts();
  }, []);

  // Format price range to display
  const formatPriceRange = (priceRange) => {
    if (!priceRange) return "Đang cập nhật";

    const prices = priceRange.split('-');
    if (prices.length === 1) {
      // Single price
      return new Intl.NumberFormat("vi-VN").format(prices[0]);
    } else {
      // Price range
      const minPrice = new Intl.NumberFormat("vi-VN").format(prices[0]);
      return `${minPrice}`;
    }
  };

  return (
    <div style={{ marginTop: "40px", marginBottom: "50px", paddingLeft: "50px", paddingRight: "50px" }}>
      <h1 className="text-3xl font-bold text-center" style={{ margin: "20px", }}>TOP SẢN PHẨM BÁN CHẠY</h1>

      {loading ? (
        <div className="flex justify-center items-center h-60">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
        </div>
      ) : (
        <Swiper
          modules={[Autoplay, Pagination, Navigation]}
          spaceBetween={40}
          slidesPerView={4}
          slidesPerGroup={1}
          pagination={{ clickable: true }}
          navigation
          loop={productData.length > 4}
          className="w-full"
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
          }}
          breakpoints={{
            320: { slidesPerView: 1, spaceBetween: 20 },
            640: { slidesPerView: 2, spaceBetween: 20 },
            768: { slidesPerView: 3, spaceBetween: 30 },
            1024: { slidesPerView: 4, spaceBetween: 40 },
          }}
        >
          {productData.map((product) => (
            <SwiperSlide key={product._id}>
              <Link to={`/productsclient/${product._id}`}>
                <CardTopProduct
                  image={product.image}
                  name={product.name}
                  price={formatPriceRange(product.priceRange)}
                  rating={product.rating || 0}
                />
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
};

export default HomeTopProduct;