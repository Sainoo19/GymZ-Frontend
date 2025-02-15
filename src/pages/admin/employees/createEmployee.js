import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FileDrop } from "./FileDropEm";

const CreateEmployee = () => {
  const navigate = useNavigate();
  const [branches, setBranches] = useState([]);
  const [showPassword, setShowPassword] = useState(true);
  const [employee, setEmployee] = useState({
    email: "",
    password: "",
    phone: "",
    name: "",
    branch_id: "B001",
    role: "Nhân viên",
    salary: "",
    hiredAt: new Date().toISOString().split("T")[0],
    avatar: "",
  });

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await axios.get("http://localhost:3000/branches/all/nopagination"); // 🔹 Thay URL_API bằng API thực tế
        setBranches(response.data.data); // 🔹 Cập nhật danh sách chi nhánh
      } catch (error) {
        console.error("Lỗi khi lấy danh sách chi nhánh:", error);
      }
    };
  
    fetchBranches();
  }, []);

  // Định dạng số tiền
  const formatSalary = (value) => {
    return value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleFileUpload = (fileName) => {
    console.log("File name received:", fileName);
    setEmployee((prev) => ({ ...prev, avatar: fileName }));
  };

  const handleCreateEmployee = async (e) => {
    e.preventDefault(); // Ngăn chặn reload trang

    try {
      // Chuyển đổi lương từ định dạng có dấu chấm thành số nguyên
      const formattedEmployee = {
        ...employee,
        salary: parseInt(employee.salary.replace(/\./g, ""), 10), // Xử lý lương
      };

      const response = await axios.post(
        "http://localhost:3000/employees/create",
        formattedEmployee
      );
      const employeeId = response.data.data._id;
      // console.log("Employee created with ID:", employeeId);

      alert("Tạo nhân viên thành công!");
      navigate("/employees"); // Chuyển hướng sau khi tạo thành công
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert("Email đã tồn tại, vui lòng chọn email khác");
      } else {
        alert("Lỗi khi tạo nhân viên");
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Thêm Nhân Viên Mới</h1>
      <form onSubmit={handleCreateEmployee} className="space-y-4">
        {/* Nhập Tên */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Tên</label>
          <input
            type="text"
            placeholder="Nhập tên"
            value={employee.name}
            onChange={(e) => setEmployee({ ...employee, name: e.target.value })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
          />
        </div>
        {/* Nhập ảnh */}
        <div className=" w-1/2 justify-items-center ">
          <p className="font-semibold text-base mt-6 mb-3">Hình ảnh</p>
          <FileDrop onFileUpload={handleFileUpload} />
        </div>

        {/* Nhập Email */}
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input
            type="email"
            placeholder="nguyenvana@gmail.com"
            value={employee.email}
            onChange={(e) =>
              setEmployee({ ...employee, email: e.target.value })
            }
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
          />
        </div>

        {/* Nhập Mật khẩu + Hiện mật khẩu */}
        <div>
          <label className="block text-sm font-medium">Mật khẩu</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="*********"
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

        {/* Nhập Số Điện Thoại */}
        <div>
          <label className="block text-sm font-medium">Số điện thoại</label>
          <input
            type="tel"
            placeholder="0123456789"
            value={employee.phone}
            onChange={(e) =>
              setEmployee({ ...employee, phone: e.target.value })
            }
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
          />
        </div>
        {/* Nhập Lương (Định dạng số) */}
        <div>
          <label className="block text-sm font-medium">Lương</label>
          <input
            type="text"
            value={employee.salary}
            onChange={(e) =>
              setEmployee({ ...employee, salary: formatSalary(e.target.value) })
            }
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
            placeholder="Nhập lương"
          />
        </div>
        {/* Chọn Chi Nhánh */}
        <div>
          <label className="block text-sm font-medium">Chi nhánh</label>
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

        {/* Chọn Vai Trò */}
        <div>
          <label className="block text-sm font-medium">Vai trò</label>
          <select
            value={employee.role}
            onChange={(e) => setEmployee({ ...employee, role: e.target.value })}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
          >
            <option value="Quản trị viên">Quản trị viên</option>
            <option value="Quản lí">Quản lý</option>
            <option value="Nhân viên">Nhân viên</option>
          </select>
        </div>

        {/* Chọn Ngày Tuyển Dụng */}
        <div>
          <label className="block text-sm font-medium">Ngày tuyển dụng</label>
          <input
            type="date"
            value={employee.hiredAt}
            onChange={(e) =>
              setEmployee({ ...employee, hiredAt: e.target.value })
            }
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
          />
        </div>

        {/* <div>
                <label className="block text-sm font-medium text-gray-700">Ngày Tạo</label>
                <input
                    type="text"
                    value={employee.createdAt}
                    readOnly
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
                />
            </div>
            <div>
                <label className="block text-sm font-medium text-gray-700">Ngày Cập Nhật</label>
                <input
                    type="text"
                    value={employee.updatedAt}
                    readOnly
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100"
                />
            </div> */}
        {/* Buttons */}
        <div className="flex gap-4 mt-4">
          {/* Nút Lưu (Chiếm 2/3) */}
          <button
            type="submit"
            className="w-2/3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={handleCreateEmployee}
          >
            Lưu Nhân Viên
          </button>

          {/* Nút Hủy (Chiếm 1/3) */}
          <button
            className="w-1/3 bg-gray-400 text-white py-2 rounded hover:bg-gray-500"
            onClick={() => navigate("/employees")}
          >
            Hủy
          </button>
        </div>

        {/* <div>
                <button
                    type="submit"
                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Thêm Nhân Viên
                </button>
            </div> */}
      </form>
    </div>
  );
};
export default CreateEmployee;
