import { useState, useEffect } from "react";
import axios from "axios";

const FrequentlyBoughtTogether = () => {
  const [products, setProducts] = useState([]);
  const [selectedCombos, setSelectedCombos] = useState([]);
  const [discount, setDiscount] = useState("");
  const [maxDiscount, setMaxDiscount] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [validFrom, setValidFrom] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [usageLimit, setUsageLimit] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    axios
      .get(`${API_URL}analysis/frequently-bought-together`, {
        withCredentials: true,
      })
      .then((response) => setProducts(response.data.recommendations))
      .catch((error) => console.error("Lỗi khi tải dữ liệu:", error));
  }, []);

  const toggleCombo = (product1, product2) => {
    const combo = `${product1._id}-${product2._id}`;
    setSelectedCombos((prev) =>
      prev.includes(combo) ? prev.filter((c) => c !== combo) : [...prev, combo]
    );
  };

  const submitPromotion = async () => {
    if (
      !selectedCombos.length ||
      discount <= 0 ||
      !validFrom ||
      !validUntil ||
      usageLimit <= 0
    ) {
      alert("Vui lòng nhập đầy đủ thông tin hợp lệ!");
      return;
    }
  
    try {
      // Chuyển danh sách combo thành danh sách sản phẩm áp dụng, loại bỏ ID trùng lặp
      const applicableProducts = [...new Set(selectedCombos.flatMap(combo => combo.split("-")))];
  
      const response = await axios.post(
        `${API_URL}discounts/create-discount-combo`,
        {
          selectedCombos,  // Giữ lại để đối chiếu nếu cần debug
          applicableProducts, // Đã loại bỏ ID trùng
          discountPercent: discount,
          maxDiscount,
          code,
          description,
          validFrom,
          validUntil,
          usageLimit,
          status: "active",
        },
        { withCredentials: true }
      );
  
      alert("Khuyến mãi đã được tạo thành công!");
      setIsModalOpen(false);
      setSelectedCombos([]);
      setDiscount(0);
      setMaxDiscount(0);
      setCode("");
      setDescription("");
      setValidFrom("");
      setValidUntil("");
      setUsageLimit(1);
    } catch (error) {
      console.error("Lỗi khi tạo khuyến mãi:", error);
      alert(error.response?.data?.error || "Lỗi khi tạo khuyến mãi, vui lòng thử lại!");
    }
  };
  
  

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Sản phẩm thường mua cùng nhau</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(({ product1, product2, count }) => (
          <div
            key={`${product1._id}-${product2._id}`}
            className={`p-4 border rounded-lg shadow-md cursor-pointer transition-all ${
              selectedCombos.includes(`${product1._id}-${product2._id}`)
                ? "bg-blue-100"
                : "bg-white"
            }`}
            onClick={() => toggleCombo(product1, product2)}
          >
            <div className="flex items-center gap-4">
              <img
                src={product1.avatar}
                alt={product1.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div>
                <p className="font-semibold">{product1.name}</p>
                <p className="text-sm text-gray-500">
                  {product1.category?.join(", ")}
                </p>
                <p className="text-sm text-gray-500">
                  {product1.theme?.join(", ")}
                </p>
              </div>
            </div>
            <div className="text-center text-gray-600 my-2">+</div>
            <div className="flex items-center gap-4">
              <img
                src={product2.avatar}
                alt={product2.name}
                className="w-16 h-16 object-cover rounded"
              />
              <div>
                <p className="font-semibold">{product2.name}</p>
                <p className="text-sm text-gray-500">
                  {product2.category?.join(", ")}
                </p>
                <p className="text-sm text-gray-500">
                  {product2.theme?.join(", ")}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Đã mua cùng nhau {count} lần
            </p>
          </div>
        ))}
      </div>
      <button
        onClick={() => setIsModalOpen(true)}
        className="mt-6 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-all"
      >
        Tạo khuyến mãi
      </button>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg ">
            <h3 className="text-xl font-semibold mb-4">Tạo khuyến mãi</h3>
            {selectedCombos.length > 0 && (
              <div className="mb-4">
                <h4 className="text-md font-semibold mb-2">
                  Các sản phẩm đã chọn:
                </h4>
                <ul className="max-h-40 overflow-y-auto border p-2 rounded-md">
                  {selectedCombos.map((combo, index) => {
                    const [id1, id2] = combo.split("-");
                    const product1 = products.find(
                      (p) => p.product1._id === id1
                    )?.product1;
                    const product2 = products.find(
                      (p) => p.product2._id === id2
                    )?.product2;
                    return (
                      product1 &&
                      product2 && (
                        <li
                          key={index}
                          className="flex items-center gap-4 p-2 mt-1 border-b"
                        >
                          <img
                            src={product1.avatar}
                            alt={product1.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <span>{product1.name}</span>
                          <span className="text-gray-500">+</span>
                          <img
                            src={product2.avatar}
                            alt={product2.name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <span>{product2.name}</span>
                          <button
                            onClick={() =>
                              setSelectedCombos((prev) =>
                                prev.filter((c) => c !== combo)
                              )
                            }
                            className="ml-auto text-red-500 hover:underline"
                          >
                            Xóa
                          </button>
                        </li>
                      )
                    );
                  })}
                </ul>
              </div>
            )}

            <label className="block text-sm font-medium">Mã khuyến mãi</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full p-2 border rounded-md mb-2"
            />
            <label className="block text-sm font-medium">Mô tả</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border rounded-md mb-2"
            />
            <label className="block text-sm font-medium">
              Phần trăm giảm giá (%)
            </label>
            <input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
              className="w-full p-2 border rounded-md mb-2"
            />
             <label className="block text-sm font-medium">
              Giảm giá tối đa
            </label>
            <input
              type="number"
              value={maxDiscount}
              onChange={(e) => setMaxDiscount(Number(e.target.value))}
              className="w-full p-2 border rounded-md mb-2"
            />
            <label className="block text-sm font-medium">Ngày bắt đầu</label>
            <input
              type="date"
              value={validFrom}
              onChange={(e) => setValidFrom(e.target.value)}
              className="w-full p-2 border rounded-md mb-2"
            />
            <label className="block text-sm font-medium">Ngày kết thúc</label>
            <input
              type="date"
              value={validUntil}
              onChange={(e) => setValidUntil(e.target.value)}
              className="w-full p-2 border rounded-md mb-2"
            />
            <label className="block text-sm font-medium">
              Giới hạn sử dụng
            </label>
            <input
              type="number"
              value={usageLimit}
              onChange={(e) => setUsageLimit(Number(e.target.value))}
              className="w-full p-2 border rounded-md mb-2"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-4 py-2 bg-gray-400 text-white rounded-lg"
              >
                Hủy
              </button>
              <button
                onClick={submitPromotion}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FrequentlyBoughtTogether;
