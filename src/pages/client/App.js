import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./Home";
import HeaderClient from "../../components/clients/layouts/HeaderClient";
import ProductsClient from "./productsClient";
import ProductDetailClient from "./productDetailClient";
import Footer from "../../components/clients/layouts/FooterClient";

const App = () => {
    return (
        <BrowserRouter>
            <div className="flex flex-col min-h-screen">
                <HeaderClient />

                <main className="flex-grow">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/productsclient" element={<ProductsClient />} />
                        <Route path="/productsclient/:productId" element={<ProductDetailClient />} />
                        {/* Add more routes as needed */}
                    </Routes>
                </main>
               <Footer/>
            </div>
        </BrowserRouter>
    );
};

export default App;