import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import HeaderClient from "../../components/clients/layouts/HeaderClient";
import ProductsClient from "./productsClient";
import ProductDetailClient from "./productDetailClient";
import BranchesClient from "./branches";
import LoginPageUser from "./login";
import SignUpPageUser from "./signUp";
import LoginAdminPage from "../admin/loginAdmin";
import SideBar from "../../components/admin/layout/SideBar";
import Dashboard from "../admin/dashboard";
import Order from "../admin/orders/order";
import UpdateOrderForm from "../admin/orders/ordersDetail";
import CreateOrder from "../admin/orders/createOrder";
import Payment from "../admin/payments/payment";
import CreatePayment from "../admin/payments/createPayments";
import UpdatePaymentForm from "../admin/payments/paymentsDetail";
import Product from "../admin/product";
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
import ProductDetailTest from "../admin/products/productTest";
import FooterClient from "../../components/clients/layouts/FooterClient";
import AboutUs from "./aboutUs";
import axios from 'axios';

const App = () => {
    const [userRole, setUserRole] = React.useState(null);

    React.useEffect(() => {
        axios.get('http://localhost:3000/employees/profile', {
            withCredentials: true // Ensure cookies are sent with the request
        })
            .then(response => {
                const role = response.data.data.role;
                setUserRole(role);
                console.log(role);
            })
            .catch(error => {
                console.error('Error fetching user role:', error);
                setUserRole(null);
            });
    }, []);

    return (
        <BrowserRouter>
            <div className="flex flex-col min-h-screen">
                {userRole === 'admin' || userRole === 'staff' || userRole === 'manager' || userRole === 'Quản lí' ? (
                    <>
                        <div className="flex h-screen">
                            <div className="w-1/5 fixed h-full">
                                <SideBar />
                            </div>
                            <div className="w-1/5"></div>
                            <div className="w-4/5 p-4">
                                <Header />
                                <Routes>
                                    <Route path="/admin/" element={<Dashboard />} />
                                    <Route path="admin/branches" element={<Branches />} />
                                    <Route path="admin/branches/create" element={<CreateBranch />} />
                                    <Route path="admin/branches/:id" element={<UpdateBranchForm />} />
                                    <Route path="admin/discounts" element={<Discounts />} />
                                    <Route path="admin/discounts/create" element={<CreateDiscount />} />
                                    <Route path="admin/discounts/:id" element={<UpdateDiscountForm />} />
                                    <Route path="admin/orders" element={<Order />} />
                                    <Route path="admin/orders/create" element={<CreateOrder />} />
                                    <Route path="admin/orders/:id" element={<UpdateOrderForm />} />
                                    <Route path="admin/payments" element={<Payment />} />
                                    <Route path="admin/payments/create" element={<CreatePayment />} />
                                    <Route path="admin/payments/:id" element={<UpdatePaymentForm />} />
                                    <Route path="admin/products" element={<Product />} />
                                    <Route path="admin/users" element={<User />} />
                                    <Route path="admin/users/:id" element={<UpdateUserForm />} />
                                    <Route path="admin/users/create" element={<AddUserForm />} />
                                    <Route path="admin/employees" element={<Employee />} />
                                    <Route path="admin/addproducts" element={<ProductDetail />} />
                                    <Route path="admin/editproduct/:productId" element={<ProductDetail />} />
                                    <Route path="/test" element={<ProductDetailTest />} />
                                    <Route path="admin/employees/create" element={<CreateEmployee />} />
                                    <Route path="admin/employees/:id" element={<UpdateEmployeeForm />} />
                                    <Route path="/login-employee" element={<LoginAdminPage />} /> {/* Add this route */}
                                    {/* Add more routes as needed */}
                                </Routes>
                            </div>
                        </div>
                    </>
                ) : (
                    <>
                        <HeaderClient />
                        <main className="flex-grow">
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/login-user" element={<LoginPageUser />} />
                                <Route path="/login-employee" element={<LoginAdminPage />} />
                                <Route path="/sign-up" element={<SignUpPageUser />} />
                                <Route path="/productsclient" element={<ProductsClient />} />
                                <Route path="/productsclient/test" element={<ProductDetailClient />} />
                                <Route path="/about-us" element={<AboutUs />} />
                                <Route path="/branches" element={<BranchesClient />} />
                                {/* Add more routes as needed */}
                            </Routes>
                        </main>
                        <FooterClient />
                    </>
                )}
            </div>
        </BrowserRouter>
    );
};

export default App;