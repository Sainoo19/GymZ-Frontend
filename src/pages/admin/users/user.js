import React, { useState, useEffect } from "react";
import axios from "axios";
import Table from "../../../components/admin/Table";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Pagination from "../../../components/admin/layout/Pagination";
import { FaFilter } from "react-icons/fa";
import reformDateTime from "../../../components/utils/reformDateTime";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const User = () => {
  const [columns] = useState([
    { field: "_id", label: "USER ID" },
    { field: "name", label: "NAME" },
    { field: "address", label: "ADDRESS" },
    { field: "createdAt", label: "CREATED AT" },
    { field: "updatedAt", label: "UPDATED AT" },
    { field: "status", label: "STATUS" },
  ]);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const URL_API = process.env.REACT_APP_API_URL;

  const [filters, setFilters] = useState({
    role: "",
    status: "",
    createdAt: "",
  });
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);

  const [exportFilters, setExportFilters] = useState({
    branchId: "",
    type: "",
    startDate: "",
    endDate: "",
  });
  const toggleExportModal = () => {
    setIsExportModalOpen(!isExportModalOpen);
  };

  const handleExportFilterChange = (e) => {
    setExportFilters({
      ...exportFilters,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${URL_API}users/all`, {
          params: {
            page: currentPage,
            limit: 10,
            search,
            ...filters,
            ...exportFilters,
          },
        });
        if (response.data.status === "success") {
          setUsers(response.data.data.users);
          setTotalPages(response.data.metadata.totalPages);
        } else {
          console.error("API response error:", response.data.message);
        }
      } catch (error) {
        setError(`Error fetching data: ${error.message}`);
        setUsers([]); // Đảm bảo xóa dữ liệu cũ khi có lỗi
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [currentPage, search, filters, exportFilters]);

  const handleEdit = (id) => {
    navigate(`/admin/users/${id}`);
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
      title: "Bạn có chắc chắn muốn xóa?",
      text: "Hành động này không thể hoàn tác!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Xóa ngay!",
      cancelButtonText: "Hủy",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.delete(`${URL_API}users/delete/${id}`);

          if (response.status === 200) {
            Swal.fire("Xóa thành công!", "Người dùng đã bị xóa.", "success");
            setUsers((prevUsers) =>
              prevUsers.filter((user) => user._id !== id)
            );
          } else {
            Swal.fire(
              "Xóa không thành công!",
              "Vui lòng thử lại sau.",
              "error"
            );
          }
        } catch (error) {
          console.error("Lỗi khi xóa khách hàng:", error);
          Swal.fire("Lỗi!", "Có lỗi xảy ra khi xóa.", "error");
        }
      }
    });
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const toggleFilterModal = () => {
    setIsFilterModalOpen(!isFilterModalOpen);
  };

  const applyFilters = () => {
    setCurrentPage(1);
    setIsFilterModalOpen(false);
  };
  const handleExport = async () => {
    try {
      const response = await axios.get(`${URL_API}users/all`, {
        params: {
          ...exportFilters,
          limit: 1000, // Giới hạn dữ liệu xuất
        },
        withCredentials: true,
      });

      if (response.data.status === "success") {
        const users = response.data.data.users.map((user) => ({
          "USER ID": user._id,
          NAME: user.name,
          EMAIL: user.email,
          PHONE: user.phone,
          ROLE: user.role,
          STATUS: user.status,
          "CREATED AT": reformDateTime(user.createdAt),
          "UPDATED AT": reformDateTime(user.updatedAt),
          "HIRED AT": user.hiredAt ? reformDateTime(user.hiredAt) : "",
        }));

        const ws = XLSX.utils.json_to_sheet(users);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, "Users_Report");

        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], {
          type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        });

        saveAs(data, "users_report.xlsx");
        alert("Xuất báo cáo thành công!");
        // Đóng modal và reset filters
        toggleExportModal(); // Đóng modal
        setExportFilters({
          branchId: "",
          type: "",
          startDate: "",
          endDate: "",
        }); // Reset filters
      } else {
        alert("Lỗi khi xuất báo cáo: " + response.data.message);
      }
    } catch (error) {
      console.error("Lỗi khi xuất báo cáo:", error);
      alert("Xuất báo cáo thất bại!");
    }
  };

  return (
    <div>
      <div className="mt-20">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">Tất cả khách hàng</h1>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Tìm kiếm khách hàng..."
              value={search}
              onChange={handleSearchChange}
              className="px-4 py-2 border rounded"
            />
            <button
              className="bg-primary text-white px-4 py-2 rounded hover:bg-secondary transition-all flex items-center"
              onClick={toggleFilterModal}
            >
              <FaFilter /> Lọc
            </button>
            <button
              onClick={() => navigate("/users/create")}
              className="bg-primary text-white px-4 py-2 rounded hover:bg-secondary transition-all"
            >
              Thêm khách hàng
            </button>
            <button
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-all"
              onClick={toggleExportModal}
            >
              Xuất Báo Cáo
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
            data={users.map((user) => ({
              ...user,
              address: user.address
                ? `${user.address.street}, ${user.address.ward}, ${user.address.district}, ${user.address.province}`
                : "N/A",
              createdAt: reformDateTime(user.createdAt),
              updatedAt: reformDateTime(user.updatedAt),
            }))}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        )}
        <Pagination
          totalPages={totalPages}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>

      {isFilterModalOpen && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Lọc khách hàng</h2>

            {/* Lọc theo vai trò */}
            <label className="block mb-2">Vai trò:</label>
            <select
              name="role"
              value={filters.role}
              onChange={handleFilterChange}
              className="w-full border px-3 py-2 rounded mb-4"
            >
              <option value="">Tất cả</option>
              <option value="user">User</option>
              <option value="silver">Silver</option>
              <option value="gold">Gold</option>
            </select>

            {/* Lọc theo trạng thái */}
            <label className="block mb-2">Trạng thái:</label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full border px-3 py-2 rounded mb-4"
            >
              <option value="">Tất cả</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

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
            <div className="flex justify-between">
              <button
                onClick={toggleFilterModal}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
              >
                Hủy
              </button>
              <button
                onClick={applyFilters}
                className="bg-primary text-white px-4 py-2 rounded hover:bg-secondary transition-all"
              >
                Áp dụng
              </button>
            </div>
          </div>
        </div>
      )}
      {isExportModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg">
            <h2 className="text-xl font-bold mb-4">
              Lọc Dữ Liệu Xuất Báo Cáo Nhân Viên
            </h2>
            <div className="mb-4">
              <label className="block mb-2">Vai trò:</label>
              <select
                name="role"
                value={filters.role}
                onChange={handleFilterChange}
                className="w-full border px-3 py-2 rounded mb-4"
              >
                <option value="">Tất cả</option>
                <option value="user">User</option>
                <option value="silver">Silver</option>
                <option value="gold">Gold</option>
              </select>
            </div>
            {/* <div className="mb-4">
                <label className="block mb-2">Chi Nhánh</label>
                <input
                    type="text"
                    name="branchId"
                    value={exportFilters.branchId}
                    onChange={handleExportFilterChange}
                    className="w-full px-4 py-2 border rounded"
                    placeholder="Nhập ID chi nhánh"
                />
            </div> */}
            <div className="mb-4">
              <label className="block mb-2">
                Tên Nhân Viên, Email hoặc UserID
              </label>
              <input
                type="text"
                name="search"
                value={exportFilters.search}
                onChange={handleExportFilterChange}
                className="w-full px-4 py-2 border rounded"
                placeholder="Nhập tên, email nhân viên hoặc UserID"
              />
            </div>

            {/* <div className="mb-4">
                <label className="block mb-2">Ngày Bắt Đầu</label>
                <input
                    type="date"
                    name="startDate"
                    value={exportFilters.startDate}
                    onChange={handleExportFilterChange}
                    className="w-full px-4 py-2 border rounded"
                />
            </div>
            <div className="mb-4">
                <label className="block mb-2">Ngày Kết Thúc</label>
                <input
                    type="date"
                    name="endDate"
                    value={exportFilters.endDate}
                    onChange={handleExportFilterChange}
                    className="w-full px-4 py-2 border rounded"
                />
            </div> */}
            <div className="flex justify-end space-x-2">
              <button
                className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                onClick={toggleExportModal}
              >
                Hủy
              </button>
              <button
                className="bg-primary text-white px-4 py-2 rounded hover:bg-secondary transition-all"
                onClick={handleExport}
              >
                Xuất Báo Cáo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default User;
