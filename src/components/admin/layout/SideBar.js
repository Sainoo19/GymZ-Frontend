import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ReactComponent as MyIcon } from "../../../assets/icons/main_icon.svg";
import { ReactComponent as IconAllProduct } from "../../../assets/icons/Icon_TatCaSanPham.svg";
import { Menu, X } from "lucide-react"; // Hamburger and close icons

const navItems = [
    { to: "/", label: "TỔNG QUAN", icon: IconAllProduct },
    { to: "/orders", label: "ĐƠN HÀNG", icon: IconAllProduct },
    { to: "/payments", label: "HOÁ ĐƠN", icon: IconAllProduct },
    { to: "/products", label: "SẢN PHẨM", icon: IconAllProduct },
    { to: "/employees", label: "NHÂN VIÊN", icon: IconAllProduct },
    { to: "/users", label: "KHÁCH HÀNG", icon: IconAllProduct },
    // Add more items here as needed
];

const SideBar = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    return (
        <div className="flex h-screen">
            {/* Desktop Sidebar */}
            <nav className="bg-primary w-full h-full lg:block hidden justify-items-center">
                <div className="pt-7">
                    <MyIcon className="block w-40 h-20 mx-auto" />
                </div>
                {navItems.map((item, index) => (
                    <Link
                        key={index}
                        to={item.to}
                        className="text-text_color_secondary rounded-lg flex p-4 w-4/5 mt-4 items-center group hover:bg-secondary hover:text-text_color_primary"
                    >
                        <item.icon className="mr-2 stroke-current group-hover:stroke-secondary" />
                        {item.label}
                    </Link>
                ))}
            </nav>

            {/* Mobile Sidebar */}
            <div className="lg:hidden">
                <button
                    className="p-4"
                    onClick={() => setMenuOpen(!menuOpen)}
                >
                    {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
                {menuOpen && (
                    <nav className="bg-primary w-1/5 h-full fixed top-0 left-0 z-50">
                        <div className="pt-7">
                            <MyIcon className="block w-40 h-20 mx-auto" />
                        </div>
                        {navItems.map((item, index) => (
                            <Link
                                key={index}
                                to={item.to}
                                className="text-text_color_secondary rounded-lg flex p-4 w-4/5 mt-4 items-center group hover:bg-secondary hover:text-text_color_primary"
                                onClick={() => setMenuOpen(false)}
                            >
                                <item.icon className="mr-2 stroke-current group-hover:stroke-secondary" />
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                )}
            </div>
        </div>
    );
};

export default SideBar;