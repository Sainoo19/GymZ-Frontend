import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Table from '../../../components/admin/Table';
import { FaFilter } from 'react-icons/fa';
import reformDateTime from '../../../components/utils/reformDateTime';
import Swal from "sweetalert2";
import Pagination from '../../../components/admin/layout/Pagination';

const ProductCategory = () => {
  const columns = [
    { field: '_id', label: 'CATEGORY ID' },
    { field: 'name', label: 'NAME' },
    { field: 'description', label: 'DESCRIPTION' },
    { field: 'createdAt', label: 'CREATED AT' },
    { field: 'updatedAt', label: 'UPDATED AT' },
  ];

  const [productCategory, setProductCategory] = useState([]); // Đảm bảo khởi tạo là mảng rỗng
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    createdAt: ''
  });
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  useEffect(() => {
    const fetchProductCategory = async () => {
      try {
        const params = {
          page: currentPage,
          limit: 10,
          search,
        };

        // Nếu có ngày lọc, định dạng ngày thành ISO string (bắt đầu ngày)
        if (filters.createdAt) {
          const selectedDate = new Date(filters.createdAt);
          const startOfDay = new Date(selectedDate.setHours(0, 0, 0, 0)).toISOString();
          const endOfDay = new Date(selectedDate.setHours(23, 59, 59, 999)).toISOString();
          params.createdAtStart = startOfDay;
          params.createdAtEnd = endOfDay;
        }

        const response = await axios.get('http://localhost:3000/productCategory/all', { params });
        if (response.data.status === 'success') {
          setProductCategory(response.data.data.categories || []);
          setTotalPages(response.data.metadata.totalPages || 1);
        } else {
          console.error('API response error:', response.data.message);
          setProductCategory([]);
        }
      } catch (error) {
        setError(`Error fetching data: ${error.message}`);
        setProductCategory([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProductCategory();
  }, [currentPage, search, filters]);

  const handleEdit = (id) => {
    console.log("Navigating to:", `/productCategory/${id}`);
    navigate(`/productCategory/${id}`);
  };

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: 'Bạn có chắc chắn muốn xóa?',
      text: 'Hành động này không thể hoàn tác!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: 'Xóa ngay!',
      cancelButtonText: 'Hủy'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(`http://localhost:3000/productCategory/delete/${id}`);

          if (response.status === 200) {
            Swal.fire('Xóa thành công!', 'Danh mục sản phẩm đã bị xóa.', 'success');
            setProductCategory(prevProductCategory => prevProductCategory.filter(category => category._id !== id));
          } else {
            Swal.fire('Xóa không thành công!', 'Vui lòng thử lại sau.', 'error');
          }
        } catch (error) {
          console.error('Lỗi khi xóa danh mục:', error);
          Swal.fire('Lỗi!', 'Có lỗi xảy ra khi xóa.', 'error');
        }
      }
    });
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };

  const toggleFilterModal = () => {
    setIsFilterModalOpen(!isFilterModalOpen);
  };

  const applyFilters = () => {
    setCurrentPage(1);
    setIsFilterModalOpen(false);
  };

  return (
    <div>
      <div className="mt-4">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Tất cả danh mục sản phẩm</h1>
          <div className='flex items-center space-x-2'>
            <input
              type='text'
              placeholder='Tìm kiếm danh mục...'
              value={search}
              onChange={handleSearchChange}
              className='px-4 py-2 border rounded'
            />
            <button
              className='bg-primary text-white px-4 py-2 rounded hover:bg-secondary transition-all flex items-center'
              onClick={toggleFilterModal}
            >
              <FaFilter /> Lọc
            </button>
            <button
              onClick={() => navigate('/productCategories/create')}
              className="bg-primary text-white px-4 py-2 rounded hover:bg-secondary transition-all"
            >
              Thêm danh mục
            </button>
          </div>
        </div>

        {/* Hiển thị trạng thái loading hoặc lỗi */}
        {loading ? (
          <p>Đang tải dữ liệu...</p>
        ) : error ? (
          <p className="text-red-500">Lỗi: {error}</p>
        ) : (
          <Table
            columns={columns}
            data={productCategory.map(category => ({
              ...category,
              createdAt: reformDateTime(category.createdAt),
              updatedAt: reformDateTime(category.updatedAt),
            }))}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
        <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />
      </div>

      {isFilterModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Lọc danh mục</h2>

            {/* Lọc theo ngày tạo */}
            <label className="block mb-2">Ngày tạo:</label>
            <input
              type="date"
              name="createdAt"
              value={filters.createdAt}
              onChange={handleFilterChange}
              className="w-full border px-3 py-2 rounded mb-4"
            />

            {/* Nút áp dụng và đóng */}
            <div className='flex justify-between'>
              <button
                onClick={toggleFilterModal}
                className='bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500'
              >
                Hủy
              </button>
              <button
                onClick={applyFilters}
                className='bg-primary text-white px-4 py-2 rounded hover:bg-secondary transition-all'
              >
                Áp dụng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductCategory;