import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./home";
import HeaderClient from "../../components/clients/layouts/HeaderClient";
import ProductsClient from "./productsClient";
import ProductDetailClient from "./productDetailClient";
import Branches from "./branches";


const App = () => {
    return (
        <BrowserRouter>
            <div className="flex flex-col min-h-screen">
                <HeaderClient />

                <main className="flex-grow">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/productsclient" element={<ProductsClient />} />
                        <Route path="/productsclient/test" element={<ProductDetailClient />} />
                        <Route path="/branches" element={<Branches />} />

                        {/* Add more routes as needed */}
                    </Routes>
                </main>
                { /* <Footer /> */}

            </div>
        </BrowserRouter>
    );
};

export default App;