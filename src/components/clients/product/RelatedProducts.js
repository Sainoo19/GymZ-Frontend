import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ProductCard from "./ProductCard";

const RelatedProducts = ({ productId, category }) => {
    const URL_API = process.env.REACT_APP_API_URL;
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRelatedProducts = async () => {
            try {
                setLoading(true);
                const response = await axios.get(
                    `${URL_API}productClient/related/${productId}`
                );
                if (response.data.status === "success") {
                    // Limit to maximum 5 products
                    const limitedProducts = response.data.data.slice(0, 5);
                    setRelatedProducts(limitedProducts);
                }
            } catch (error) {
                console.error("Error fetching related products:", error);
            } finally {
                setLoading(false);
            }
        };

        if (productId) {
            fetchRelatedProducts();
        }
    }, [productId, URL_API]);

    const handleViewAll = () => {
        // Set a global state variable that will be checked on the products page
        if (category) {
            // Store the category in sessionStorage to persist across page navigations
            sessionStorage.setItem('pendingCategoryFilter', category);
            console.log("Category saved to sessionStorage:", category);
        }

        // Navigate to products page
        navigate('/productsclient');
    };

    if (loading) {
        return <div className="text-center py-8">Loading related products...</div>;
    }

    if (relatedProducts.length === 0) {
        return null;
    }

    return (
        <div className="mt-12 mb-16">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Related Products</h2>
                <button
                    onClick={handleViewAll}
                    className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
                >
                    View All
                    <svg
                        className="w-4 h-4 ml-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 5l7 7-7 7"
                        />
                    </svg>
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {relatedProducts.map((product) => (
                    <ProductCard
                        key={product._id}
                        product={product}
                        minSalePrice={product.minPrice}
                    />
                ))}
            </div>
        </div>
    );
};

export default RelatedProducts;