import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductImage from "../../components/clients/product/ProductImage";
import ProductDescription from "../../components/clients/product/ProductDescription";

const ProductDetailClient = () => {
  const URL_API = process.env.REACT_APP_API_URL;
  const [product, setProduct] = useState(null);
  const productId = "PR010";
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);

  useEffect(() => {
    // Fetch product details from an API or database
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${URL_API}products/${productId}`);
        if (response.data.status === "success") {
          setProduct(response.data.data);
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
        console.error("Error fetching product:", error);
      }
    };

    fetchProduct();
    fetchMinMaxPrice();
  }, [productId]);

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container  mx-auto  mt-10">
      {
        <ProductImage
          avatar={product.avatar}
          images={product.images}
          name={product.name}
          minPrice={minPrice}
          maxPrice={maxPrice}
          variations={product.variations}
        />
      }
      {<ProductDescription description={product.description } ProductId= {productId} />}
    </div>
  );
};

export default ProductDetailClient;
