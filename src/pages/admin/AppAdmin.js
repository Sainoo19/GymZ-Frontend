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
import Employee from "./employees/employee";
import User from "../admin/users/user";
import UpdateUserForm from "../admin/users/userDetail";
import AddUserForm from "../admin/users/addUser";
import Header from "../../components/admin/layout/Header";
import ProductDetail from "../admin/products/productDetail";
import CreateEmployee from "./employees/createEmployee";
import UpdateEmployeeForm from "./employees/employeesDetail";

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
                        <Route path="/orders/create" element={<CreateOrder />} />
                        <Route path="/orders/:id" element={<UpdateOrderForm />} />
                        <Route path="/payments" element={<Payment />} />
                        <Route path="/payments/create" element={<CreatePayment />} />
                        <Route path="/payments/:id" element={<UpdatePaymentForm />} />
                        <Route path="/products" element={<Product />} />
                        <Route path="/users" element={<User />} />
                        <Route path="/users/:id" element={<UpdateUserForm />} />
                        <Route path="/users/create" element={<AddUserForm />} />
                        <Route path="/employees" element={<Employee />} />
                        <Route path="/addproducts" element={<ProductDetail />} /> 
                        <Route path="/editproduct/:productId" element={<ProductDetail />} />

                        <Route path="/employees/create" element={<CreateEmployee />} />
                        <Route path="/employees/:id" element={<UpdateEmployeeForm />} />
                        {/* Add more routes as needed */}
                    </Routes>
                </div>
            </div>
        </BrowserRouter>
    );
};

export default AppAdmin;