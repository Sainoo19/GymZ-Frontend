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
import { ReactComponent as Expand_Down } from "../../../assets/icons/Expand_down_light.svg";

const HeaderClient = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [activeItem, setActiveItem] = useState("/");
  const URL_API = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    // Set active menu item based on current path
    setActiveItem(window.location.pathname);

    axios
      .get(`${URL_API}cartClient/count-item`, { withCredentials: true })
      .then((response) => {
        setCartCount(response.data.count);
      })
      .catch((error) => {
        console.error("Error fetching cart count:", error);
      });

    // Check if the user is logged in by checking the token in cookies
    axios
      .get(`${URL_API}users/profile`, {
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
  }, [isLoggedIn, URL_API]);

  const handleLoginClick = () => {
    navigate("/login-user");
  };

  const handleLogoutClick = () => {
    axios
      .post(
        `${URL_API}auth/logout`,
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

  const defaultAvatar = "/assets/images/avatar.png";

  const handleCartClick = () => {
    navigate("/cart");
  };

  // Navigation menu items
  const navItems = [
    { path: "/", label: "Trang chủ" },
    { path: "/productsclient", label: "Sản phẩm" },
    { path: "/news", label: "Tin tức" },
    { path: "/branches", label: "Chi Nhánh" },
    { path: "/about-us", label: "Về chúng tôi" },
  ];

  return (
    <header className="bg-primary shadow-lg">
      <nav
        aria-label="Global"
        className="mx-auto flex max-w-7xl items-center justify-between h-20 px-4 lg:px-8"
      >
        <a href="/" className="flex items-center">
          <span className="sr-only">Gym Z</span>
          <img
            alt="Gym-Z logo with a dumbbell icon"
            src={MainLogo}
            className="h-16 w-auto transition-transform hover:scale-105"
          />
        </a>

        <PopoverGroup className="hidden lg:flex items-center space-x-1">
          {navItems.map((item) => (
            <a
              key={item.path}
              href={item.path}
              className={`text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200 ${activeItem === item.path
                ? "bg-secondary text-primary"
                : "text-white hover:bg-secondary/20"
                }`}
            >
              {item.label}
            </a>
          ))}
        </PopoverGroup>

        <div className="flex lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="inline-flex items-center justify-center rounded-md p-2.5 text-white hover:bg-secondary/20"
            aria-label="Open main menu"
          >
            <img
              src={HamburgerIcon}
              alt="Menu"
              className="w-6 h-6"
            />
          </button>
        </div>

        {!mobileMenuOpen && (
          <div className="hidden lg:flex items-center space-x-6">
            {isLoggedIn ? (
              <>
                <button
                  onClick={handleCartClick}
                  className="relative group p-2 rounded-full hover:bg-secondary/20 transition-all duration-200"
                  aria-label="Shopping cart"
                >
                  <img src={ShoppingCart} alt="Cart" className="h-6 w-6" />
                  {cartCount > 0 && (
                    <span className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {cartCount}
                    </span>
                  )}
                </button>

                <div className="relative">
                  <button
                    className="flex items-center space-x-2 p-2 rounded-full hover:bg-secondary/20 transition-all duration-200"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    <img
                      src={user?.avatar || defaultAvatar}
                      alt="User Avatar"
                      className="h-9 w-9 rounded-full object-cover border-2 border-secondary"
                    />
                    <Expand_Down className={`h-5 w-5 transform transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`} />
                  </button>

                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 border border-gray-100"
                      >
                        <a
                          href="/profile"
                          className="block px-4 py-2 text-gray-800 hover:bg-gray-100 text-sm"
                        >
                          Quản lý tài khoản
                        </a>
                        <button
                          onClick={handleLogoutClick}
                          className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-100 text-sm border-t border-gray-100"
                        >
                          Đăng xuất
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <button
                className="bg-secondary text-primary px-6 py-2 rounded-lg hover:bg-secondary/90 transition-all font-bold text-sm shadow-md hover:shadow-lg"
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
        <div className="fixed inset-0 z-10 bg-black/30" aria-hidden="true" />
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-full max-w-xs overflow-y-auto bg-primary px-6 py-6 sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="/" className="-m-1.5 p-1.5">
              <span className="sr-only">GymZ</span>
              <img src={MainLogo} alt="Gym-Z logo" className="h-12 w-auto" />
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="rounded-md p-2.5 text-white hover:bg-secondary/20"
            >
              <span className="sr-only">Close menu</span>
              <img
                src={XMarkIconSVG}
                alt="Close"
                className="w-6 h-6"
              />
            </button>
          </div>

          <div className="mt-6 flow-root">
            {isLoggedIn && (
              <>
                <div className="relative mb-8">
                  <div
                    className="flex items-center w-full justify-between rounded-lg px-3 py-2 text-base font-semibold text-white hover:bg-secondary/20"
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    <div className="flex items-center">
                      <img
                        src={user?.avatar || defaultAvatar}
                        alt="User Avatar"
                        className="h-10 w-10 rounded-full border-2 border-secondary object-cover"
                      />
                      <p className="ml-2">{user?.name || "User"}</p>
                    </div>

                    <Expand_Down
                      className={`h-6 w-6 transform transition-all duration-300 ${dropdownOpen ? "rotate-180" : "rotate-0"
                        }`}
                    />
                  </div>

                  <AnimatePresence>
                    {dropdownOpen && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden bg-secondary/10 rounded-lg mt-1"
                      >
                        <button
                          className="flex items-center w-full text-left px-4 py-3 text-sm font-medium text-white hover:bg-secondary/20"
                          onClick={handleCartClick}
                        >
                          <img src={ShoppingCart} alt="Cart" className="h-5 w-5 mr-2" />
                          Giỏ hàng
                          {cartCount > 0 && (
                            <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                              {cartCount}
                            </span>
                          )}
                        </button>
                        <a
                          href="/profile"
                          className="block w-full text-left px-4 py-3 text-sm font-medium text-white hover:bg-secondary/20 border-t border-white/10"
                        >
                          Quản lý tài khoản
                        </a>
                        <button
                          onClick={handleLogoutClick}
                          className="block w-full text-left px-4 py-3 text-sm font-medium text-white hover:bg-secondary/20 border-t border-white/10"
                        >
                          Đăng xuất
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            )}

            <div className="border-t border-white/20 pt-6">
              <div className="space-y-1">
                {navItems.map((item) => (
                  <a
                    key={item.path}
                    href={item.path}
                    className={`block rounded-lg px-3 py-2.5 text-base font-medium ${activeItem === item.path
                      ? "bg-secondary text-primary"
                      : "text-white hover:bg-secondary/20"
                      }`}
                  >
                    {item.label}
                  </a>
                ))}

                {!isLoggedIn && (
                  <button
                    className="w-full mt-4 text-left py-2.5 px-3 bg-secondary text-primary rounded-lg font-medium"
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