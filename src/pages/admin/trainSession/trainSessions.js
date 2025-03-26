import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Pagination from '../../../components/admin/layout/Pagination';
import { FaFilter } from 'react-icons/fa';
import reformDateTime from '../../../components/utils/reformDateTime';
import DeleteSessionModal from './trainSessionDelete';
import SessionCard from '../../../components/admin/trainSession/SessionCard';

const TrainSessions = () => {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState({
        branchId: '',
        status: '',
        startDate: '',
        endDate: ''
    });
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedSessionId, setSelectedSessionId] = useState(null);
    const navigate = useNavigate();

    // Status options for filter
    const statusOptions = ['scheduled', 'completed', 'cancelled'];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3000/trainingSession/all', {
                    params: {
                        page: currentPage,
                        limit: 10,
                        search,
                        ...filters
                    },
                    withCredentials: true
                });

                if (response.data.status === 'success') {
                    const sessions = response.data.data.trainingSessions.map(session => ({
                        ...session,
                        sessionDate: reformDateTime(session.sessionDate),
                        createdAt: reformDateTime(session.createdAt),
                        updatedAt: reformDateTime(session.updatedAt)
                    }));
                    setData(sessions);
                    setTotalPages(response.data.metadata.totalPages || 1);
                } else {
                    console.error('API response error:', response.data.message);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [currentPage, search, filters]);

    const handleEdit = (id) => {
        navigate(`/admin/trainingSessions/${id}`);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:3000/trainingSessions/delete/${id}`, {
                withCredentials: true
            });
            setData(data.filter(session => session._id !== id));
            setIsDeleteModalOpen(false);
        } catch (error) {
            console.error('Error deleting training session:', error);
        }
    };

    const openDeleteModal = (id) => {
        setSelectedSessionId(id);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setSelectedSessionId(null);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
    };

    const handleFilterChange = (e) => {
        setFilters({
            ...filters,
            [e.target.name]: e.target.value
        });
    };

    const toggleFilterModal = () => {
        setIsFilterModalOpen(!isFilterModalOpen);
    };

    const applyFilters = () => {
        setCurrentPage(1);
        setIsFilterModalOpen(false);
    };

    return (
        <div className="mt-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Tất Cả Phiên Tập Luyện</h1>
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo ID, User ID hoặc tiêu đề..."
                        value={search}
                        onChange={handleSearchChange}
                        className="px-4 py-2 border rounded"
                    />
                    <button
                        className="bg-primary text-white px-4 py-2 rounded hover:bg-secondary transition-all flex items-center"
                        onClick={toggleFilterModal}
                    >
                        <FaFilter className="mr-2" /> Lọc
                    </button>
                    <button
                        className="bg-primary text-white px-4 py-2 rounded hover:bg-secondary transition-all"
                        onClick={() => navigate('/admin/trainingSessions/create')}
                    >
                        Thêm Phiên Tập
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                {data.length > 0 ? (
                    data.map(session => (
                        <SessionCard
                            key={session._id}
                            session={session}
                            onEdit={handleEdit}
                            onDelete={openDeleteModal}
                        />
                    ))
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        Không tìm thấy phiên tập luyện nào
                    </div>
                )}
            </div>

            <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />

            <DeleteSessionModal
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                onDelete={handleDelete}
                sessionId={selectedSessionId}
            />

            {isFilterModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded shadow-lg">
                        <h2 className="text-xl font-bold mb-4">Lọc Phiên Tập</h2>

                        <div className="mb-4">
                            <label className="block mb-2">Chi Nhánh</label>
                            <input
                                type="text"
                                name="branchId"
                                value={filters.branchId}
                                onChange={handleFilterChange}
                                className="w-full px-4 py-2 border rounded"
                                placeholder="Nhập ID chi nhánh"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block mb-2">Trạng Thái</label>
                            <select
                                name="status"
                                value={filters.status}
                                onChange={handleFilterChange}
                                className="w-full px-4 py-2 border rounded"
                            >
                                <option value="">Tất cả</option>
                                {statusOptions.map(status => (
                                    <option key={status} value={status}>
                                        {status === 'scheduled' ? 'Đã lên lịch' :
                                            status === 'completed' ? 'Đã hoàn thành' : 'Đã hủy'}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="mb-4">
                            <label className="block mb-2">Từ ngày</label>
                            <input
                                type="date"
                                name="startDate"
                                value={filters.startDate}
                                onChange={handleFilterChange}
                                className="w-full px-4 py-2 border rounded"
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block mb-2">Đến ngày</label>
                            <input
                                type="date"
                                name="endDate"
                                value={filters.endDate}
                                onChange={handleFilterChange}
                                className="w-full px-4 py-2 border rounded"
                            />
                        </div>

                        <div className="flex justify-end space-x-2">
                            <button
                                className="bg-gray-200 px-4 py-2 rounded hover:bg-gray-300"
                                onClick={toggleFilterModal}
                            >
                                Hủy
                            </button>
                            <button
                                className="bg-primary text-white px-4 py-2 rounded hover:bg-secondary transition-all"
                                onClick={applyFilters}
                            >
                                Áp Dụng
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TrainSessions;