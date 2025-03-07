import React from "react";
import { Link } from "react-router-dom";
import { ReactComponent as MyIcon } from "../../../assets/icons/main_icon.svg";
import { ReactComponent as IconAllProduct } from "../../../assets/icons/Icon_TatCaSanPham.svg";
import { Menu, X } from "lucide-react"; // Hamburger và nút đóng

const navItems = [
    { to: "/", label: "TỔNG QUAN", icon: IconAllProduct },
    { to: "/admin/orders", label: "ĐƠN HÀNG", icon: IconAllProduct },
    { to: "/admin/payments", label: "HOÁ ĐƠN", icon: IconAllProduct },
    { to: "/admin/products", label: "SẢN PHẨM", icon: IconAllProduct },
    { to: "/admin/employees", label: "NHÂN VIÊN", icon: IconAllProduct },
    { to: "/admin/users", label: "KHÁCH HÀNG", icon: IconAllProduct },
    { to: "/admin/branches", label: "CHI NHÁNH", icon: IconAllProduct },
    { to: "/admin/discounts", label: "KHUYẾN MÃI", icon: IconAllProduct }
];

const SideBar = ({ isSidebarHidden, setIsSidebarHidden }) => {
    return (
        <div className={`fixed lg:relative bg-primary h-full transition-all duration-300 ${isSidebarHidden ? "w-0 overflow-hidden" : "w-1/5"}`}>
            {/* Nút Toggle Sidebar */}
            <button 
                className="absolute top-4 right-[-45px] p-2 bg-gray-200 rounded-full shadow-lg lg:hidden"
                onClick={() => setIsSidebarHidden(!isSidebarHidden)}
            >
                {isSidebarHidden ? <Menu className="w-6 h-6" /> : <X className="w-6 h-6" />}
            </button>

            {/* Chỉ hiển thị menu khi sidebar mở */}
            {!isSidebarHidden && (
                <>
                    {/* Logo */}
                    <div className="pt-7">
                        <MyIcon className="block w-40 h-20 mx-auto" />
                    </div>

                    {/* Menu Items */}
                    <div className="mt-5">
                        {navItems.map((item, index) => (
                            <Link
                                key={index}
                                to={item.to}
                                className="text-text_color_secondary flex p-4 items-center group hover:bg-secondary hover:text-text_color_primary"
                            >
                                <item.icon className="mr-2 stroke-current group-hover:stroke-secondary" />
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default SideBar;
