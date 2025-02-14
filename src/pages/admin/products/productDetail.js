import { useRef, useEffect, useState } from "react";
import { FileDrop } from "../../../components/admin/product/FileDrop";
import axios from "axios";
import { TypeProduct } from "../../../components/admin/product/TypeProduct";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const API_BASE_URL = "http://localhost:3000/products";

const ProductDetail = ({ onClose }) => {
  const { productId } = useParams();
  const textareaRef = useRef(null);
  const [selected, setSelected] = useState("");
  const [productData, setProductData] = useState({
    name: "",
    description: "",
    category: "",
    brand: "",
    images: [],
    variants: [], // Danh sách loại hàng
  });
  const [selectedAvatar, setSelectedAvatar] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [brand, setBrand] = useState("");
  const [avatar, setAvatar] = useState("");
  const [variations, setVariations] = useState([]);
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (!productId) {
      console.log("productId:", productId); // Kiểm tra dữ liệu API trả về

      return;
    }

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
    const fetchProductCategory = async () => {
      try {
        const res = await axios.get(
          "http://localhost:3000/productCategory/all"
        );
        console.log("Fetched categories:", res.data);

        // Cập nhật đúng đường dẫn tới danh sách danh mục
        if (
          res.data &&
          res.data.data &&
          Array.isArray(res.data.data.categories)
        ) {
          setCategories(res.data.data.categories);
        } else {
          console.error("Dữ liệu danh mục không hợp lệ:", res.data);
          setCategories([]); // Đảm bảo luôn có mảng
        }
      } catch (error) {
        console.error("Lỗi khi lấy danh mục sản phẩm:", error);
        setCategories([]);
      }
    };

    fetchProductCategory();
  }, []);

  useEffect(() => {
    if (productData && Object.keys(productData).length > 0) {
      setName(productData.name || "");
      setDescription(productData.description || "");
      setSelectedCategory(productData.category || "");
      setBrand(productData.brand || "");
      setVariations(productData.variations || []); // Quan trọng: cập nhật variations từ API
      setImages(productData.images || []);
      setSelectedAvatar(productData.avatar || ""); // Cập nhật avatar từ dữ liệu sản phẩm
      console.log("ava", productData.avatar);
    }
  }, [productData]);

  useEffect(() => {
    console.log("Variations updated:", variations);
  }, [variations]);

  const handleInput = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto"; // Reset chiều cao để tính lại chính xác
    textarea.style.height = `${Math.min(textarea.scrollHeight, 300)}px`; // Tự động mở rộng nhưng không vượt quá 600px
  };

  const handleSave = async () => {
    console.log("Avatar to save:", selectedAvatar);
    console.log("Images list:", images);

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
        avatar: selectedAvatar || images[0], // Lấy avatar hoặc ảnh đầu tiên nếu chưa chọn

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
                {console.log("Categories in render:", categories)}

                <select
                  className="border-2 text-sm border-gray-600 rounded-lg p-1 w-11/12 focus:outline-none focus:ring-2 focus:ring-primary "
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="" disabled>
                    Chọn loại hàng
                  </option>
                  {Array.isArray(categories) && categories.length > 0 ? (
                    categories.map((item) => (
                      <option key={item._id} value={item._id}>
                        {item.name}
                      </option>
                    ))
                  ) : (
                    <option disabled>Không có danh mục nào</option>
                  )}
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

                <TypeProduct
                  variations={variations}
                  setVariations={setVariations}
                />
              </div>
            </div>

            <div className=" w-1/2 justify-items-center ">
              <FileDrop
                images={images}
                setImages={setImages}
                selectedAvatar={selectedAvatar}
                setSelectedAvatar={setSelectedAvatar}
              />

              {console.log("selectedAvatar", selectedAvatar)}
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
              <button
                onClick={() => navigate("/products")}
                className="m-3 p-2 w-1/4 block border border-primary rounded-lg"
              >
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
