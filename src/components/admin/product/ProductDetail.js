import { useRef, useEffect, useState } from "react";
import { FileDrop } from "./FileDrop";
import axios from "axios";
import { TypeProduct } from "./TypeProduct";

const API_BASE_URL = "http://localhost:3000/products";

const loaiHang = ["Thực phẩm chức năng", "Whey", "Giày", "Quần áo"];
const ProductDetail = () => {
  const textareaRef = useRef(null);
  const handleInput = () => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto"; // Reset chiều cao để tính lại chính xác
    textarea.style.height = `${Math.min(textarea.scrollHeight, 300)}px`; // Tự động mở rộng nhưng không vượt quá 600px
  };
  const [selected, setSelected] = useState("");

  useEffect(() => {
    handleInput(); // Gọi 1 lần khi render để set chiều cao ban đầu
  }, []);

  return (
    <div className="bg-background_admin ">
      <h2 className=" p-6 block text-xl font-semibold">Thêm sản phẩm</h2>
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
                  // value={productData.}
                ></input>
                <p className="font-semibold text-base mt-6 mb-3">Miêu tả</p>
                <textarea
                  ref={textareaRef}
                  placeholder="Nhập miêu tả"
                  className="border-2 text-sm border-gray-600 rounded-lg p-2 w-11/12 focus:outline-none focus:ring-2 focus:ring-primary resize-none overflow-auto"
                  onInput={handleInput}
                />

                <p className="font-semibold text-base mt-6 mb-3">Loại hàng</p>
                <select
                  className="border-2 text-sm border-gray-600 rounded-lg p-1 w-11/12 focus:outline-none focus:ring-2 focus:ring-primary "
                  value={selected}
                  onChange={(e) => setSelected(e.target.value)}
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
                  className="border-2 text-sm border-gray-600 rounded-lg p-1 w-11/12 focus:outline-none focus:ring-2 focus:ring-primary "
                ></input>
<div className="w-11/12 border-dashed border-t-2 border-primary mt-5"></div>

                <TypeProduct />
              </div>
            </div>

            <div className=" w-1/2 justify-items-center ">
              <div className=" block mt-6 bg-gray-300 w-11/12 h-96 rounded-2xl"></div>

              <p className="font-semibold text-base mt-6 mb-3">
                Thư viện hình ảnh
              </p>
              <FileDrop></FileDrop>
            </div>
          </div>

          <div className=" w-full mb-4">
            <div className="flex justify-end">
              <button className="m-3 p-2 w-1/4 block bg-secondary rounded-lg">
                Thêm
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
