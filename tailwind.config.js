/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Theo dõi các file trong thư mục src
  ],
  theme: {
    extend: {
      colors: {
        primary: '#373739', // Màu xám chính
        secondary: '#FFD154', // Màu vàng đậm
        text_color_secondary: '#FFFFFF',
        text_color_primary: '#000000',
        accent: '#657786', // Màu xám nhạt
        customGreen: '#00FF00', // Màu xanh lá tùy chỉnh
      },
      fontFamily: {
        kanit: ['Kanit', 'sans-serif'],
        quicksand: ['Quicksand', 'sans-serif'],
        roboto: ['Roboto', 'sans-serif'],
      },
    },
  },
  // Đảm bảo Font Awesome không bị loại bỏ khi sử dụng purge
  safelist: [
    "fa-edit",
    "fa-trash",
    "fas",
    "fa-home",
    "fa-cogs",
    "fa-users",
    "fa-plus",
    "fa-arrow-down",
    "fa-arrow-up",
    "fa-check",
    "fa-times",
    // Thêm các lớp Font Awesome bạn sử dụng tại đây
  ],
  plugins: [],
};
