import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import MainLogo from "../../../assets/images/fauget-removebg-preview 2.png";
import { Dialog, DialogPanel, PopoverGroup } from "@headlessui/react";
import HamburgerIcon from "../../../assets/icons/bars-3.svg";
import XMarkIconSVG from "../../../assets/icons/x-mark.svg";
import ShoppingCart from "../../../assets/icons/shopping-cart.svg";
import { motion, AnimatePresence } from "framer-motion";

const HeaderClient = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const URL_API = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`${URL_API}cartClient/count-item`, { withCredentials: true })
      .then((response) => {
        setCartCount(response.data.count);
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });

    // Check if the user is logged in by checking the token in cookies
    axios
      .get("http://localhost:3000/users/profile", {
        withCredentials: true, // Ensure cookies are sent with the request
      })
      .then((response) => {
        setUser(response.data.data);

        setIsLoggedIn(true);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        setIsLoggedIn(false);
      });
  }, [isLoggedIn]);

  const handleLoginClick = () => {
    navigate("/login-user");
  };

  const handleLogoutClick = () => {
    axios
      .post(
        "http://localhost:3000/auth/logout",
        {},
        {
          withCredentials: true, // Ensure cookies are sent with the request
        }
      )
      .then(() => {
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        setIsLoggedIn(false);
        setUser(null);
        navigate("/");
      })
      .catch((error) => {
        console.error("Error logging out:", error);
      });
  };
  console.log(user);
  const defaultAvatar = "/assets/images/avatar.png";

  const handleCartClick = (event) => {
    navigate("/cart");
  };
  return (
    <header className="bg-primary  ">
      <nav
        aria-label="Global"
        className="mx-auto flex max-w-7xl items-center justify-between h-24 lg:px-8 "
      >
        <a href="/" className="m-1.5  p-1.5">
          <span className="sr-only ">Gym Z</span>
          <img
            alt="Gym-Z logo with a dumbbell icon"
            src={MainLogo}
            className="h-16 w-auto "
          />
        </a>

        <div className="flex-col mt-1 ">
          <input
            className="w-full py-1 px-4 rounded-full text-gray-800"
            placeholder="Start typing to search"
            type="text"
          />

          <PopoverGroup className="hidden mt-1 lg:flex space-x-4">
            <a
              href="/"
              className="text-sm/6 font-semibold text-white px-3 py-2 rounded-lg hover:bg-secondary hover:text-primary"
            >
              Trang chủ
            </a>
            <a
              href="/productsclient"
              className="text-sm/6 font-semibold text-white  px-3 py-2 rounded-lg hover:bg-secondary hover:text-primary"
            >
              Sản phẩm
            </a>
            <a
              href="/"
              className="text-sm/6 font-semibold text-white  px-3 py-2 rounded-lg hover:bg-secondary hover:text-primary"
            >
              Tin tức
            </a>
            <a
              href="/branches"
              className="text-sm/6 font-semibold text-white  px-3 py-2 rounded-lg hover:bg-secondary hover:text-primary"
            >
              Chi Nhánh
            </a>
            <a
              href="/about-us"
              className="text-sm/6 font-semibold text-white  px-3 py-2 rounded-lg hover:bg-secondary hover:text-primary"
            >
              Về chúng tôi
            </a>
          </PopoverGroup>
        </div>

        <div className="flex lg:hidden ">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="m-2 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
          >
            <img
              src={HamburgerIcon}
              alt="Menu"
              className="w-6 h-6 text-white z-10"
            />
          </button>
        </div>

        {!mobileMenuOpen && (
          <div className="hidden lg:flex items-center space-x-4">
            {isLoggedIn && (
              <>
                <button onClick={handleCartClick} className="relative">
                  <img
                    src={ShoppingCart}
                    alt="Cart"
                    className="h-7 w-7"
                  />
                  {cartCount > 0 && (
                    <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {cartCount}
                    </span>
                  )}
                </button>

                <div className="relative">
                  <img
                    src={user?.avatar || defaultAvatar}
                    alt="User Avatar"
                    className="h-10 w-10 rounded-full cursor-pointer"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  />
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-2 z-20">
                      <a
                        href="/profile"
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-200"
                      >
                        Quản lý tài khoản
                      </a>
                      <button
                        onClick={handleLogoutClick}
                        className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200"
                      >
                        Đăng xuất
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}

            {!isLoggedIn && (
              <button
                className="bg-yellow-500 text-gray-800 px-6 py-2 rounded hover:bg-yellow-600 transition-all font-bold"
                onClick={handleLoginClick}
              >
                Đăng nhập
              </button>
            )}
          </div>
        )}
      </nav>
      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="lg:hidden"
      >
        <div className="fixed inset-0 z-10" />
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-1/2 overflow-y-auto bg-primary px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">GymZ</span>
              <img src={MainLogo} alt="Gym-Z logo" className="h-12 w-auto" />
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-4 rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Close menu</span>
              <img
                src={XMarkIconSVG}
                alt="Close"
                className="w-6 h-6 text-white z-10"
              />
            </button>
          </div>

          {/* Hiển thị Cart và Avatar */}
          <div className=" items-center mt-6 flow-root">
            {isLoggedIn && (
              <>
                <div className="relative">
                  <div
                    className="flex items-center w-full rounded-lg px-3 py-2 text-base font-semibold text-white hover:bg-secondary hover:text-primary"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    <img
                      src={user?.avatar || defaultAvatar}
                      alt="User Avatar"
                      className="h-10 w-10 rounded-full cursor-pointer"
                    />
                    <p className="ml-2">{user?.name}</p>
                  </div>

                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="absolute left-0 mt-2 w-full bg-opacity-90 bg-transparent bg-primary rounded-md   z-20"
                      >
                        <button
                          className="block w-full text-left px-4 py-2 text-base font-semibold rounded-lg text-white hover:bg-secondary hover:text-primary"
                          onClick={handleCartClick}
                        >
                          Giỏ hàng
                        </button>
                        <a
                          href="/profile"
                          className="block w-full text-left px-4 py-2 text-base font-semibold rounded-lg text-white hover:bg-secondary hover:text-primary"
                        >
                          Quản lý tài khoản
                        </a>
                        <button
                          onClick={handleLogoutClick}
                          className="block w-full text-left px-4 py-2 text-base font-semibold rounded-lg text-white hover:bg-secondary hover:text-primary"
                        >
                          Đăng xuất
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Thêm hiệu ứng xuống cho menu */}
                <motion.div
                  animate={{ marginTop: dropdownOpen ? 120 : 0 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                ></motion.div>
              </>
            )}
          </div>
          <div className="mt-7 flow-root">
            <div className="border border-white rounded-lg mb-2"></div>
            <div className="-my-6 divide-y divide-white">
              <div className="space-y-2 py-6">
                <a
                  href="/"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-white hover:bg-secondary hover:text-primary"
                >
                  Trang chủ
                </a>
                <a
                  href="/productsclient"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-white hover:bg-secondary hover:text-primary"
                >
                  Sản phẩm
                </a>
                <a
                  href="/"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-white hover:bg-secondary hover:text-primary"
                >
                  Tin Tức
                </a>
                <a
                  href="/branches"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-white hover:bg-secondary hover:text-primary"
                >
                  Chi Nhánh
                </a>
                <a
                  href="/about"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base font-semibold text-white hover:bg-secondary hover:text-primary"
                >
                  Về chúng tôi
                </a>
                {!isLoggedIn && (
                  <button
                    className="-mx-3 w-full text-left block rounded-lg px-3  py-2 text-base font-semibold text-white hover:bg-secondary hover:text-primary"
                    onClick={handleLoginClick}
                  >
                    Đăng nhập
                  </button>
                )}
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
};
export default HeaderClient;
