import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Pagination from '../../../components/admin/layout/Pagination';
import { FaFilter } from 'react-icons/fa';
import reformDateTime from '../../../components/utils/reformDateTime';
import DeleteBillModal from './DeleteBillModal';
import BillCard from '../../../components/admin/memberBill/BillCard';

const MemberBills = () => {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState({
        memberID: '',
        paymentMethod: '',
        startDate: '',
        endDate: '',
        minAmount: '',
        maxAmount: '',
    });
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedBillId, setSelectedBillId] = useState(null);
    const navigate = useNavigate();
    const URL_API = process.env.REACT_APP_API_URL;

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    // Payment method display mapper
    const paymentMethodLabels = {
        'CASH': 'Tiền mặt',
        'CREDIT_CARD': 'Thẻ tín dụng',
        'BANK_TRANSFER': 'Chuyển khoản',
        'MOBILE_PAYMENT': 'Thanh toán di động'
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${URL_API}membersBill/all`, {
                    params: {
                        page: currentPage,
                        limit: 10,
                        search,
                        ...filters
                    },
                    withCredentials: true
                });

                if (response.data.status === 'success') {
                    const bills = response.data.data.bills.map(bill => ({
                        ...bill,
                        formattedAmount: formatCurrency(bill.amount),
                        formattedPaymentDate: bill.paymentDate ? reformDateTime(bill.paymentDate) : null,
                        formattedPaymentMethod: bill.paymentMethod ? paymentMethodLabels[bill.paymentMethod] : null,
                        status: bill.paymentDate ? 'Đã thanh toán' : 'Chưa thanh toán',
                        statusColor: bill.paymentDate ? 'text-green-600' : 'text-yellow-600',
                        formattedCreatedAt: reformDateTime(bill.createdAt)
                    }));
                    setData(bills);
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
        navigate(`/admin/member-bills/${id}`);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${URL_API}admin/member-bills/${id}`, {
                withCredentials: true
            });
            setData(data.filter(bill => bill._id !== id));
            setIsDeleteModalOpen(false);
        } catch (error) {
            console.error('Error deleting bill:', error);
        }
    };

    const openDeleteModal = (id) => {
        setSelectedBillId(id);
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
        setSelectedBillId(null);
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

    const handlePaymentSuccess = (billId, updatedBill) => {
        // Update the bill in the data array with the updated values
        setData(data.map(bill =>
            bill._id === billId ? {
                ...bill,
                paymentDate: updatedBill.paymentDate,
                paymentMethod: updatedBill.paymentMethod,
                formattedPaymentDate: reformDateTime(updatedBill.paymentDate),
                formattedPaymentMethod: paymentMethodLabels[updatedBill.paymentMethod],
                status: 'Đã thanh toán',
                statusColor: 'text-green-600'
            } : bill
        ));
    };

    return (
        <div className="mt-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Hóa Đơn Hội Viên</h1>
                <div className="flex items-center space-x-2">
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo ID hoặc Member ID..."
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
                        onClick={() => navigate('/admin/member-bills/create')}
                    >
                        Thêm Hóa Đơn
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                {data.length > 0 ? (
                    data.map(bill => (
                        <BillCard
                            key={bill._id}
                            bill={bill}
                            onEdit={handleEdit}
                            onDelete={openDeleteModal}
                            onPaymentSuccess={handlePaymentSuccess}
                        />
                    ))
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        Không tìm thấy hóa đơn nào
                    </div>
                )}
            </div>

            <Pagination totalPages={totalPages} currentPage={currentPage} onPageChange={handlePageChange} />

            <DeleteBillModal
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                onDelete={handleDelete}
                billId={selectedBillId}
            />

            {isFilterModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-96">
                        <h2 className="text-xl font-bold mb-4">Lọc Hóa Đơn</h2>
                        <div className="mb-4">
                            <label className="block mb-2">ID Hội Viên</label>
                            <input
                                type="text"
                                name="memberID"
                                value={filters.memberID}
                                onChange={handleFilterChange}
                                className="w-full px-4 py-2 border rounded"
                                placeholder="Nhập ID hội viên"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">Phương Thức Thanh Toán</label>
                            <select
                                name="paymentMethod"
                                value={filters.paymentMethod}
                                onChange={handleFilterChange}
                                className="w-full px-4 py-2 border rounded"
                            >
                                <option value="">Tất cả</option>
                                <option value="CASH">Tiền mặt</option>
                                <option value="CREDIT_CARD">Thẻ tín dụng</option>
                                <option value="BANK_TRANSFER">Chuyển khoản</option>
                                <option value="MOBILE_PAYMENT">Thanh toán di động</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">Từ Ngày</label>
                            <input
                                type="date"
                                name="startDate"
                                value={filters.startDate}
                                onChange={handleFilterChange}
                                className="w-full px-4 py-2 border rounded"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">Đến Ngày</label>
                            <input
                                type="date"
                                name="endDate"
                                value={filters.endDate}
                                onChange={handleFilterChange}
                                className="w-full px-4 py-2 border rounded"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">Số Tiền Tối Thiểu</label>
                            <input
                                type="number"
                                name="minAmount"
                                value={filters.minAmount}
                                onChange={handleFilterChange}
                                className="w-full px-4 py-2 border rounded"
                                placeholder="VND"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block mb-2">Số Tiền Tối Đa</label>
                            <input
                                type="number"
                                name="maxAmount"
                                value={filters.maxAmount}
                                onChange={handleFilterChange}
                                className="w-full px-4 py-2 border rounded"
                                placeholder="VND"
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

export default MemberBills;