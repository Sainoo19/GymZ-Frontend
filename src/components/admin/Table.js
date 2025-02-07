import React from 'react';

const Table = ({ columns, data, onEdit, onDelete }) => {
    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
                <thead>
                    <tr>
                        {columns.map((column) => (
                            <th key={column.field} className="py-2 px-4 border-b bg-black text-white">
                                {column.label}
                            </th>
                        ))}
                        <th className="py-2 px-4 border-b bg-black text-white">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item) => (
                        <tr key={item._id}>
                            {columns.map((column) => (
                                <td key={column.field} className="py-3 px-6 border-b">
                                    {item[column.field]}
                                </td>
                            ))}
                            <td className="py-3 px-6 border-b text-center">
                                <div className="flex items-center justify-center space-x-2">
                                    <i
                                        className="fas fa-edit text-yellow-500 text-lg cursor-pointer hover:text-yellow-700 transition-all"
                                        title="Sửa"
                                        onClick={() => onEdit(item._id)}
                                    ></i>
                                    <i
                                        className="fas fa-trash text-red-500 text-lg cursor-pointer hover:text-red-700 transition-all"
                                        title="Xóa"
                                        onClick={() => onDelete(item._id)}
                                    ></i>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Table;