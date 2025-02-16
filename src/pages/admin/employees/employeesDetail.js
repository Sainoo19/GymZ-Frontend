import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { FileDrop } from "./FileDropEm";
import reformDateTime from "../../../components/utils/reformDateTime";

const UpdateEmployeeForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [branches, setBranches] = useState([]);
  const [newFileName, setNewFileName] = useState("");

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/employees/${id}`
        );
        setEmployee(response.data.data); // Access the data field
      } catch (error) {
        console.error("Error fetching employee:", error);
      }
    };

    const fetchBranches = async () => {
      try {
        const response = await axios.get("http://localhost:3000/branches/all/nopagination"); // 🔹 Thay URL_API bằng API thực tế
        setBranches(response.data.data); // 🔹 Cập nhật danh sách chi nhánh
      } catch (error) {
        console.error("Lỗi khi lấy danh sách chi nhánh:", error);
      }
    };

    fetchBranches();
    fetchEmployee();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updatedEmployee = {
        ...employee,
        avatar: newFileName || employee.avatar,
        updatedAt: new Date().toISOString(), // Update the updatedAt field
      };
      await axios.put(
        `http://localhost:3000/employees/update/${id}`,
        updatedEmployee
      );
      navigate("/employees"); // Navigate back to the payments list
    } catch (error) {
      console.error("Error updating employee:", error);
    }
  };

  // Định dạng lương
  const formatSalary = (value) => {
    return new Intl.NumberFormat("vi-VN").format(value);
  };

  if (!employee) {
    return <div>Loading...</div>;
  }
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Cập Nhật Nhân Viên</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">ID</label>
          <input
            type="text"
            value={employee._id}
            readOnly
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
          />
        </div>

        {/* Tên */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Tên</label>
          <input
            type="text"
            value={employee.name}
            onChange={(e) => setEmployee({ ...employee, name: e.target.value })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
          />
        </div>
        {/* Avatar */}
        <div className="flex flex-col items-center">
          <label className="block font-medium">Ảnh đại diện</label>
          <div className="flex justify-center w-full">
            <img
              src={newFileName || employee.avatar || "https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg"} // 🔹 Lấy trực tiếp URL ảnh
              alt="Avatar"
              className="w-24 h-24 rounded mb-2"
            />
          </div>
          <FileDrop onFileUpload={setNewFileName} />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            value={employee.email}
            onChange={(e) =>
              setEmployee({ ...employee, email: e.target.value })
            }
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
          />
        </div>

        {/* Số điện thoại */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Số Điện Thoại
          </label>
          <input
            type="text"
            value={employee.phone}
            onChange={(e) =>
              setEmployee({ ...employee, phone: e.target.value })
            }
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
          />
        </div>

        {/* Mật khẩu */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Mật khẩu
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={employee.password}
              onChange={(e) =>
                setEmployee({ ...employee, password: e.target.value })
              }
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 flex items-center text-gray-500"
            >
              {showPassword ? "Ẩn" : "Hiện"}
            </button>
          </div>
        </div>

        {/* Chi nhánh */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Chi nhánh
          </label>
          <select
            value={employee.branch_id}
            onChange={(e) =>
              setEmployee({ ...employee, branch_id: e.target.value })
            }
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
          >
            <option value="">Chọn chi nhánh</option>
            {branches.map((branch) => (
              <option key={branch.id} value={branch.id}>
                {branch._id}
              </option>
            ))}
          </select>
        </div>

        {/* Vai trò */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Vai Trò
          </label>
          <select
            value={employee.role}
            onChange={(e) => setEmployee({ ...employee, role: e.target.value })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
          >
            <option value="Quản trị viên">Quản trị viên</option>
            <option value="Quản lý">Quản lý</option>
            <option value="Nhân viên">Nhân viên</option>
          </select>
        </div>

        {/* Lương */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Lương
          </label>
          <input
            type="text"
            value={formatSalary(employee.salary || 0)}
            onChange={(e) => {
              const rawValue = e.target.value.replace(/\D/g, ""); // Chỉ giữ lại số
              setEmployee({ ...employee, salary: Number(rawValue) });
            }}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        {/* Ngày vào làm */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Ngày Vào Làm
          </label>
          <input
            type="date"
            value={
              employee.hiredAt
                ? new Date(employee.hiredAt).toISOString().split("T")[0]
                : ""
            }
            onChange={(e) =>
              setEmployee({ ...employee, hiredAt: e.target.value })
            }
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Ngày Tạo
          </label>
          <input
            type="text"
            value={reformDateTime(employee.createdAt)}
            readOnly
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Ngày Cập Nhật
          </label>
          <input
            type="text"
            value={reformDateTime(employee.updatedAt)}
            readOnly
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mt-4">
          {/* Nút Lưu (Chiếm 2/3) */}
          <button
            type="submit"
            className="w-2/3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={() => console.log("Nhân viên đã cập nhật", employee)}
          >
            Cập nhật Nhân Viên
          </button>

          {/* Nút Hủy (Chiếm 1/3) */}
          <button
            className="w-1/3 bg-gray-400 text-white py-2 rounded hover:bg-gray-500"
            onClick={() => navigate("/employees")}
          >
            Hủy
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateEmployeeForm;