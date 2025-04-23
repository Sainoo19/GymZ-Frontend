import React from "react";
import { Link, useLocation } from "react-router-dom";
import { ReactComponent as MyIcon } from "../../../assets/icons/main_icon.svg";
import { ReactComponent as IconAllProduct } from "../../../assets/icons/Icon_TatCaSanPham.svg";
import { FaChartLine, FaShoppingCart, FaReceipt, FaListAlt, FaBox, FaUsers, FaUserFriends, FaBuilding, FaPercentage, FaIdCard, FaFileInvoice, FaCalendarAlt } from "react-icons/fa";
import { X } from "lucide-react";

// Define all navigation items with their roles permissions
const allNavItems = [
    {
        to: "/admin/",
        label: "TỔNG QUAN",
        icon: FaChartLine,
        roles: ["admin"]
    },
    {
        to: "/admin/orders",
        label: "ĐƠN HÀNG",
        icon: FaShoppingCart,
        roles: ["admin"]
    },
    {
        to: "/admin/payments",
        label: "HOÁ ĐƠN",
        icon: FaReceipt,
        roles: ["admin"]
    },
    {
        to: "/admin/productCategories",
        label: "DANH MỤC SẢN PHẨM",
        icon: FaListAlt,
        roles: ["admin"]
    },
    {
        to: "/admin/products",
        label: "SẢN PHẨM",
        icon: FaBox,
        roles: ["admin", "manager", "staff"]
    },
    {
        to: "/admin/employees",
        label: "NHÂN VIÊN",
        icon: FaUsers,
        roles: ["admin", "manager"]
    },
    {
        to: "/admin/users",
        label: "KHÁCH HÀNG",
        icon: FaUserFriends,
        roles: ["admin", "manager"]
    },
    {
        to: "/admin/branches",
        label: "CHI NHÁNH",
        icon: FaBuilding,
        roles: ["admin"]
    },
    {
        to: "/admin/discounts",
        label: "KHUYẾN MÃI",
        icon: FaPercentage,
        roles: ["admin"]
    },
    {
        to: "/admin/members",
        label: "HỘI VIÊN",
        icon: FaIdCard,
        roles: ["admin", "manager", "PT"]
    },
    {
        to: "/admin/member-bills",
        label: "HOÁ ĐƠN HỘI VIÊN",
        icon: FaFileInvoice,
        roles: ["admin", "manager", "staff"]
    },
    {
        to: "/admin/train-sessions",
        label: "LỊCH TẬP",
        icon: FaCalendarAlt,
        roles: ["admin", "PT"]
    }
];

const SideBar = ({ isSidebarHidden, setIsSidebarHidden, userRole }) => {
    const location = useLocation();

    // Filter nav items based on user role
    const filteredNavItems = allNavItems.filter(item => item.roles.includes(userRole));

    return (
        <div className={`fixed lg:relative z-40 bg-primary h-full transition-all duration-300 ${isSidebarHidden ? "w-0 overflow-hidden" : "w-64"}`}>
            {/* Close Sidebar button */}
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

                    {/* Display user role */}
                    <div className="px-4 py-2 mt-4">
                        <span className="text-xs text-gray-400">Đăng nhập với vai trò:</span>
                        <div className="bg-secondary/20 text-secondary px-3 py-1 rounded-md font-semibold text-sm uppercase mt-1">
                            {userRole === "admin" && "Quản Trị Viên"}
                            {userRole === "manager" && "Quản Lý"}
                            {userRole === "staff" && "Nhân Viên"}
                            {userRole === "PT" && "Huấn Luyện Viên"}
                        </div>
                    </div>

                    <div className="mt-5 overflow-y-auto max-h-[calc(100vh-200px)]">
                        {filteredNavItems.map((item, index) => {
                            const isActive = location.pathname === item.to;

                            return (
                                <Link
                                    key={index}
                                    to={item.to}
                                    onClick={() => window.innerWidth < 1024 && setIsSidebarHidden(true)}
                                    className={`text-text_color_secondary flex p-4 items-center group hover:bg-secondary hover:text-text_color_primary transition-colors ${isActive ? 'bg-secondary/20 border-l-4 border-secondary' : ''
                                        }`}
                                >
                                    <item.icon className={`mr-3 text-xl ${isActive ? 'text-secondary' : 'text-text_color_secondary'}`} />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* User role info at bottom
                    <div className="absolute bottom-4 left-0 right-0 p-4">
                        <div className="border-t border-gray-700 pt-4">
                            <div className="text-gray-400 text-xs">
                                © 2025 GymZ Admin Panel
                            </div>
                        </div>
                    </div> */}
                </>
            )}
        </div>
    );
};

export default SideBar;