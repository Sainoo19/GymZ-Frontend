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
        branchId: '',
        memberID: '',
        paymentMethod: '',
        startDate: '',
        endDate: '',
        minAmount: '',
        maxAmount: '',
        status: ''
    });
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedBillId, setSelectedBillId] = useState(null);
    const [branches, setBranches] = useState([]);
    const navigate = useNavigate();
    const URL_API = process.env.REACT_APP_API_URL;

    // Thêm state cho modal chỉnh sửa
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentBill, setCurrentBill] = useState(null);
    const [updatedBill, setUpdatedBill] = useState({
        memberID: '',
        amount: '',
        paymentDate: '',
        paymentMethod: 'CASH',
        description: ''
    });
    const [members, setMembers] = useState([]);
    const [loadingMembers, setLoadingMembers] = useState(false);

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

    // Hàm để loại bỏ các tham số rỗng
    const cleanFilters = (filters) => {
        return Object.fromEntries(
            Object.entries(filters).filter(([_, value]) => value !== '')
        );
    };

    // Fetch branch data for dropdowns
    useEffect(() => {
        const fetchBranches = async () => {
            try {
                const response = await axios.get(`${URL_API}branches/all/nopagination`);
                if (response.data.status === 'success') {
                    setBranches(response.data.data);
                }
            } catch (error) {
                console.error("Error fetching branches:", error);
            }
        };

        fetchBranches();
    }, [URL_API]);

    // Fetch members for edit modal
    useEffect(() => {
        if (isEditModalOpen) {
            const fetchMembers = async () => {
                setLoadingMembers(true);
                try {
                    const response = await axios.get(`${URL_API}members/all/nopagination`);
                    if (response.data.status === 'success') {
                        setMembers(response.data.data.members);
                    }
                } catch (error) {
                    console.error("Error fetching members:", error);
                } finally {
                    setLoadingMembers(false);
                }
            };

            fetchMembers();
        }
    }, [isEditModalOpen, URL_API]);

    // Main data fetch effect
    useEffect(() => {
        const fetchData = async () => {
            try {
                // Clean filters before sending
                const cleanedFilters = cleanFilters(filters);

                const response = await axios.get(`${URL_API}membersBill/all`, {
                    params: {
                        page: currentPage,
                        limit: 10,
                        search,
                        ...cleanedFilters
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
    }, [currentPage, search, filters, URL_API]);

    const handleEdit = (id) => {
        const bill = data.find(b => b._id === id);
        if (bill) {
            setCurrentBill(bill);
            // Format date for date input
            const formattedPaymentDate = bill.paymentDate
                ? new Date(bill.paymentDate).toISOString().split('T')[0]
                : '';

            setUpdatedBill({
                memberID: bill.memberID || '',
                amount: bill.amount || '',
                paymentDate: formattedPaymentDate,
                paymentMethod: bill.paymentMethod || 'CASH',
                description: bill.description || ''
            });
            setIsEditModalOpen(true);
        }
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedBill(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleUpdateBill = async () => {
        try {
            // Validate amount
            if (updatedBill.amount <= 0) {
                alert('Số tiền phải lớn hơn 0');
                return;
            }

            // Format data for API
            const billToUpdate = {
                ...updatedBill,
                amount: Number(updatedBill.amount)
            };

            // If payment date is empty and payment method is set, set default payment date
            if (!billToUpdate.paymentDate && billToUpdate.paymentMethod) {
                billToUpdate.paymentDate = new Date().toISOString().split('T')[0];
            }

            // If payment method is empty, set payment date to null
            if (!billToUpdate.paymentMethod) {
                billToUpdate.paymentDate = null;
            }

            const response = await axios.put(
                `${URL_API}membersBill/update/${currentBill._id}`,
                billToUpdate,
                { withCredentials: true }
            );

            if (response.data.status === 'success') {
                // Update the bill in the local state
                const updatedBillData = response.data.data;
                setData(prevData =>
                    prevData.map(bill =>
                        bill._id === currentBill._id
                            ? {
                                ...bill,
                                ...updatedBillData,
                                formattedAmount: formatCurrency(updatedBillData.amount),
                                formattedPaymentDate: updatedBillData.paymentDate ? reformDateTime(updatedBillData.paymentDate) : null,
                                formattedPaymentMethod: updatedBillData.paymentMethod ? paymentMethodLabels[updatedBillData.paymentMethod] : null,
                                status: updatedBillData.paymentDate ? 'Đã thanh toán' : 'Chưa thanh toán',
                                statusColor: updatedBillData.paymentDate ? 'text-green-600' : 'text-yellow-600'
                            }
                            : bill
                    )
                );

                setIsEditModalOpen(false);
                alert('Cập nhật hóa đơn thành công!');
            } else {
                alert('Lỗi khi cập nhật hóa đơn: ' + response.data.message);
            }
        } catch (error) {
            console.error('Error updating bill:', error);
            alert('Có lỗi xảy ra khi cập nhật hóa đơn!');
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${URL_API}membersBill/delete/${id}`, {
                withCredentials: true
            });
            setData(data.filter(bill => bill._id !== id));
            setIsDeleteModalOpen(false);
            alert('Xóa hóa đơn thành công!');
        } catch (error) {
            console.error('Error deleting bill:', error);
            alert('Có lỗi xảy ra khi xóa hóa đơn!');
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

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setCurrentBill(null);
        setUpdatedBill({
            memberID: '',
            amount: '',
            paymentDate: '',
            paymentMethod: 'CASH',
            description: ''
        });
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setCurrentPage(1); // Reset về trang 1 khi thay đổi search
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
        // Kiểm tra nếu cả hai ngày đều được điền
        if ((filters.startDate && !filters.endDate) || (!filters.startDate && filters.endDate)) {
            alert('Vui lòng nhập đủ cả ngày bắt đầu và kết thúc');
            return;
        }

        // Kiểm tra nếu minAmount > maxAmount
        if (filters.minAmount && filters.maxAmount &&
            Number(filters.minAmount) > Number(filters.maxAmount)) {
            alert('Số tiền tối thiểu không thể lớn hơn số tiền tối đa');
            return;
        }

        setCurrentPage(1);
        setIsFilterModalOpen(false);
    };

    const clearFilters = () => {
        setFilters({
            branchId: '',
            memberID: '',
            paymentMethod: '',
            startDate: '',
            endDate: '',
            minAmount: '',
            maxAmount: '',
            status: ''
        });
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

    const getMemberName = (memberId) => {
        const member = members.find(m => m._id === memberId);
        if (member && member.user) {
            return member.user.name || "Không tìm thấy tên";
        }
        return "Không tìm thấy thành viên";
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

            {/* Modal Chỉnh Sửa */}
            {isEditModalOpen && currentBill && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-auto">
                    <div className="bg-white p-6 rounded shadow-lg w-full max-w-lg max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Chỉnh Sửa Hóa Đơn</h2>
                            <button
                                onClick={closeEditModal}
                                className="text-gray-500 hover:text-gray-700 text-2xl"
                            >
                                &times;
                            </button>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Mã Hóa Đơn
                            </label>
                            <input
                                type="text"
                                value={currentBill._id}
                                disabled
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-gray-100"
                            />
                        </div>

                        {/* Thành viên - chỉ hiển thị, không chỉnh sửa */}
                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Thành Viên
                            </label>
                            <div className="border rounded p-3 bg-gray-50">
                                <div className="flex flex-col space-y-1">
                                    <span className="text-sm font-medium">ID Thành viên:
                                        <span className="ml-1 font-normal text-blue-600">{currentBill.memberID}</span>
                                    </span>
                                    {currentBill.member && (
                                        <span className="text-sm font-medium">Loại thành viên:
                                            <span className="ml-1 font-normal">{currentBill.member.type || 'Không xác định'}</span>
                                        </span>
                                    )}
                                    {currentBill.user && (
                                        <>
                                            <span className="text-sm font-medium">Họ tên:
                                                <span className="ml-1 font-normal">{currentBill.user.name || 'Chưa cập nhật'}</span>
                                            </span>
                                            <span className="text-sm font-medium">Email:
                                                <span className="ml-1 font-normal">{currentBill.user.email || 'Chưa cập nhật'}</span>
                                            </span>
                                            <span className="text-sm font-medium">SĐT:
                                                <span className="ml-1 font-normal">{currentBill.user.phone || 'Chưa cập nhật'}</span>
                                            </span>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Số Tiền
                            </label>
                            <div className="flex items-center">
                                <input
                                    type="number"
                                    name="amount"
                                    value={updatedBill.amount}
                                    onChange={handleEditInputChange}
                                    min="0"
                                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    placeholder="Nhập số tiền"
                                />
                                <span className="ml-2 text-gray-600">VND</span>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Trạng Thái Thanh Toán
                            </label>
                            <div className="flex items-center space-x-4 mb-2">
                                <input
                                    type="radio"
                                    id="paid"
                                    name="paymentStatus"
                                    checked={!!updatedBill.paymentDate}
                                    onChange={() => setUpdatedBill(prev => ({
                                        ...prev,
                                        paymentDate: new Date().toISOString().split('T')[0],
                                        paymentMethod: prev.paymentMethod || 'CASH'
                                    }))}
                                />
                                <label htmlFor="paid" className="text-gray-700">Đã thanh toán</label>

                                <input
                                    type="radio"
                                    id="unpaid"
                                    name="paymentStatus"
                                    checked={!updatedBill.paymentDate}
                                    onChange={() => setUpdatedBill(prev => ({
                                        ...prev,
                                        paymentDate: '',
                                        paymentMethod: ''
                                    }))}
                                />
                                <label htmlFor="unpaid" className="text-gray-700">Chưa thanh toán</label>
                            </div>
                        </div>

                        {updatedBill.paymentDate && (
                            <>
                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Ngày Thanh Toán
                                    </label>
                                    <input
                                        type="date"
                                        name="paymentDate"
                                        value={updatedBill.paymentDate}
                                        onChange={handleEditInputChange}
                                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    />
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-700 text-sm font-bold mb-2">
                                        Phương Thức Thanh Toán
                                    </label>
                                    <select
                                        name="paymentMethod"
                                        value={updatedBill.paymentMethod}
                                        onChange={handleEditInputChange}
                                        className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                    >
                                        <option value="CASH">Tiền mặt</option>
                                        <option value="CREDIT_CARD">Thẻ tín dụng</option>
                                        <option value="BANK_TRANSFER">Chuyển khoản</option>
                                        <option value="MOBILE_PAYMENT">Thanh toán di động</option>
                                    </select>
                                </div>
                            </>
                        )}

                        <div className="mb-4">
                            <label className="block text-gray-700 text-sm font-bold mb-2">
                                Mô Tả
                            </label>
                            <textarea
                                name="description"
                                value={updatedBill.description}
                                onChange={handleEditInputChange}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                rows="3"
                                placeholder="Nhập mô tả"
                            ></textarea>
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={closeEditModal}
                                className="px-4 py-2 bg-gray-200 text-gray-800 font-bold rounded hover:bg-gray-300"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleUpdateBill}
                                className="px-4 py-2 bg-primary text-white font-bold rounded hover:bg-secondary"
                            >
                                Lưu Thay Đổi
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isFilterModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-96">
                        <h2 className="text-xl font-bold mb-4">Lọc Hóa Đơn</h2>

                        <div className="mb-4">
                            <label className="block mb-2">Chi Nhánh</label>
                            <select
                                name="branchId"
                                value={filters.branchId}
                                onChange={handleFilterChange}
                                className="w-full px-4 py-2 border rounded"
                            >
                                <option value="">Tất cả chi nhánh</option>
                                {branches.map((branch) => (
                                    <option key={branch._id} value={branch._id}>
                                        {branch.name} ({branch._id})
                                    </option>
                                ))}
                            </select>
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
                                <option value="paid">Đã thanh toán</option>
                                <option value="unpaid">Chưa thanh toán</option>
                            </select>
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
                                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                onClick={clearFilters}
                            >
                                Xóa bộ lọc
                            </button>
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