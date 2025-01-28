import React, { useState } from "react";

const Table = ({ columns, data }) => {
    const [selected, setSelected] = useState([]);

    const handleSelectAll = () => {
        if (selected.length === data.length) {
            setSelected([]);
        } else {
            setSelected(data.map((item) => item.id));
        }
    };

    const handleSelect = (id) => {
        setSelected((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    return (
        <div className="container mx-auto p-6">
            <div className="overflow-hidden rounded-lg shadow-lg">
                <table className="min-w-full bg-white">
                    {/* Header */}
                    <thead className="bg-primary text-white">
                        <tr>
                            <th className="py-3 px-6 text-left">
                                <input
                                    type="checkbox"
                                    checked={selected.length === data.length}
                                    onChange={handleSelectAll}
                                    className="cursor-pointer"
                                />
                            </th>
                            {columns.map((column) => (
                                <th key={column.field} className="py-3 px-6 text-left text-sm font-medium uppercase">
                                    {column.label}
                                </th>
                            ))}
                            <th className="py-3 px-6 text-center text-sm font-medium uppercase">HÀNH ĐỘNG</th>
                        </tr>
                    </thead>

                    {/* Body */}
                    <tbody>
                        {data.map((item) => (
                            <tr
                                key={item.id}
                                className="transition-all duration-200 hover:bg-blue-50 hover:shadow-sm"
                            >
                                <td className="py-3 px-6 border-b">
                                    <input
                                        type="checkbox"
                                        checked={selected.includes(item.id)}
                                        onChange={() => handleSelect(item.id)}
                                        className="cursor-pointer"
                                    />
                                </td>
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
                                        ></i>
                                        <i
                                            className="fas fa-trash text-red-500 text-lg cursor-pointer hover:text-red-700 transition-all"
                                            title="Xóa"
                                        ></i>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Table;