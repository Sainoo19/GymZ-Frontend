import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import SideBar from "../../components/admin/layout/SideBar";
import Dashboard from "./dashboard";
import Order from "../admin/orders/order";
import UpdateOrderForm from "../admin/orders/ordersDetail";
import CreateOrder from "../admin/orders/createOrder";
import Payment from "../admin/payments/payment";
import CreatePayment from "../admin/payments/createPayments";
import UpdatePaymentForm from "../admin/payments/paymentsDetail";
import Product from "./product";
import User from "./user";
import Employee from "./employee";
import Header from "../../components/admin/layout/Header";

const AppAdmin = () => {
    return (
        <BrowserRouter>
            <div className="flex h-screen">
                <div className="w-1/5">
                    <SideBar />
                </div>
                <div className="w-4/5 p-4">
                    <Header />
                    <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/orders" element={<Order />} />
                        <Route path="/orders/create" element={<CreateOrder />} />
                        <Route path="/orders/:id" element={<UpdateOrderForm />} />
                        <Route path="/payments" element={<Payment />} />
                        <Route path="/payments/create" element={<CreatePayment />} />
                        <Route path="/payments/:id" element={<UpdatePaymentForm />} />
                        <Route path="/products" element={<Product />} />
                        <Route path="/users" element={<User />} />
                        <Route path="/employees" element={<Employee />} />

                        {/* Add more routes as needed */}
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    );
};

export default AppAdmin;