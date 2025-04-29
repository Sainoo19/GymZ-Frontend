import React from 'react';

const Table = ({ columns, data, onEdit, onDelete }) => {
    return (
        <div className="overflow-x-auto rounded-lg shadow-md">
            <table className="min-w-full bg-white border border-gray-200">
                <thead>
                    <tr>
                        {columns.map((column) => (
                            <th
                                key={column.field}
                                className="py-3 px-6 bg-primary text-white font-semibold text-left border-b tracking-wider uppercase text-sm"
                            >
                                {column.label}
                            </th>
                        ))}
                        <th className="py-3 px-6 bg-primary text-white font-semibold text-center border-b tracking-wider uppercase text-sm">
                            Actions
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr
                            key={item._id}
                            className={`
                                transition-all duration-300 
                                ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                                hover:bg-gray-100 hover:shadow-lg transform hover:-translate-y-1
                            `}
                        >
                            {columns.map((column) => (
                                <td
                                    key={column.field}
                                    className="py-4 px-6 border-b border-gray-200 text-gray-700"
                                >
                                    {item[column.field]}
                                </td>
                            ))}
                            <td className="py-4 px-6 border-b border-gray-200 text-center">
                                <div className="flex items-center justify-center space-x-4">
                                    {/* Edit button with blue/secondary color theme */}
                                    <button
                                        className="group relative p-2.5 rounded-full bg-blue-50 hover:bg-blue-500 hover:shadow-md transition-all duration-300"
                                        title="Sửa"
                                        onClick={() => onEdit(item._id)}
                                    >
                                        <i className="fas fa-edit text-blue-500 group-hover:text-white transition-all transform group-hover:scale-125"></i>
                                        <span className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white text-xs font-semibold rounded-md py-1.5 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-lg">
                                            Sửa
                                        </span>
                                    </button>

                                    {/* Delete button with red color theme */}
                                    <button
                                        className="group relative p-2.5 rounded-full bg-red-50 hover:bg-red-500 hover:shadow-md transition-all duration-300"
                                        title="Xóa"
                                        onClick={() => onDelete(item._id)}
                                    >
                                        <i className="fas fa-trash text-red-500 group-hover:text-white transition-all transform group-hover:scale-125"></i>
                                        <span className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-red-600 text-white text-xs font-semibold rounded-md py-1.5 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-lg">
                                            Xóa
                                        </span>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {data.length === 0 && (
                <div className="py-8 text-center text-gray-500 bg-white border-b border-gray-200">
                    Không có dữ liệu để hiển thị
                </div>
            )}
        </div>
    );
};

export default Table;