import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaUser, FaCrown, FaCalendarAlt, FaMapMarkerAlt, FaDumbbell, FaExclamationCircle, FaCheck } from 'react-icons/fa';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const MembershipContent = () => {
    const navigate = useNavigate();
    const [memberData, setMemberData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [branchName, setBranchName] = useState("");
    const [trainerName, setTrainerName] = useState("");
    const URL_API = process.env.REACT_APP_API_URL;

    useEffect(() => {
        const fetchMemberData = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`${URL_API}membership/profile`, {
                    withCredentials: true
                });

                if (response.data.status === 'success') {
                    setMemberData(response.data.data);

                    // Fetch branch name
                    if (response.data.data.branchID) {
                        fetchBranchName(response.data.data.branchID);
                    }

                    // Fetch trainer name if available
                    if (response.data.data.employeeID) {
                        fetchTrainerName(response.data.data.employeeID);
                    }
                }
                setLoading(false);
            } catch (err) {
                console.error('Error fetching membership data:', err);
                setError('Không thể tải thông tin hội viên. Vui lòng thử lại sau.');
                setLoading(false);
            }
        };

        fetchMemberData();
    }, []);

    // Fetch branch name
    const fetchBranchName = async (branchId) => {
        try {
            const response = await axios.get(`${URL_API}branches/${branchId}`, {
                withCredentials: true
            });

            if (response.data.status === 'success') {
                setBranchName(response.data.data.name);
            }
        } catch (err) {
            console.error('Error fetching branch details:', err);
        }
    };

    // Fetch trainer name
    const fetchTrainerName = async (employeeId) => {
        try {
            const response = await axios.get(`${URL_API}employees/${employeeId}`, {
                withCredentials: true
            });

            if (response.data.status === 'success') {
                setTrainerName(response.data.data.name);
            }
        } catch (err) {
            console.error('Error fetching trainer details:', err);
        }
    };

    // Format date to Vietnamese format
    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        try {
            return format(new Date(dateString), 'dd/MM/yyyy', { locale: vi });
        } catch {
            return "N/A";
        }
    };

    // Calculate days remaining until expiration
    const calculateDaysRemaining = (endDate) => {
        if (!endDate) return 0;
        const now = new Date();
        const expiration = new Date(endDate);
        const diffTime = expiration - now;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    };

    // Map membership types to Vietnamese
    const membershipTypeMap = {
        'BASIC': 'Cơ Bản',
        'SILVER': 'Bạc',
        'GOLD': 'Vàng',
        'PLATINUM': 'Bạch Kim'
    };

    // Map status types to Vietnamese
    const statusMap = {
        'ACTIVE': 'Hoạt Động',
        'INACTIVE': 'Không Hoạt Động',
        'EXPIRED': 'Hết Hạn',
        'SUSPENDED': 'Tạm Ngưng'
    };

    // Get membership color based on type
    const getMembershipColor = (type) => {
        switch (type) {
            case 'BASIC': return 'bg-gray-200 text-gray-800';
            case 'SILVER': return 'bg-gray-300 text-gray-800';
            case 'GOLD': return 'bg-yellow-100 text-yellow-800';
            case 'PLATINUM': return 'bg-blue-100 text-blue-800';
            default: return 'bg-gray-200 text-gray-800';
        }
    };

    // Get status color based on status
    const getStatusColor = (status) => {
        switch (status) {
            case 'ACTIVE': return 'bg-green-100 text-green-800';
            case 'INACTIVE': return 'bg-gray-100 text-gray-800';
            case 'EXPIRED': return 'bg-red-100 text-red-800';
            case 'SUSPENDED': return 'bg-yellow-100 text-yellow-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const renderMembershipDetails = () => {
        if (!memberData) return null;

        const daysRemaining = calculateDaysRemaining(memberData.validUntil);
        const isExpiringSoon = daysRemaining <= 14 && daysRemaining > 0;
        const isExpired = daysRemaining === 0;

        return (
            <div className="bg-white shadow-md rounded-lg p-6">
                {/* Header with membership type and status */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b pb-4">
                    <div className="flex items-center mb-3 md:mb-0">
                        <FaCrown className="text-yellow-500 mr-2 text-lg" />
                        <h2 className="text-2xl font-bold">Gói Hội Viên {membershipTypeMap[memberData.type] || memberData.type}</h2>
                        <span className={`ml-3 px-3 py-1 rounded-full text-xs font-medium ${getMembershipColor(memberData.type)}`}>
                            {membershipTypeMap[memberData.type] || memberData.type}
                        </span>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(memberData.status)}`}>
                        {statusMap[memberData.status] || memberData.status}
                    </span>
                </div>

                {/* User info with buttons */}
                <div className="flex flex-col md:flex-row justify-between items-start mb-6">
                    <div className="flex items-center mb-4 md:mb-0">
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden mr-4">
                            {memberData.user?.avatar ? (
                                <img src={memberData.user.avatar} alt="User avatar" className="w-full h-full object-cover" />
                            ) : (
                                <FaUser className="text-gray-400 text-3xl" />
                            )}
                        </div>
                        <div>
                            <h3 className="text-lg font-semibold">{memberData.user?.name || "Không có tên"}</h3>
                            <p className="text-gray-600">{memberData.user?.email || "Không có email"}</p>
                            <p className="text-gray-600">{memberData.user?.phone || "Không có số điện thoại"}</p>
                        </div>
                    </div>

                    <div className="flex flex-col space-y-2 md:space-y-3">
                        <button
                            className="bg-primary hover:bg-secondary text-white font-bold py-2 px-6 rounded-full transition-all flex items-center justify-center"
                            onClick={() => window.location.href = "/packages"}
                        >
                            {isExpired ? 'Đăng Ký Lại' : 'Nâng Cấp/Gia Hạn'}
                        </button>

                        <button
                            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-full transition-all flex items-center justify-center"
                            onClick={() => {
                                // Check if membership is active
                                if (memberData.status === 'INACTIVE' || isExpired) {
                                    // Show alert for inactive or expired membership
                                    alert('Gói hội viên của bạn đã hết hạn hoặc không hoạt động. Vui lòng gia hạn để sử dụng dịch vụ.');
                                } else {
                                    // Navigate to schedule page if membership is active
                                    navigate('/membership/schedule');
                                }
                            }}
                        >
                            Lịch Tập
                        </button>
                    </div>
                </div>

                {/* Warning for expiring membership */}
                {isExpiringSoon && (
                    <div className="bg-yellow-100 text-yellow-800 p-3 rounded-md mb-6 flex items-start">
                        <FaExclamationCircle className="mr-2 mt-1" />
                        <div>
                            <p className="font-semibold">Gói hội viên của bạn sắp hết hạn!</p>
                            <p>Còn {daysRemaining} ngày sử dụng. Vui lòng gia hạn để tiếp tục sử dụng dịch vụ.</p>
                        </div>
                    </div>
                )}

                {/* Expired membership */}
                {isExpired && (
                    <div className="bg-red-100 text-red-800 p-3 rounded-md mb-6 flex items-start">
                        <FaExclamationCircle className="mr-2 mt-1" />
                        <div>
                            <p className="font-semibold">Gói hội viên của bạn đã hết hạn!</p>
                            <p>Vui lòng gia hạn để tiếp tục sử dụng dịch vụ.</p>
                        </div>
                    </div>
                )}

                {/* Membership details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                            <FaCalendarAlt className="mr-2" /> Thời Gian Hội Viên
                        </h4>
                        <ul className="space-y-2">
                            <li className="flex justify-between">
                                <span className="text-gray-600">ID Hội viên:</span>
                                <span className="font-medium">{memberData._id}</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-gray-600">Ngày đăng ký:</span>
                                <span>{formatDate(memberData.registerDate)}</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-gray-600">Hiệu lực từ:</span>
                                <span>{formatDate(memberData.validFrom)}</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-gray-600">Hiệu lực đến:</span>
                                <span>{formatDate(memberData.validUntil)}</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-gray-600">Thời gian còn lại:</span>
                                <span className="font-medium">
                                    {daysRemaining} ngày
                                </span>
                            </li>
                        </ul>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                            <FaMapMarkerAlt className="mr-2" /> Thông Tin Phòng Tập
                        </h4>
                        <ul className="space-y-2">
                            <li className="flex justify-between">
                                <span className="text-gray-600">Chi nhánh:</span>
                                <span className="font-medium">{branchName || "Đang tải..."}</span>
                            </li>
                            <li className="flex justify-between">
                                <span className="text-gray-600">ID Chi nhánh:</span>
                                <span>{memberData.branchID}</span>
                            </li>
                            {memberData.employeeID && (
                                <>
                                    <li className="flex justify-between">
                                        <span className="text-gray-600">Huấn luyện viên:</span>
                                        <span className="font-medium">{trainerName || "Đang tải..."}</span>
                                    </li>
                                    <li className="flex justify-between">
                                        <span className="text-gray-600">ID Huấn luyện viên:</span>
                                        <span>{memberData.employeeID}</span>
                                    </li>
                                </>
                            )}
                        </ul>
                    </div>
                </div>

                {/* Membership benefits */}
                <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-gray-700 mb-3 flex items-center">
                        <FaDumbbell className="mr-2" /> Quyền lợi Hội Viên
                    </h4>
                    <ul className="space-y-2">
                        <BenefitItem text="Sử dụng tất cả thiết bị tập luyện" isIncluded={true} />
                        <BenefitItem text="Truy cập phòng tập từ 8h-22h" isIncluded={true} />

                        {/* Benefits based on membership type */}
                        <BenefitItem
                            text="Tham gia các lớp tập theo nhóm"
                            isIncluded={['SILVER', 'GOLD', 'PLATINUM'].includes(memberData.type)}
                        />
                        <BenefitItem
                            text="Ưu tiên đặt lịch các lớp tập"
                            isIncluded={['GOLD', 'PLATINUM'].includes(memberData.type)}
                        />
                        <BenefitItem
                            text="Sử dụng phòng tắm VIP"
                            isIncluded={['GOLD', 'PLATINUM'].includes(memberData.type)}
                        />
                        <BenefitItem
                            text="Phân tích thể chất chuyên sâu"
                            isIncluded={['PLATINUM'].includes(memberData.type)}
                        />
                        <BenefitItem
                            text="Tư vấn dinh dưỡng cá nhân hóa"
                            isIncluded={['PLATINUM'].includes(memberData.type)}
                        />
                        <BenefitItem
                            text="Thẻ khách mời hàng tháng"
                            isIncluded={['PLATINUM'].includes(memberData.type)}
                        />


                    </ul>
                </div>


            </div>
        );
    };

    return (
        <div className="flex-1 p-6">
            <h1 className="text-3xl font-bold mb-6">Thông Tin Hội Viên</h1>

            {loading ? (
                <div className="bg-white shadow-md rounded-lg p-6 text-center">
                    <p className="text-lg">Đang tải thông tin hội viên...</p>
                </div>
            ) : error ? (
                <div className="bg-white shadow-md rounded-lg p-6 text-center">
                    <p className="text-red-500">{error}</p>
                    <button
                        className="mt-4 bg-primary hover:bg-secondary text-white font-bold py-2 px-4 rounded"
                        onClick={() => window.location.reload()}
                    >
                        Thử lại
                    </button>
                </div>
            ) : memberData ? (
                renderMembershipDetails()
            ) : (
                <div className="bg-white shadow-md rounded-lg p-6 text-center">
                    <p className="text-lg">Bạn chưa đăng ký gói hội viên nào.</p>
                    <button
                        className="mt-4 bg-primary hover:bg-secondary text-white font-bold py-2 px-4 rounded"
                        onClick={() => window.location.href = "/packages"}
                    >
                        Đăng Ký Ngay
                    </button>
                </div>
            )}
        </div>
    );
};

// Component for membership benefits
const BenefitItem = ({ text, isIncluded }) => (
    <li className="flex items-center">
        {isIncluded ? (
            <FaCheck className="text-green-500 mr-2" />
        ) : (
            <span className="h-4 w-4 inline-block mr-2 relative">
                <span className="absolute inset-0 border border-gray-300 rounded-full"></span>
            </span>
        )}
        <span className={isIncluded ? "text-gray-800" : "text-gray-400"}>{text}</span>
    </li>
);

export default MembershipContent;