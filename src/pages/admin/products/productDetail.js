import { useRef, useEffect, useState } from "react";
import { FileDrop } from "../../../components/admin/product/FileDrop";
import axios from "axios";
import { TypeProduct } from "../../../components/admin/product/TypeProduct";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Import CSS cho QuillJS

const API_BASE_URL = process.env.REACT_APP_API_URL;

const ProductDetail = ({ onClose }) => {
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
  const [isHaveImage, setIsHaveImage] = useState(true); // Thêm trạng thái tải lên
  const [errors, setErrors] = useState({});
  const typeProductRef = useRef();

  useEffect(() => {
    if (!productId) {
      console.log("productId:", productId); // Kiểm tra dữ liệu API trả về
      return;
    }

    const fetchProduct = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}products/${productId}`
        );
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
        const res = await axios.get(`${API_BASE_URL}productCategory/all`);
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
    if (!validateForm()) {
      alert("Vui lòng kiểm tra lại các trường bị lỗi.");
      return;
    }

    try {
      if (images.length === 0) {
        alert("Vui lòng tải lên ít nhất một hình ảnh!");
        return;
      }

      const formattedVariations = variations.map((v) => ({
        category: v.category,
        theme: v.theme,
        stock: Number(v.stock),
        originalPrice: Number(v.originalPrice),
        salePrice: Number(v.salePrice),
        weight: Number(v.weight),
        costPrice: Number(v.costPrice),
      }));

      const newProduct = {
        name,
        description: content, // Save content as description
        category: selectedCategory,
        brand,
        variations: formattedVariations,
        images,
        avatar: selectedAvatar || images[0], // Lấy avatar hoặc ảnh đầu tiên nếu chưa chọn

        status: "active",
      };

      if (productId) {
        await axios.put(
          `${API_BASE_URL}products/update/${productId}`,
          newProduct
        );
        alert("Cập nhật sản phẩm thành công!");
      } else {
        await axios.post(`${API_BASE_URL}products/create`, newProduct);
        alert("Sản phẩm đã được thêm!");
      }

      navigate("/admin/products"); // Quay về danh sách sản phẩm sau khi hoàn thành
    } catch (error) {
      alert("Lưu sản phẩm thất bại!");
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

  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) newErrors.name = "Tên sản phẩm không được để trống.";
    if (!content.trim()) newErrors.content = "Miêu tả không được để trống.";
    if (!selectedCategory) newErrors.category = "Vui lòng chọn loại hàng.";
    if (!brand.trim()) newErrors.brand = "Thương hiệu không được để trống.";
    if (images.length === 0) {
      newErrors.images = "Cần ít nhất một hình ảnh.";
    }
    if (!stripHtml(content).trim()) {
      newErrors.content = "Miêu tả không được để trống.";
    }

    const variationErrors = variations
      .map((v, index) => {
        const vErrors = {};
        if (!v.theme || !v.category) vErrors.general = "Thiếu loại hoặc theme.";

        const numberFields = [
          "stock",
          "originalPrice",
          "salePrice",
          "weight",
          "costPrice",
        ];
        numberFields.forEach((field) => {
          if (v[field] === "" || v[field] === undefined) {
            vErrors[field] = "Trường bắt buộc.";
          } else if (Number(v[field]) < 0) {
            vErrors[field] = "Không được âm.";
          }
        });

        return Object.keys(vErrors).length > 0
          ? { index, errors: vErrors }
          : null;
      })
      .filter(Boolean);

    if (variationErrors.length > 0) {
      newErrors.variations = variationErrors;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const stripHtml = (html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
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
                  className={`border-2 p-1 w-11/12 rounded-lg focus:outline-none focus:ring-2 ${
                    errors.name
                      ? "border-red-500"
                      : "border-gray-600 focus:ring-primary"
                  }`}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                {errors.name && (
                  <p className="text-red-500 text-sm my-3">{errors.name}</p>
                )}

                <p className="font-semibold text-base mt-6 mb-3">
                  Mô tả sản phẩm
                </p>
                <div
                  className={`border-2 rounded-lg w-11/12 focus-within:ring-2 ${
                    errors.content
                      ? "border-red-500"
                      : "border-gray-600 focus-within:ring-primary"
                  }`}
                >
                  <ReactQuill
                    value={content}
                    onChange={(value) => {
                      setContent(value);
                      setDescription(value);
                    }}
                    modules={modules}
                    formats={formats}
                  />
                </div>
                {errors.content && (
                  <p className="text-red-500 text-sm my-3">{errors.content}</p>
                )}

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
                  className={`border-2 text-sm border-gray-600 rounded-lg p-1 w-11/12 focus:outline-none focus:ring-2 focus:ring-primary ${
                    errors.brand
                      ? "border-red-500"
                      : "border-gray-600 focus:ring-primary"
                  }`}
                />
                {errors.brand && (
                  <p className="text-red-500 text-sm">{errors.brand}</p>
                )}

                <div className="w-11/12 border-dashed border-t-2 border-primary mt-5"></div>

                <TypeProduct
                  variations={variations}
                  ref={typeProductRef}
                  setVariations={setVariations}
                />
              </div>
            </div>

            <div
              className={`w-1/2 justify-items-center `}
            >
             
              <FileDrop
                images={images}
                setImages={setImages}
                selectedAvatar={selectedAvatar}
                setSelectedAvatar={setSelectedAvatar}
                isHaveImage={isHaveImage}
              />
              <div 
              className={`w-1/2 justify-items-center ${
                errors.brand
                  ? "border-red-500"
                  : "border-gray-600 focus:ring-primary"
              }`}>
                 {errors.images && (
                <p className="text-red-500 text-sm">{errors.images}</p>
              )}
              </div>

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
                onClick={() => navigate("/admin/products")}
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
