import fauget_white from "../../../assets/images/fauget_white.png";
import FacebookIcon from "../../../assets/icons/FacebookIcon.svg";
import InstagramIcon from "../../../assets/icons/InstagramIcon.svg";
import TiktokIcon from "../../../assets/icons/TiktokIcon.svg";
import MomoBadge from "../../../assets/icons/MomoBadge.svg";
import VNPayBadge from "../../../assets/icons/VNPayBadge.svg";
import VisaBadge from "../../../assets/icons/VisaBadge.svg";
import ApplePayBadge from "../../../assets/icons/ApplePayBadge.svg";
const Footer = () => {
  const socialIcons = [
    {
      icon: (
        <img
          src={FacebookIcon}
          alt="Facebook"
          className="w-10 h-10 hover:opacity-80"
        />
      ),
      link: "https://facebook.com",
    },
    {
      icon: (
        <img
          src={InstagramIcon}
          alt="Instagram"
          className="w-10 h-10 hover:opacity-80"
        />
      ),
      link: "https://www.instagram.com",
    },
    {
      icon: (
        <img
          src={TiktokIcon}
          alt="Tiktok"
          className="w-10 h-10 hover:opacity-80"
        />
      ),
      link: "https://www.tiktok.com",
    },
  ];

  return (
    <footer
      className="mt-10 pt-12 pb-6 px-10 font-[sans-serif] tracking-wide"
      style={{ backgroundColor: "#747171" }}
    >
      <div className="max-w-screen-xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 ">
          {/* <div className="lg:flex lg:items-center "> */}
          <div className=" lg:items-center ">
            <a href="/">
              <img src={fauget_white} alt="logo" className="lg:w-3/5 md:w-1/4 sm:w-1/3  " />
            </a>
            <p className="text-white text-sm">
              Chúng tôi có tất cả những gì mà bạn cần. Hãy đến với chúng tôi để
              có một sức khoẻ khoẻ mạnh
            </p>
            <div className="lg:flex lg:items-center mt-8">
              <ul className="flex space-x-6">
                {socialIcons.map((item, index) => (
                  <li key={index}>
                    <a
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {item.icon}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <h4 className="text-lg mb-6 text-white">DOANH NGHIỆP</h4>
            <ul className="space-y-5 ">
              {["Về chúng tôI", "Sản phẩm", "Dịch vụ", "Chi nhánh"].map(
                (item, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="text-gray-300 hover:text-white text-sm"
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>
          <div>
            <h4 className="text-lg mb-6 text-white">CHI NHÁNH</h4>
            <ul className="space-y-5 ">
              {[
                "Chăm sóc khách hàng",
                "Thông tin vận chuyển",
                "Điều khoản & Điều kiện",
                "Chính sách",
              ].map((item, index) => (
                <li key={index}>
                  <a
                    href="#"
                    className="text-gray-300 hover:text-white text-sm"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-lg mb-6 text-white">FAQ</h4>
            <ul className="space-y-5">
              {["Tài khoản", "Quản lý giao hàng", "Đơn hàng", "Thanh toán"].map(
                (item, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="text-gray-300 hover:text-white text-sm"
                    >
                      {item}
                    </a>
                  </li>
                )
              )}
            </ul>
          </div>
        </div>
        <div className="border-b border-gray-300 mt-5"></div>
        <div className="flex container mx-auto mt-8 items-center w-4/5 justify-between">
          <p className="text-gray-300 text-sm ">
            GymZ © 2023 - {new Date().getFullYear()}, All Rights Reserved.
          </p>
          <div className="flex w-3/12 justify-around lg:w-1/3 sm:w-1/2 ">
            <img
              src={MomoBadge}
              alt="Momo"
              className="w-1/6 hover:opacity-80"
            />
            
            <img
              src={VNPayBadge}
              alt="VNPay"
              className="w-1/6 hover:opacity-80"
            />
            
            <img
              src={VisaBadge}
              alt="Visa"
              className="w-1/6 hover:opacity-80"
            />
            
            <img
              src={ApplePayBadge}
              alt="Apple Pay"
              className="w-1/6 hover:opacity-80"
            />
            
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
