import { useRef, useEffect, useState } from "react";
import { FileDrop } from "../../../components/admin/product/FileDrop";
import axios from "axios";
import { TypeInventory } from "../../../components/admin/inventory/TypeInvemtory";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import CSS cho QuillJS

const API_BASE_URL = process.env.REACT_APP_API_URL;

const AddInventory = ({ onClose }) => {
  const { productId } = useParams();
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
  const [content, setContent] = useState(""); // Initialize content with an empty string
  const [brand, setBrand] = useState("");
  const [avatar, setAvatar] = useState("");
  const [variations, setVariations] = useState([]);
  const [images, setImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false); // Thêm trạng thái tải lên

  useEffect(() => {
    if (!productId) {
      return;
    }

    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}analysis/products-inventory/${productId}`
        );
        const product = response.data.product; // Kiểm tra response

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
      setContent(productData.description || ""); // Set content with description
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

  const handleSave = async () => {
  
    if (!productId) {
      alert("Không tìm thấy productId để cập nhật!");
      return;
    }
  
    try {
      const formattedVariations = variations
        .filter((v) => v.category && v.theme) // Chỉ lấy những mục có category và theme
        .map((v) => ({
          category: v.category,
          theme: v.theme,
          stock: Number(v.stock) || 0,
          additionalStock: Number(v.additionalStock) || 0, // Chuyển đổi thành số
        }));
  
  
  
      // Gửi API cập nhật stock
      const response = await axios.put(
        `${API_BASE_URL}analysis/update-stock/${productId}`,
        { variations: formattedVariations }
      );
  
      alert("Cập nhật tồn kho thành công!");
      navigate(`/admin/dashboard`);
    } catch (error) {
      console.error("Lỗi khi cập nhật tồn kho:", error.response?.data || error);
      alert("Cập nhật tồn kho thất bại! Kiểm tra lại dữ liệu.");
    }
  };
  
  

  const modules = {
    toolbar: [
      [{ header: "1" }, { header: "2" }, { font: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      ["link", "image"],
      [{ align: [] }],
      [{ color: [] }, { background: [] }],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "font",
    "list",
    "bullet",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "link",
    "image",
    "align",
    "color",
    "background",
  ];

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
                  className="border-2  rounded-lg p-1 w-11/12 text-gray-600 bg-gray-100 focus:outline-none "
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  readOnly
                ></input>

                <p className="font-semibold text-base mt-6 mb-3">Loại hàng</p>
                <input
                  type="text"
                  placeholder="Nhập tên sản phẩm"
                  className="border-2  rounded-lg p-1 w-11/12 text-gray-600 bg-gray-100 focus:outline-none "
                  value={selectedCategory}
                  onChange={(e) => setName(e.target.value)}
                  readOnly
                ></input>

                <p className="font-semibold text-base mt-6 mb-3">
                  Tên thương hiệu
                </p>
                <input
                  type="text"
                  placeholder="Nhập tên thương hiệu"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  readOnly
                  className="border-2  rounded-lg p-1 w-11/12 text-gray-600 bg-gray-100 focus:outline-none "
                ></input>
                <div className="w-11/12 border-dashed border-t-2 border-primary mt-5"></div>

                <TypeInventory
                  variations={variations}
                  setVariations={setVariations}
                />
              </div>
            </div>

            <div className=" w-1/2 justify-items-center ">
              <p className="font-semibold text-base mt-6 ">
                Hình đại diện sản phẩm
              </p>
              <div className=" block mt-4 bg-gray-300 w-10/12 h-72  rounded-2xl">
                {selectedAvatar ? (
                  <img
                    src={selectedAvatar}
                    alt="Selected Avatar"
                    className="h-full w-full max-w-full p-3 object-contain rounded-2xl"
                  />
                ) : (
                  <p className="text-gray-500">Chọn một ảnh để hiển thị</p>
                )}
              </div>
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
                onClick={() => navigate("/product")}
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
export default AddInventory;
