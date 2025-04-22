import React from "react";
import { Link } from "react-router-dom";
import { ReactComponent as MyIcon } from "../../../assets/icons/main_icon.svg";
import { ReactComponent as IconAllProduct } from "../../../assets/icons/Icon_TatCaSanPham.svg";
import { ReactComponent as Dashboard_Icon } from "../../../assets/icons/Dashboard_Icon.svg";
import { ReactComponent as OrderIcon } from "../../../assets/icons/Order_Icon.svg";
import { ReactComponent as Arhive_Icon } from "../../../assets/icons/Arhive_Icon.svg";
import { ReactComponent as Bag_Icon } from "../../../assets/icons/Bag_Icon.svg";
import { ReactComponent as Materials_Icon } from "../../../assets/icons/Materials_Icon.svg";
import { ReactComponent as User_Icon } from "../../../assets/icons/User_Icon.svg";
import { ReactComponent as Customer_Icon } from "../../../assets/icons/Customer_Icon.svg";
import { ReactComponent as Branch_Icon } from "../../../assets/icons/Branch_Icon.svg";
import { ReactComponent as Discount_Icon } from "../../../assets/icons/Discount_Icon.svg";
import { ReactComponent as MemberShip_Icon } from "../../../assets/icons/MemberShip_Icon.svg";
import { ReactComponent as MemberShipInvoice_Icon } from "../../../assets/icons/MemberShipInvoice_Icon.svg";
import { ReactComponent as Calendar_Icon } from "../../../assets/icons/Calendar_Icon.svg";
import { ReactComponent as Key_Icon } from "../../../assets/icons/Key_Icon.svg";
import { Menu, X } from "lucide-react";

const navItems = [
    { to: "/admin/", label: "TỔNG QUAN", icon: Dashboard_Icon },
    // { to: "/admin/inventory", label: "NHẬP KHO", icon: IconAllProduct },
    { to: "/admin/orders", label: "ĐƠN HÀNG", icon: Arhive_Icon },
    { to: "/admin/payments", label: "HOÁ ĐƠN", icon: OrderIcon },
    { to: "/admin/productCategories", label: "DANH MỤC SẢN PHẨM", icon: Materials_Icon },
    { to: "/admin/products", label: "SẢN PHẨM", icon: Bag_Icon },
    { to: "/admin/employees", label: "NHÂN VIÊN", icon: User_Icon },
    { to: "/admin/users", label: "KHÁCH HÀNG", icon: Customer_Icon },
    { to: "/admin/branches", label: "CHI NHÁNH", icon: Branch_Icon },
    { to: "/admin/discounts", label: "KHUYẾN MÃI", icon: Discount_Icon },
    { to: "/admin/members", label: "HỘI VIÊN", icon: MemberShip_Icon },
    { to: "/admin/member-bills", label: "HOÁ ĐƠN HỘI VIÊN", icon: MemberShipInvoice_Icon },
    { to: "/admin/train-sessions", label: "LỊCH TẬP", icon: Calendar_Icon },
    { to: "/admin/change-password-admin", label: "ĐỔI MẬT KHẨU", icon: Key_Icon }
];

const SideBar = ({ isSidebarHidden, setIsSidebarHidden }) => {
    return (
        <div className={`fixed  lg:relative z-40 bg-primary h-full transition-all duration-300 ${isSidebarHidden ? "w-0 overflow-hidden" : "w-64"}`}>
            {/* Nút đóng Sidebar */}
            <button
                className="absolute top-4 right-[-45px] p-2 bg-gray-200 rounded-full shadow-lg lg:hidden"
                onClick={() => setIsSidebarHidden(true)}
            >
                <X className="w-6 h-6" />
            </button>

            {!isSidebarHidden && (
                <>
                    <div className="pt-7">
                        <MyIcon className="block w-40 h-20 mt-12 mx-auto" />
                    </div>
                    <div className="mt-5">
                        {navItems.map((item, index) => (
                            <Link
                                key={index}
                                to={item.to}
                                onClick={() => setIsSidebarHidden(true)}
                                className="text-text_color_secondary flex p-4 items-center group hover:bg-secondary hover:text-text_color_primary"
                            >
                                <item.icon className="mr-2 stroke-current " />
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
