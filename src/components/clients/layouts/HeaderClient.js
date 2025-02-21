"use client";

import { useState } from "react";
import MainLogo from "../../../assets/images/fauget-removebg-preview 2.png";
import { Dialog, DialogPanel, PopoverGroup } from "@headlessui/react";
import HamburgerIcon from "../../../assets/icons/bars-3.svg";
import XMarkIconSVG from "../../../assets/icons/x-mark.svg";

const HeaderClient = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-primary ">
      <nav
        aria-label="Global"
        className="mx-auto flex max-w-7xl items-center justify-between h-24 lg:px-8 "
      >
        <div className="flex lg:flex-1">
          <a href="/" className="m-1.5 p-1.5">
            <span className="sr-only">Gym Z</span>
            <img
              alt="Gym-Z logo with a dumbbell icon"
              src={MainLogo}
              className="h-12 w-auto"
            />
          </a>
        </div>
      

        <div className="flex-col mt-1">
          <input
            className="w-full py-1 px-4 rounded-full text-gray-800"
            placeholder="Start typing to search"
            type="text"
          />

          <PopoverGroup className="hidden mt-1 lg:flex space-x-4">
            <a href="/" className="text-sm/6 font-semibold text-white px-3 py-2 rounded-lg hover:bg-secondary hover:text-primary">
              Trang chủ
            </a>
            <a
              href="/productsclient"
              className="text-sm/6 font-semibold text-white  px-3 py-2 rounded-lg hover:bg-secondary hover:text-primary"
            >
              Sản phẩm
            </a>
            <a href="/" className="text-sm/6 font-semibold text-white  px-3 py-2 rounded-lg hover:bg-secondary hover:text-primary">
              Tin tức
            </a>
            <a href="/" className="text-sm/6 font-semibold text-white  px-3 py-2 rounded-lg hover:bg-secondary hover:text-primary">
              Chi Nhánh
            </a>
            <a href="/" className="text-sm/6 font-semibold text-white  px-3 py-2 rounded-lg hover:bg-secondary hover:text-primary">
              Về chúng tôi
            </a>
          </PopoverGroup>
        </div>
        <div className="flex lg:hidden">
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
        <div className="hidden lg:flex lg:flex-1 lg:justify-end">
          <a href="#" className="text-sm/6 font-semibold text-white">
            Đăng nhập <span aria-hidden="true">&rarr;</span>
          </a>
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
                  href="/"
                  className="-mx-3 block rounded-lg px-3 py-2 text-base/7 font-semibold text-white hover:bg-secondary hover:text-primary"
                >
                  Chi Nhánh
                </a>{" "}
                <a
                  href="/"
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
