import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SideBar from "../../components/admin/layout/SideBar";
import Dashboard from "../admin/Analysis/dashboard";
import Order from "../admin/orders/order";
import UpdateOrderForm from "../admin/orders/ordersDetail";
import CreateOrder from "../admin/orders/createOrder";
import Payment from "../admin/payments/payment";
import CreatePayment from "../admin/payments/createPayments";
import UpdatePaymentForm from "../admin/payments/paymentsDetail";
import Product from "../admin/products/product";
import ProductCategory from "../admin/ProductCategory/productCategory";
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
import CreateEmployee from "./employees/createEmployee";
import UpdateEmployeeForm from "./employees/employeesDetail";
// import ProductDetailTest from "../admin/products/productTest";
import CartPage from "../client/cartPage";
import OrderProgressPage from "../client/Payment/orderProgressPage";
import RevenueAnalysisPage from "../admin/Analysis/RevenueAnalysis";
import InventoryListPage from "../admin/Inventory/InventoryList";
import AddInventory from "../admin/Inventory/AddInventory";
import TopProductPage from "../../pages/admin/Analysis/TopProductPage"


const AppAdmin = () => {
    return (
        <BrowserRouter>
            <div className="flex h-screen">
                <div className="w-1/5  fixed h-full">
                    <SideBar />
                </div>

                <div className="w-4/5 p-4">
                    <Header />
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/branches" element={<Branches />} />
                        <Route path="/branches/create" element={<CreateBranch />} />
                        <Route path="/branches/:id" element={<UpdateBranchForm />} />
                        <Route path="/discounts" element={<Discounts />} />
                        <Route path="/discounts/create" element={<CreateDiscount />} />
                        <Route path="/discounts/:id" element={<UpdateDiscountForm />} />
                        <Route path="/orders" element={<Order />} />
                        <Route path="/orders/create" element={<CreateOrder />} />
                        <Route path="/orders/:id" element={<UpdateOrderForm />} />
                        <Route path="/admin/payments" element={<Payment />} />
                        <Route path="/admin/payments/create" element={<CreatePayment />} />
                        <Route path="/admin/payments/:id" element={<UpdatePaymentForm />} />
                        <Route path="/products" element={<Product />} />
                        <Route path="/users" element={<User />} />
                        <Route path="/users/:id" element={<UpdateUserForm />} />
                        <Route path="/users/create" element={<AddUserForm />} />
                        <Route path="/employees" element={<Employee />} />
                        <Route path="/addproducts" element={<ProductDetail />} />
                        <Route path="/editproduct/:productId" element={<ProductDetail />} />
                        {/* <Route path="/test/" element={<ProductDetailTest />} /> */}
                        <Route path="/employees/create" element={<CreateEmployee />} />
                        <Route path="/employees/:id" element={<UpdateEmployeeForm />} />
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/order-progress" element={< OrderProgressPage />} />
                        <Route path="/revenueAnalysis" element={< RevenueAnalysisPage />} />
                        <Route path="/inventory" element={< InventoryListPage />} />
                        <Route path="/inventory/addinventory/:productId" element={< AddInventory />} />
                        <Route path="/inventory/top-product-page" element={< TopProductPage />} />
                        <Route path="/productCategories" element={<ProductCategory />} />
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    );
};

export default AppAdmin;