import React from 'react';
import { FaEdit, FaTrash, FaCalendarAlt, FaClock, FaUserAlt, FaUserTie, FaTag, FaCalendarDay } from 'react-icons/fa';

const SessionCard = ({ session, onEdit, onDelete }) => {
    // Function to get status badge color
    const getStatusColor = (status) => {
        switch (status) {
            case 'scheduled':
                return 'bg-blue-100 text-blue-800';
            case 'completed':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Function to get status in Vietnamese
    const getStatusText = (status) => {
        switch (status) {
            case 'scheduled':
                return 'Đã lên lịch';
            case 'completed':
                return 'Đã hoàn thành';
            case 'cancelled':
                return 'Đã hủy';
            default:
                return status;
        }
    };

    return (
        <div className="bg-white rounded-lg shadow-md p-6 mb-4 transition-all hover:shadow-lg">
            <div className="flex justify-between items-start">
                <div>
                    <div className="flex items-center">
                        <h3 className="text-lg font-bold text-gray-800 mr-3">{session._id}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(session.status)}`}>
                            {getStatusText(session.status)}
                        </span>
                    </div>

                    <div className="mt-3">
                        <div className="flex items-center mb-2">
                            <FaUserAlt className="mr-2 text-blue-500" />
                            <span className="text-gray-700">User ID: {session.userID}</span>
                        </div>
                        <div className="flex items-center mb-2">
                            <FaUserTie className="mr-2 text-green-500" />
                            <span className="text-gray-700">Employee ID: {session.employeeID}</span>
                        </div>
                        <div className="flex items-center mb-2">
                            <FaCalendarDay className="mr-2 text-purple-500" />
                            <span className="text-gray-700">Thứ: {session.dayOfWeek}</span>
                        </div>
                        <div className="flex items-center mb-2">
                            <FaCalendarAlt className="mr-2 text-red-500" />
                            <span className="text-gray-700">Ngày: {new Date(session.date).toLocaleDateString('vi-VN')}</span>
                        </div>
                        <div className="flex items-center mb-2">
                            <FaClock className="mr-2 text-orange-500" />
                            <span className="text-gray-700">Giờ: {session.startHour} - {session.endHour}</span>
                        </div>
                        {session.branchID && (
                            <div className="flex items-center mb-2">
                                <FaTag className="mr-2 text-yellow-500" />
                                <span className="text-gray-700">Chi nhánh: {session.branchID}</span>
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex space-x-2">
                    <button
                        onClick={() => onEdit(session._id)}
                        className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                        <FaEdit />
                    </button>
                    <button
                        onClick={() => onDelete(session._id)}
                        className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                    >
                        <FaTrash />
                    </button>
                </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200 text-sm text-gray-500">
                <div className="flex justify-between">
                    <span>Created: {session.createdAt}</span>
                    <span>Updated: {session.updatedAt}</span>
                </div>
            </div>
        </div>
    );
};

export default SessionCard;