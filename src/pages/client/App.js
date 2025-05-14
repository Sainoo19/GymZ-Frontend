import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import HeaderClient from "../../components/clients/layouts/HeaderClient";
import ProductsClient from "../client/Product/productsClient";
import ProductDetailClient from "../client/Product/productDetailClient";
import BranchesClient from "./branches";
import LoginPageUser from "./login";
import SignUpPageUser from "./signUp";
import LoginAdminPage from "../admin/loginAdmin";
import SideBar from "../../components/admin/layout/SideBar";
import Dashboard from "../admin/Analysis/dashboard";
import Order from "../admin/orders/order";
import UpdateOrderForm from "../admin/orders/ordersDetail";
import CreateOrder from "../admin/orders/createOrder";
import Payment from "../admin/payments/payment";
import CreatePayment from "../admin/payments/createPayments";
import UpdatePaymentForm from "../admin/payments/paymentsDetail";
import Product from "../admin/products/product";
import Branches from "../admin/branches/branches";
import CreateBranch from "../admin/branches/branchesCreate";
import UpdateBranchForm from "../admin/branches/branchesDetail";
import Discounts from "../admin/discount/discounts";
import CreateDiscount from "../admin/discount/createDiscounts";
import UpdateDiscountForm from "../admin/discount/discountsDetails";
import User from "../admin/users/user";
import UpdateUserForm from "../admin/users/userDetail";
import AddUserForm from "../admin/users/addUser";
import Employee from "../admin/employees/employee";
import Header from "../../components/admin/layout/Header";
import ProductDetail from "../admin/products/productDetail";
import CreateEmployee from "../admin/employees/createEmployee";
import UpdateEmployeeForm from "../admin/employees/employeesDetail";
import FooterClient from "../../components/clients/layouts/FooterClient";
import CartPage from "./cartPage";
import AboutUs from "./aboutUs";
import CheckOutPage from "../client/checkOutPage";
import OrderProgressPage from "./Payment/orderProgressPage";
import RevenueAnalysis from "../admin/Analysis/RevenueAnalysis";
import InventoryListPage from "../admin/Inventory/InventoryList";
import AddInventory from "../admin/Inventory/AddInventory";
import TopProductPage from "../../pages/admin/Analysis/TopProductPage";
import ProfilePage from "./profile/profile";
import ChangePasswordPage from "./profile/privacy";
import ChangePasswordAdminPage from "../admin/privacy/ChangePasswordAdminPage";
import ForgotPasswordPage from "../../components/clients/users/ForgotPasswordPage";
import Members from "../admin/members/members";
import CreateMember from "../admin/members/memberCreate";
import UpdateMemberForm from "../admin/members/memberDetail";
import TrainSessions from "../admin/trainSession/trainSessions";
import TrainSessionCreate from "../admin/trainSession/trainSessionCreate";
import TrainSessionDetail from "../admin/trainSession/trainSessionDetail";
import MemberBills from "../admin/memberBill/memberBills";
import MembershipPage from "./profile/membership";
import TrainSchedulePage from "./profile/trainSchedule";
import ProductCategory from "../admin/ProductCategory/productCategory";
import CreateProductCategory from "../admin/ProductCategory/addProductCategory";
import UpdateProductCategory from "../admin/ProductCategory/productCategoryDetail";
import ProductFeedbackReview from "../admin/products/productFeedback";
import OrdersHistoryPage from "./profile/ordershistory";
import { getFCMToken } from "../../firebase";
import { CartProvider } from "../../components/clients/contexts/CartContext";
import ProfileEmployeeContent from "../../components/admin/employee/ProfileEmployeeContent";
import NewsPage from "../../pages/client/News/newsPage";

import axios from "axios";

const App = () => {
  const [userRole, setUserRole] = useState(null);
  const [isSidebarHidden, setIsSidebarHidden] = useState(true);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  const URL_API = process.env.REACT_APP_API_URL;

  // Khởi tạo Firebase Cloud Messaging và Service Worker
  useEffect(() => {
    getFCMToken();

    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then((registration) => {
          console.log("Service Worker đăng ký thành công:", registration.scope);
        })
        .catch((error) => {
          console.error("⚠️ Service Worker đăng ký thất bại:", error);
        });
    }
  }, []);

  // Lấy thông tin vai trò người dùng
  useEffect(() => {
    setIsAuthLoading(true);
    axios
      .get(`${URL_API}employees/profile`, {
        withCredentials: true,
      })
      .then((response) => {
        const role = response.data.data.role;
        setUserRole(role);
      })
      .catch((error) => {
        console.error("Error fetching user role:", error);
        setUserRole(null);
      })
      .finally(() => {
        setIsAuthLoading(false);
      });
  }, [URL_API]);

  // Quản lý OpenWidget chat dựa theo vai trò người dùng
  useEffect(() => {
    // Không thực hiện gì nếu đang tải thông tin xác thực
    if (isAuthLoading) return;

    console.log("userRole updated:", userRole);

    // Hàm xóa hoàn toàn widget chat đang tồn tại
    const removeExistingWidgets = () => {
      // 1. Xóa tất cả widget frames đang tồn tại
      document.querySelectorAll('.ow-widget-frame').forEach(frame => {
        frame.remove();
      });

      // 2. Xóa tất cả scripts OpenWidget
      document.querySelectorAll('script[src*="openwidget.js"]').forEach(script => {
        script.remove();
      });

      // 3. Xóa object config
      if (window.__ow) {
        delete window.__ow;
      }

      // 4. Xóa cả đối tượng OpenWidget
      if (window.OpenWidget) {
        delete window.OpenWidget;
      }
    };

    // Luôn xóa widget hiện có trước khi quyết định có khởi tạo lại hay không
    removeExistingWidgets();

    const isAdmin =
      userRole === "admin" ||
      userRole === "staff" ||
      userRole === "manager" ||
      userRole === "PT";

    // Chỉ khởi tạo widget chat cho khách hàng, không phải admin
    if (!isAdmin) {
      console.log("Khởi tạo OpenWidget cho client");

      // Tạo cấu hình mới cho widget chat
      window.__ow = {
        organizationId: "3ca26d52-2187-4652-ad76-22e4e2063550",
        integration_name: "manual_settings",
        product_name: "openwidget"
      };

      // Tạo và thêm script mới
      const newScript = document.createElement("script");
      newScript.src = "https://cdn.openwidget.com/openwidget.js";
      newScript.async = true;
      document.head.appendChild(newScript);
    }

    // Cleanup khi component unmount
    return () => {
      removeExistingWidgets();
    };
  }, [userRole, isAuthLoading]);

  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        {userRole === "admin" ||
          userRole === "staff" ||
          userRole === "manager" ||
          userRole === "PT" ? (
          <>
            <div className="flex min-h-screen">

              <SideBar
                isSidebarHidden={isSidebarHidden}
                setIsSidebarHidden={setIsSidebarHidden}
                userRole={userRole}
              />

              <div className="flex-1 p-4">
                {" "}
                {/* Không thay đổi width khi sidebar mở */}
                <Header
                  isSidebarHidden={isSidebarHidden}
                  setIsSidebarHidden={setIsSidebarHidden}
                />
                <div className="mt-20"></div>
                <Routes>
                  <Route path="/admin/" element={<Dashboard />} />
                  <Route path="admin/branches" element={<Branches />} />
                  <Route
                    path="admin/branches/create"
                    element={<CreateBranch />}
                  />
                  <Route
                    path="admin/branches/:id"
                    element={<UpdateBranchForm />}
                  />
                  <Route path="admin/discounts" element={<Discounts />} />
                  <Route
                    path="admin/discounts/create"
                    element={<CreateDiscount />}
                  />
                  <Route
                    path="admin/discounts/:id"
                    element={<UpdateDiscountForm />}
                  />
                  <Route path="admin/orders" element={<Order />} />
                  <Route path="admin/orders/create" element={<CreateOrder />} />
                  <Route
                    path="admin/orders/:id"
                    element={<UpdateOrderForm />}
                  />
                  <Route path="admin/payments" element={<Payment />} />
                  <Route
                    path="admin/payments/create"
                    element={<CreatePayment />}
                  />
                  <Route
                    path="admin/payments/:id"
                    element={<UpdatePaymentForm />}
                  />
                  <Route path="admin/products" element={<Product />} />
                  <Route path="admin/users" element={<User />} />
                  <Route path="admin/users/:id" element={<UpdateUserForm />} />
                  <Route path="admin/users/create" element={<AddUserForm />} />
                  <Route path="admin/employees" element={<Employee />} />
                  <Route path="admin/members" element={<Members />} />
                  <Route path="admin/member-bills" element={<MemberBills />} />
                  <Route
                    path="admin/train-sessions"
                    element={<TrainSessions />}
                  />
                  <Route path="admin/addproducts" element={<ProductDetail />} />
                  <Route
                    path="admin/inventory"
                    element={<InventoryListPage />}
                  />
                  <Route
                    path="admin/inventory/addinventory/:productId"
                    element={<AddInventory />}
                  />
                  <Route
                    path="admin/inventory/top-product-page"
                    element={<TopProductPage />}
                  />
                  <Route
                    path="admin/revenueAnalysis"
                    element={<RevenueAnalysis />}
                  />
                  <Route
                    path="admin/editproduct/:productId"
                    element={<ProductDetail />}
                  />
                  <Route
                    path="admin/feedbackReview/:productId"
                    element={<ProductFeedbackReview />}
                  />
                  <Route
                    path="admin/employees/create"
                    element={<CreateEmployee />}
                  />
                  <Route
                    path="admin/employees/:id"
                    element={<UpdateEmployeeForm />}
                  />
                  <Route
                    path="admin/members/create"
                    element={<CreateMember />}
                  />
                  <Route
                    path="admin/members/:id"
                    element={<UpdateMemberForm />}
                  />

                  <Route
                    path="admin/trainingSessions/create"
                    element={<TrainSessionCreate />}
                  />
                  <Route
                    path="admin/trainingSessions/:id"
                    element={<TrainSessionDetail />}
                  />
                  <Route path="/login-employee" element={<LoginAdminPage />} />

                  <Route
                    path="/admin/productCategories"
                    element={<ProductCategory />}
                  />
                  <Route
                    path="/productCategories/create"
                    element={<CreateProductCategory />}
                  />
                  <Route
                    path="/productCategory/:id"
                    element={<UpdateProductCategory />}
                  />
                  <Route path="/admin/profile" element={<ProfileEmployeeContent />} />
                  <Route
                    path="admin/change-password-admin"
                    element={<ChangePasswordAdminPage />}
                  />
                </Routes>
              </div>
            </div>
          </>
        ) : (
          <>
            <CartProvider>
              <HeaderClient />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login-user" element={<LoginPageUser />} />
                  <Route path="/login-employee" element={<LoginAdminPage />} />
                  <Route path="/sign-up" element={<SignUpPageUser />} />
                  <Route path="/productsclient" element={<ProductsClient />} />
                  <Route path="/about-us" element={<AboutUs />} />
                  <Route path="/branches" element={<BranchesClient />} />
                  <Route path="/news" element={<NewsPage />} />
                  <Route
                    path="/productsclient/:productId"
                    element={<ProductDetailClient />}
                  />
                  <Route path="/cart" element={<CartPage />} />
                  <Route path="/checkout" element={<CheckOutPage />} />
                  <Route
                    path="/order-progress"
                    element={<OrderProgressPage />}
                  />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/my-membership" element={<MembershipPage />} />
                  <Route path="/my-orders" element={<OrdersHistoryPage />} />
                  <Route
                    path="/membership/schedule"
                    element={<TrainSchedulePage />}
                  />
                  <Route
                    path="/change-password"
                    element={<ChangePasswordPage />}
                  />
                  <Route
                    path="/forgot-password"
                    element={<ForgotPasswordPage />}
                  />
                </Routes>
              </main>
              <FooterClient />
            </CartProvider>
          </>
        )}
      </div>
    </BrowserRouter>
  );
};

export default App;