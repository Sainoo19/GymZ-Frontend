import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ProductDetailClient = () => {
    const [product, setProduct] = useState(null);
    const productId = 'PR001';

    useEffect(() => {
        // Fetch product details from an API or database
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:3000/products/${productId}`);
                if (response.data.status === 'success') {
                    setProduct(response.data.data);
                } else {
                    console.error('Error fetching product:', response.data.message);
                }
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };

        fetchProduct();
    }, [productId]);

    if (!product) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{product.name}</h1>
            <div dangerouslySetInnerHTML={{ __html: product.description }} />
            <p>Price: ${product.variations[0].salePrice}</p>
        </div>
    );
};

export default ProductDetailClient;