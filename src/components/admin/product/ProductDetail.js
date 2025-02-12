import { useRef, useEffect, useState } from "react";
import { FileDrop } from "./FileDrop";
import axios from "axios";
import { TypeProduct } from "./TypeProduct";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";

const API_BASE_URL = "http://localhost:3000/products";

const loaiHang = ["Thực phẩm chức năng", "Whey", "Giày", "Quần áo"];

const ProductDetail = ({ productId, onClose }) => {
  const textareaRef = useRef(null);
  const handleInput = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto"; // Reset chiều cao để tính lại chính xác
    textarea.style.height = `${Math.min(textarea.scrollHeight, 300)}px`; // Tự động mở rộng nhưng không vượt quá 600px
  };
  const [selected, setSelected] = useState("");
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    category: "",
    brand: "",
    images: [],
    variants: [], // Danh sách loại hàng
  });
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [avatar, setAvatar] = useState("");

  const [variations, setVariations] = useState([]);
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (!productId) return;
  
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/${productId}`);
        const product = response.data.data || response.data; // Kiểm tra response
  
        console.log("Fetched product:", product); // Kiểm tra dữ liệu API trả về
  
        setProductData(product);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin sản phẩm:", error);
      }
    };
  
    fetchProduct();
  }, [productId]);
  
  useEffect(() => {
    if (productData && Object.keys(productData).length > 0) {
      setName(productData.name || "");
      setDescription(productData.description || "");
      setSelectedCategory(productData.category || "");
      setBrand(productData.brand || "");
      setVariations(productData.variations || []); // Quan trọng: cập nhật variations từ API
      setImages(productData.images || []);
  
      console.log("Updated variations state:", productData.variations); // Kiểm tra state cập nhật
    }
  }, [productData]);
  
  
  useEffect(() => {
    console.log("Variations updated:", variations);
  }, [variations]);
  
  const handleSave = async () => {
    try {
      if (images.length === 0) {
        alert("Vui lòng tải lên ít nhất một hình ảnh!");
        return;
      }

      const formattedVariations = variations.map((v) => ({
        category: v.category,
        theme: v.theme,
        stock: Number(v.stock) || 0,
        originalPrice: Number(v.originalPrice) || 0,
        salePrice: Number(v.salePrice) || 0,
      }));

      const newProduct = {
        name,
        description,
        category: selectedCategory,
        brand,
        variations: formattedVariations,
        images,
        status: "active",
      };

      if (productId) {
        await axios.put(`${API_BASE_URL}/update/${productId}`, newProduct);
        alert("Cập nhật sản phẩm thành công!");
      } else {
        await axios.post(`${API_BASE_URL}/create`, newProduct);
        alert("Sản phẩm đã được thêm!");
      }

      navigate("/"); // Quay về danh sách sản phẩm sau khi hoàn thành
    } catch (error) {
      console.error("Lỗi khi lưu sản phẩm:", error);
      alert("Lưu sản phẩm thất bại!");
    }
  };
  const navigate = useNavigate();

  return (
    <div className="bg-background_admin ">
      <h2 className=" p-6 block text-xl font-semibold">
        {" "}
        {productId ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm"}
      </h2>
      <div className=" w-full flex justify-center items-center ">
        <div className="w-11/12 rounded-2xl bg-white mb-16">
          <div className="flex justify-center">
            <div className=" ml-6 w-2/3 ">
              <div className="">
                <p className="font-semibold text-base mt-6 mb-3">
                  Tên sản phẩm
                </p>
                <input
                  type="text"
                  placeholder="Nhập tên sản phẩm"
                  className="border-2  border-gray-600 rounded-lg p-1 w-11/12 focus:outline-none focus:ring-2 focus:ring-primary "
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                ></input>
                <p className="font-semibold text-base mt-6 mb-3">Miêu tả</p>
                <textarea
                  ref={textareaRef}
                  placeholder="Nhập miêu tả"
                  className="border-2 text-sm border-gray-600 rounded-lg p-2 w-11/12 focus:outline-none focus:ring-2 focus:ring-primary resize-none overflow-auto"
                  onInput={handleInput}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />

                <p className="font-semibold text-base mt-6 mb-3">Loại hàng</p>
                <select
                  className="border-2 text-sm border-gray-600 rounded-lg p-1 w-11/12 focus:outline-none focus:ring-2 focus:ring-primary "
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="" disabled>
                    Chọn loại hàng
                  </option>
                  {loaiHang.map((item, index) => (
                    <option key={index} value={item}>
                      {item}
                    </option>
                  ))}
                </select>

                <p className="font-semibold text-base mt-6 mb-3">
                  Tên thương hiệu
                </p>
                <input
                  type="text"
                  placeholder="Nhập tên thương hiệu"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="border-2 text-sm border-gray-600 rounded-lg p-1 w-11/12 focus:outline-none focus:ring-2 focus:ring-primary "
                ></input>
                <div className="w-11/12 border-dashed border-t-2 border-primary mt-5"></div>

                <TypeProduct variations={variations}  setVariations={setVariations} />
              </div>
            </div>

            <div className=" w-1/2 justify-items-center ">
              <div className=" block mt-6 bg-gray-300 w-11/12 h-96 rounded-2xl"></div>

              <p className="font-semibold text-base mt-6 mb-3">
                Thư viện hình ảnh
              </p>
              <FileDrop setImages={setImages}></FileDrop>
            </div>
          </div>

          <div className=" w-full mt-6 mb-4">
            <div className="flex justify-end">
              <button
                className="m-3 p-2 w-1/4 block bg-secondary rounded-lg"
                onClick={handleSave}
              >
                {productId ? "Cập nhật" : "Thêm"}
              </button>
              <button className="m-3 p-2 w-1/4 block border border-primary rounded-lg">
                Huỷ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default ProductDetail;
