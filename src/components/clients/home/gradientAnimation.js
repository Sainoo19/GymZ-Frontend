const gradientAnimation = `
@keyframes gradientAnimation {
  0% {
    background: linear-gradient(45deg, #F59E0B 0%, #FFEC7F 80%, #FFEC7F 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  50% {
    background: linear-gradient(45deg, #FFEC7F 0%, #F59E0B 80%, rgba(245, 158, 11, 1) 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
  100% {
    background: linear-gradient(45deg, #F59E0B 0%, #FFEC7F 80%, #FFEC7F 100%);
    -webkit-background-clip: text;
    background-clip: text;
    color: transparent;
  }
}
   /* Tạo hiệu ứng mượt mà khi chuyển màu */
.gradient-text {
  background: linear-gradient(45deg, rgba(245, 158, 11, 1) 0%, #FFEC7F 80%, #FFEC7F 100%);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: gradientAnimation 5s ease-in-out infinite;

}
`;

export default gradientAnimation;

