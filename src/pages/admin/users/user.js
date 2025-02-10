import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Table from '../../../components/admin/Table';
import { useNavigate } from 'react-router-dom';
import Swal from "sweetalert2";
import { Warning } from 'postcss';
import { Search } from 'lucide-react';
import Pagination from '../../../components/admin/layout/Pagination';

const User = () => {
    const [columns] = useState ([
        { field: '_id', label: 'USER ID' },
        { field: 'name', label: 'NAME' },
        { field: 'address', label: 'ADDRESS'},
        { field: 'createdAt', label: 'CREATED AT' },
        { field: 'updatedAt', label: 'UPDATED AT' },
        { field: 'status', label: 'STATUS' },
    ]);

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('http://localhost:3000/users/all', {
                    params: {
                        page: currentPage,
                        limit: 3,
                        search,
                    }
                });
                if (response.data.status === 'success') {
                    setUsers(response.data.data.users);
                    setTotalPages(response.data.metadata.totalPages);
                } else{
                    console.error('API response error:', response.data.message);
                }
            } catch (error) {
                setError('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, [currentPage, search]);

    const handleEdit = (id) => {
        console.log("Navigating to:", `/users/${id}`);
        navigate(`/users/${id}`);
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    }

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
                try{
                    const response = await axios.delete(`http://localhost:3000/users/delete/${id}`);
        
                    if(response.status === 200) {
                        Swal.fire('Xóa thành công!', 'Người dùng đã bị xóa.', 'success');
                        setUsers(prevUsers => prevUsers.filter(user => user._id !== id));
                    } else {
                        Swal.fire('Xóa không thành công!', 'Vui lòng thử lại sau.', 'errorerror');
                    }
                } catch (error) {
                    console.error('Lỗi khi xóa khách hàng:', error)
                    Swal.fire('Lỗi!', 'Có lỗi xảy ra khi xóa.', 'error');
                }
            }
        })
    };

    return (
        <div className="mt-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Tất cả khách hàng</h1>
                <button 
                    onClick = {() => navigate('/users/create')}
                    className="bg-primary text-white px-4 py-2 rounded hover:bg-secondary transition-all"
                >
                    Thêm khách hàng
                </button>
            </div>

            {/* Hiển thị trạng thái loading hoặc lỗi */}
            {loading ? (
                <p>Đang tải dữ liệu...</p>
                ) : error ? (
                    <p className="text-red-500">Lỗi: {error}</p>
                ) : (
                    <Table columns={columns} 
                    data={users.map(user => ({
                        ...user,
                        address: user.address
                            ? `${user.address.street}, ${user.address.city}, ${user.address.country}`
                            : 'N/A'
                    }))}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    />
                )
            }
            <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />
        </div>
    );
};

export default User;