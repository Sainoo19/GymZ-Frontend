import React from 'react';
import Table from '../../components/admin/Table';

const ProductCard = () => {
  const [products, setProducts] = useState([]);
  const [minMaxPrices, setMinMaxPrices] = useState({});
  const [stocks, setStocks] = useState({}); // Thêm state lưu trữ stock
  const [isMenuVisible, setMenuVisible] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3000/products/all/nopagination", {
          headers: { "Cache-Control": "no-cache" },
        });
        setProducts(response.data.data);
      } catch (error) {
        console.error("Lỗi khi lấy sản phẩm:", error);
      }
    };

    const fetchMinMaxPrices = async () => {
      try {
        const response = await axios.get("http://localhost:3000/products/minmaxprice", {
          headers: { "Cache-Control": "no-cache" },
        });
        const priceMap = response.data.data.reduce((acc, item) => {
          acc[item.productId] = { min: item.minSalePrice, max: item.maxSalePrice };
          return acc;
        }, {});
        setMinMaxPrices(priceMap);
      } catch (error) {
        console.error("Lỗi khi lấy giá min-max:", error);
      }
    };

    fetchProducts();
    fetchMinMaxPrices();
  }, []);

  useEffect(() => {
    // Chỉ fetch stock khi đã có sản phẩm
    if (products.length === 0) return;

    const fetchStocks = async () => {
      try {
        const stockData = {};
        for (const product of products) {
          const response = await axios.get(`http://localhost:3000/products/stock/${product._id}`);
          stockData[product._id] = response.data.totalStock;
        }
        setStocks(stockData);
      } catch (error) {
        console.error("Lỗi khi lấy stock sản phẩm:", error);
      }
    };

    fetchStocks();
  }, [products]);

  const handleMenuClick = (productId) => {
    setMenuVisible(isMenuVisible === productId ? null : productId);
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!event.target.closest(".menu-container")) {
        setMenuVisible(null);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
    };
  }, []);

  const handleDeleteProduct = async (productId) => {
    if (window.confirm("Bạn có chắc chắn muốn xoá sản phẩm này?")) {
      try {
        await axios.delete(`http://localhost:3000/products/delete/${productId}`);
        setProducts((prevProducts) => prevProducts.filter((product) => product._id !== productId));
      } catch (error) {
        console.error("Lỗi khi xoá sản phẩm:", error);
      }
    }
  };

  return (
    <div className="mt-5 flex flex-col items-center">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full px-4">
        {products.length > 0 ? (
          products.map((product) => {
            const priceData = minMaxPrices[product._id];
            const stock = stocks[product._id] ?? "Đang tải...";

            // Nếu có API minmaxprice, ưu tiên hiển thị từ API
            let priceText = priceData
              ? `${priceData.min.toLocaleString()}đ - ${priceData.max.toLocaleString()}đ`
              : "N/A";

            // Nếu API minmaxprice chưa có dữ liệu, fallback về variations
            if (!priceData && product.variations?.length > 0) {
              const prices = product.variations.map((v) => v.salePrice);
              priceText = `${Math.min(...prices).toLocaleString()}đ - ${Math.max(...prices).toLocaleString()}đ`;
            }

    return (
        <div>

            <Table columns={columns} data={data} />
        </div>
    );
};

export default ProductCard;