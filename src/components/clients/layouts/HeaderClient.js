import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import MainLogo from "../../../assets/images/fauget-removebg-preview 2.png";
import { Dialog, DialogPanel, PopoverGroup } from "@headlessui/react";
import HamburgerIcon from "../../../assets/icons/bars-3.svg";
import XMarkIconSVG from "../../../assets/icons/x-mark.svg";
import ShoppingCart from "../../../assets/icons/shopping-cart.svg";

const HeaderClient = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
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
              href="/about"
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

        <div className="flex items-center space-x-4">
  {isLoggedIn && !mobileMenuOpen && (
    <button className="" onClick={handleCartClick}>
      <img src={ShoppingCart} alt="Cart" className="h-7 w-7" />
    </button>
  )}

  {!mobileMenuOpen && isLoggedIn && (
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
  )}

  {!mobileMenuOpen && !isLoggedIn && (
    <button
      className="bg-yellow-500 text-gray-800 px-6 py-2 rounded hover:bg-yellow-600 transition-all font-bold"
      onClick={handleLoginClick}
    >
      Đăng nhập
    </button>
  )}
</div>


      </nav>
      <Dialog
        open={mobileMenuOpen}
        onClose={setMobileMenuOpen}
        className="lg:hidden"
      >
        <div className="fixed inset-0 z-10" />
        <DialogPanel className="fixed inset-y-0 right-0 z-10 w-1/2 overflow-y-auto bg-primary px-6 py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10">
          <div className="flex items-center justify-between">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">GymZ</span>
              <img alt="" src="" className="h-8 w-auto" />
            </a>
            <button
              type="button"
              onClick={() => setMobileMenuOpen(false)}
              className="-m-4 rounded-md p-2.5 text-gray-700"
            >
              <span className="sr-only">Close menu</span>
              <img
                src={XMarkIconSVG}
                alt="Menu"
                className="w-6 h-6 text-white z-10"
              />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                <a
                  href="/"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-white hover:bg-secondary hover:text-primary"
                >
                  Trang chủ
                </a>
                <a
                  href="/productsclient"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-white hover:bg-secondary hover:text-primary"
                >
                  Sản phẩm
                </a>
                <a
                  href="/"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-white hover:bg-secondary hover:text-primary"
                >
                  Tin tức
                </a>
                <a
                  href="/branches"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-white hover:bg-secondary hover:text-primary"
                >
                  Chi Nhánh
                </a>{" "}
                <a
                  href="/about"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-white hover:bg-secondary hover:text-primary"
                >
                  Về chúng tôi
                </a>
              </div>
              <div className="py-6">
                <a
                  href="/"
                  className="-mx-3 block rounded-lg px-3 py-2.5 text-base/7 font-semibold text-white hover:bg-secondary hover:text-primary"
                >
                  Đăng nhập
                </a>
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>
    </header>
  );
};
export default HeaderClient;
