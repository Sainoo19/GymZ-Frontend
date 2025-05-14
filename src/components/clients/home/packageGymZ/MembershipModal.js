import { useState, useEffect } from "react";
import axios from "axios";
import { X, Loader } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
// Vẫn giữ lại Cookies để tương thích với phần còn lại của ứng dụng nếu cần
import Cookies from "js-cookie";

const MembershipModal = ({ isOpen, onClose, packageInfo }) => {
    const [branches, setBranches] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [formData, setFormData] = useState({
        branchID: "",
        employeeID: "",
    });
    const [isAuthenticated, setIsAuthenticated] = useState(false); // Thêm state kiểm tra đăng nhập
    const [countdownValue, setCountdownValue] = useState(3); // Thêm đếm ngược
    const URL_API = process.env.REACT_APP_API_URL;
    const navigate = useNavigate();
    const location = useLocation();

    // Fetch branches và kiểm tra đăng nhập khi modal mở
    useEffect(() => {
        if (isOpen) {
            fetchBranches();
            checkAuthStatus();
        }

        // Reset states khi modal đóng/mở
        return () => {
            setError(null);
            setSuccess(null);
            setCountdownValue(3);
        };
    }, [isOpen]);

    // Hàm kiểm tra trạng thái đăng nhập qua API
    const checkAuthStatus = async () => {
        try {
            const response = await axios.get(`${URL_API}users/profile`, {
                withCredentials: true
            });

            setIsAuthenticated(response.data && response.data.status === "success");
            console.log("Trạng thái đăng nhập:", response.data && response.data.status === "success" ? "Đã đăng nhập" : "Chưa đăng nhập");
        } catch (err) {
            console.log("Người dùng chưa đăng nhập:", err);
            setIsAuthenticated(false);
        }
    };

    // Fetch branches from API
    const fetchBranches = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${URL_API}home/all/home`, {
                withCredentials: true
            });
            if (response.data && response.data.data) {
                setBranches(response.data.data);
            }
            setLoading(false);
        } catch (err) {
            console.error("Error fetching branches:", err);
            setError("Không thể tải thông tin chi nhánh");
            setLoading(false);
        }
    };

    // Fetch PTs from selected branch
    const fetchPTs = async (branchId) => {
        if (!branchId) return;

        try {
            setLoading(true);
            const response = await axios.get(`${URL_API}home/${branchId}/employees`, {
                withCredentials: true
            });
            if (response.data && response.data.data) {
                setEmployees(response.data.data);
            }
            setLoading(false);
        } catch (err) {
            console.error("Error fetching PTs:", err);
            setError("Không thể tải thông tin huấn luyện viên");
            setLoading(false);
        }
    };

    // Handle branch selection
    const handleBranchChange = (e) => {
        const branchID = e.target.value;
        setFormData({ ...formData, branchID, employeeID: "" });

        // Only fetch PTs for non-BASIC packages
        if (packageInfo.type !== "BASIC") {
            fetchPTs(branchID);
        }
    };

    // Handle employee selection
    const handleEmployeeChange = (e) => {
        setFormData({ ...formData, employeeID: e.target.value });
    };

    // Hàm chuyển hướng với đếm ngược
    const redirectWithCountdown = () => {
        setError(`Vui lòng đăng nhập trước khi đăng ký gói hội viên. Chuyển hướng sau ${countdownValue} giây...`);

        const countdownInterval = setInterval(() => {
            setCountdownValue((prev) => {
                if (prev <= 1) {
                    clearInterval(countdownInterval);
                    onClose();
                    navigate("/login-user", { state: { from: location.pathname } });
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(countdownInterval);
    };

    // Handle registration form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.branchID) {
            setError("Vui lòng chọn chi nhánh");
            return;
        }

        // Kiểm tra đăng nhập bằng state thay vì cookie
        if (!isAuthenticated) {
            redirectWithCountdown();
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const registrationData = {
                type: packageInfo.type,
                duration: packageInfo.duration,
                branchID: formData.branchID,
            };

            // Only add employeeID if it's selected and not a BASIC package
            if (formData.employeeID && packageInfo.type !== "BASIC") {
                registrationData.employeeID = formData.employeeID;
            }

            const response = await axios.post(
                `${URL_API}membership/register-membership`,
                registrationData,
                { withCredentials: true }
            );

            // Show success message from API response
            setSuccess(response.data.message || "Đăng ký gói hội viên thành công!");
            setLoading(false);

            // Optional: Close the modal automatically after a few seconds
            setTimeout(() => {
                onClose();
            }, 3000);
        } catch (err) {
            console.error("Error registering membership:", err);

            // Kiểm tra lỗi authentication
            if (err.response?.status === 401) {
                setError("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
                setTimeout(() => {
                    onClose();
                    navigate("/login-user", { state: { from: location.pathname } });
                }, 1500);
            } else {
                setError(err.response?.data?.message || "Đăng ký không thành công. Vui lòng thử lại sau.");
            }
            setLoading(false);
        }
    };

    // If modal is not open, don't render anything
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Đăng Ký Gói {packageInfo.packageName}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
                        <X size={24} />
                    </button>
                </div>

                {loading && (
                    <div className="flex justify-center my-4">
                        <Loader className="animate-spin text-secondary" size={32} />
                    </div>
                )}

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                        {success}
                    </div>
                )}

                {/* Thông báo nếu chưa đăng nhập */}
                {!isAuthenticated && !loading && !error && (
                    <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
                        Bạn cần đăng nhập trước khi đăng ký gói hội viên.
                        <button
                            onClick={() => {
                                onClose();
                                navigate("/login-user", { state: { from: location.pathname } });
                            }}
                            className="ml-2 underline font-medium hover:text-yellow-800"
                        >
                            Đăng nhập ngay
                        </button>
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <div className="flex flex-col mb-4">
                            <p className="font-medium text-lg">Thông tin gói đăng ký:</p>
                            <ul className="list-disc list-inside mt-2 ml-2">
                                <li>Loại gói: {packageInfo.packageName}</li>
                                <li>Thời hạn: {packageInfo.duration} tháng</li>
                                <li>Giá tiền: {new Intl.NumberFormat('vi-VN').format(packageInfo.price)} VND</li>
                            </ul>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Chi nhánh <span className="text-red-500">*</span>
                            </label>
                            <select
                                className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                                value={formData.branchID}
                                onChange={handleBranchChange}
                                disabled={loading || !isAuthenticated}
                                required
                            >
                                <option value="">-- Chọn chi nhánh --</option>
                                {branches.map((branch) => (
                                    <option key={branch._id} value={branch._id}>
                                        {branch.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {packageInfo.type !== "BASIC" && (
                            <div className="mb-4">
                                <label className="block text-gray-700 text-sm font-bold mb-2">
                                    Huấn luyện viên
                                </label>
                                <select
                                    className="shadow border rounded w-full py-2 px-3 text-gray-700 focus:outline-none focus:shadow-outline"
                                    value={formData.employeeID}
                                    onChange={handleEmployeeChange}
                                    disabled={loading || !formData.branchID || !isAuthenticated}
                                >
                                    <option value="">-- Chọn huấn luyện viên (tùy chọn) --</option>
                                    {employees.map((employee) => (
                                        <option key={employee._id} value={employee._id}>
                                            {employee.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>

                    <div className="flex justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-2 px-4 rounded mr-2"
                            disabled={loading}
                        >
                            Hủy bỏ
                        </button>
                        <button
                            type="submit"
                            className="bg-secondary hover:bg-secondary-dark text-white font-bold py-2 px-4 rounded"
                            disabled={loading || !isAuthenticated}
                        >
                            {loading ? "Đang xử lý..." : "Xác nhận đăng ký"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MembershipModal;