import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SideBar from "../../components/admin/layout/SideBar";
import Dashboard from "./dashboard";
import Order from "../admin/orders/order";
import UpdateOrderForm from "../admin/orders/ordersDetail";
import Payment from "../admin/payments/payment";
import Product from "./product";
import User from "./user";
import Employee from "./employee";
import Header from "../../components/admin/layout/Header";
import ProductDetail from "../admin/products/productDetail";

const AppAdmin = () => {
    return (
        <BrowserRouter>
            <div className="flex h-screen">
                <div className="w-1/5">
                    <SideBar />
                </div>
                <div className="w-4/5">
                    <Header />
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/orders" element={<Order />} />
                        <Route path="/orders/:id" element={<UpdateOrderForm />} />
                        <Route path="/payments" element={<Payment />} />
                        <Route path="/products" element={<Product />} />
                        <Route path="/users" element={<User />} />
                        <Route path="/employees" element={<Employee />} />
                        <Route path="/addproducts" element={<ProductDetail />} /> 
                        <Route path="/editproduct/:productId" element={<ProductDetail />} />

                        {/* Add more routes as needed */}
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    );
};

export default AppAdmin;