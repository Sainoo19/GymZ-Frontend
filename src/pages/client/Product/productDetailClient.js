import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import axios from "axios";
import ProductImage from "../../../components/clients/product/ProductImage";
import ProductDescription from "../../../components/clients/product/ProductDescription";
import RelatedProducts from "../../../components/clients/product/RelatedProducts";

const ProductDetailClient = () => {
  const URL_API = process.env.REACT_APP_API_URL;
  const [product, setProduct] = useState(null);
  const { productId } = useParams();
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);

  useEffect(() => {
    // Fetch product details from an API or database
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${URL_API}products/${productId}`);
        if (response.data.status === "success") {
          setProduct(response.data.data);
          console.log("Product fetched successfully:", response.data.data);
        } else {
          console.error("Error fetching product:", response.data.message);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    const fetchMinMaxPrice = async () => {
      try {
        const response = await axios.get(
          `${URL_API}products/minmaxprice/${productId}`
        );
        const { minPrice, maxPrice } = response.data;
        setMinPrice(minPrice);
        setMaxPrice(maxPrice);
        return { minPrice, maxPrice };
      } catch (error) {
        console.error("Error fetching product prices:", error);
      }
    };

    fetchProduct();
    fetchMinMaxPrice();
  }, [productId, URL_API]);

  if (!product) {
    return <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      <span className="ml-2">Loading product details...</span>
    </div>;
  }

  return (
    <div className="container font-roboto mx-auto mt-10">
      <ProductImage
        avatar={product.avatar}
        images={product.images}
        name={product.name}
        minPrice={minPrice}
        maxPrice={maxPrice}
        variations={product.variations}
      />
      <ProductDescription description={product.description} ProductId={productId} />

      {/* Added Related Products component with category info */}
      <RelatedProducts productId={productId} category={product.category} />
    </div>
  );
};

export default ProductDetailClient;