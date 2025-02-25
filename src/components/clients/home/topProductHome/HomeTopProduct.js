import React, { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import 'swiper/css';
import "swiper/css/pagination";
import "swiper/css/navigation";
import CardTopProduct from "./CardTopProduct";
import { Link } from "react-router-dom";
import axios from 'axios';


// Dữ liệu giả để truyền vào
// const productData = [
//   { id: 1, image: "https://bizweb.dktcdn.net/100/011/344/products/on-whey-gold-standard-mocha-cappuccino-5lbs-whey-protein-gymstore-jpeg.jpg?v=1688460891693", name: "Product 1", price: "29.99", rating: 4 },
//   { id: 2, image: "https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg", name: "Product 2", price: "19.99", rating: 5 },
//   { id: 3, image: "https://bizweb.dktcdn.net/100/011/344/products/on-whey-gold-standard-mocha-cappuccino-5lbs-whey-protein-gymstore-jpeg.jpg?v=1688460891693", name: "Product 3", price: "39.99", rating: 3 },
//   { id: 4, image: "https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg", name: "Product 4", price: "49.99", rating: 5 },
//   { id: 5, image: "https://bizweb.dktcdn.net/100/011/344/products/on-whey-gold-standard-mocha-cappuccino-5lbs-whey-protein-gymstore-jpeg.jpg?v=1688460891693", name: "Product 5", price: "59.99", rating: 4 },
//   { id: 6, image: "https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg", name: "Product 6", price: "69.99", rating: 2 },
//   { id: 7, image: "https://bizweb.dktcdn.net/100/011/344/products/on-whey-gold-standard-mocha-cappuccino-5lbs-whey-protein-gymstore-jpeg.jpg?v=1688460891693", name: "Product 7", price: "79.99", rating: 4 },
//   { id: 8, image: "https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg", name: "Product 8", price: "89.99", rating: 5 },
// ];

const price = '22.222';
const rating = 3;

const HomeTopProduct = () => {

  const [productData, setProductData] = useState([]);


    useEffect(() => {
      const fetchTopProducts = async () => {
          try {
              const response = await axios.get("http://localhost:3000/orders/products/top"); // 🔹 Thay URL_API bằng API thực tế
              const topProducts = response.data; // 🔹 Cập nhật danh sách 

              const productDetails = await Promise.all(
                topProducts.map(async (product) => {
                  try {
                    const productResponse = await axios.get(`http://localhost:3000/products/${product._id}`);
                    console.log("Dữ liệu sản phẩm lấy được:", productResponse.data); 
                    return productResponse.data.data;
                  } catch (productError) {
                    console.error("Lỗi khi lấy dữ liệu sản phẩm:", productError);
                    return null; 
                  }
                })
              );
              setProductData(productDetails);
          } catch (error) {
              console.error("Lỗi khi lấy danh sách:", error);
          }
      };

      fetchTopProducts();

  }, []);

  return (
    <div style={{marginTop: "40px", marginBottom: "50px", paddingLeft: "50px", paddingRight: "50px"}}>
      <h1 className="text-3xl font-bold text-center" style={{ margin: "20px", }}>TOP SẢN PHẨM BÁN CHẠY</h1>
      <Swiper
      modules={[Autoplay, Pagination, Navigation]}
      spaceBetween={40}
        slidesPerView={4}
        slidesPerGroup={1}
        pagination={{ clickable: true }}
        navigation
        loop={true}
        className="w-full"
        autoplay={{        // Tự động chuyển slide sau mỗi 1 giây
            delay: 1000,
            disableOnInteraction: false, // Khi người dùng tương tác, autoplay không bị dừng
          }}
        //   breakpoints={{
        //     320: {
        //       slidesPerView: 1, // Hiển thị 1 slide trên màn hình nhỏ
        //     },
        //     768: {
        //       slidesPerView: 2, // Hiển thị 2 slide trên màn hình trung bình
        //     },
        //     1024: {
        //       slidesPerView: 2, // Hiển thị 4 slide trên màn hình lớn
        //     },
        // }}
      >
        {productData.map((product) => (
          <SwiperSlide key={product._id}>
            <Link to="/productsclient"> {/* Thêm Link ở đây */}
              <CardTopProduct
                image={product.avatar}
                name={product.name}
                price={product.variations.length > 0 ? new Intl.NumberFormat("vi-VN").format(product.variations[0].salePrice) : "Đang cập nhật"}                 rating={rating}
              />
            </Link>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default HomeTopProduct;
