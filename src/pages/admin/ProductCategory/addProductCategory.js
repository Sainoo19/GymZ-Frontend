import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateProductCategory = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState({
    name: '',
    description: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory((prevCategory) => ({
      ...prevCategory,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newCategory = {
        name: category.name,
        description: category.description
      };
      console.log("Dữ liệu gửi đi:", newCategory);

      const response = await axios.post('http://localhost:3000/productCategory/create', newCategory);
      console.log('Product category created successfully', response.data);
      navigate('/admin/productCategories');
    } catch (error) {
      console.error('Error creating product category:', error);
    }
  };

  const handleCancel = () => {
    navigate('/admin/productCategories');
  };

  return (
    <div className="mt-16 p-6 transition-all duration-300 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-black mb-6">Thêm danh mục sản phẩm</h2>
      <div className="w-full flex justify-center items-center">
        <form onSubmit={handleSubmit} className="w-full max-w-2xl bg-white rounded-xl shadow-lg p-8 border-t-4 border-yellow-400">
          <div className="space-y-6">
            <div>
              <label className="block text-lg font-medium text-black mb-2">
                Tên danh mục
              </label>
              <input
                type="text"
                placeholder="Nhập tên danh mục (ví dụ: Thực phẩm bổ sung)"
                name="name"
                value={category.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all text-black placeholder-gray-500"
                required
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-black mb-2">
                Mô tả
              </label>
              <textarea
                placeholder="Nhập mô tả danh mục (ví dụ: Các loại thực phẩm bổ sung giúp tăng cường sức khỏe)"
                name="description"
                value={category.description}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg h-40 resize-none focus:outline-none focus:ring-2 focus:ring-yellow-4400 transition-all text-black placeholder-gray-500"
                required
              />
            </div>
          </div>

          <div className="mt-8 flex justify-center space-x-4">
            <button
              type="submit"
              className="px-6 py-3 bg-yellow-400 text-black rounded-lg hover:bg-yellow-500 transition-all shadow-md font-medium"
            >
              Lưu
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 border border-black text-black rounded-lg hover:bg-gray-200 transition-all font-medium"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProductCategory;