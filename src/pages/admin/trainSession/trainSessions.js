import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'moment/locale/vi'; // Import Vietnamese locale if needed
import { FaFilter, FaCalendarAlt, FaList } from 'react-icons/fa';
import reformDateTime from '../../../components/utils/reformDateTime';
import DeleteSessionModal from './trainSessionDelete';

// Set up the localizer for the calendar
moment.locale('vi');
const localizer = momentLocalizer(moment);

const TrainSessions = () => {
    const [sessions, setSessions] = useState([]);
    const [calendarEvents, setCalendarEvents] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [search, setSearch] = useState('');
    const [filters, setFilters] = useState({
        branchId: '',
        status: '',
        startDate: '',
        endDate: '',
        employeeID: '', // Thêm trường này để lọc theo huấn luyện viên
        userID: '' // Thêm trường này để lọc theo khách hàng
    });
    const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedSessionId, setSelectedSessionId] = useState(null);
    const [viewMode, setViewMode] = useState('calendar'); // 'calendar' or 'list'
    const [branches, setBranches] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const URL_API = process.env.REACT_APP_API_URL;

    // Status options for filter
    const statusOptions = ['scheduled', 'completed', 'cancelled'];

    // Get status color for calendar events
    const getStatusColor = (status) => {
        switch (status) {
            case 'scheduled':
                return '#4CAF50'; // Green
            case 'completed':
                return '#2196F3'; // Blue
            case 'cancelled':
                return '#F44336'; // Red
            default:
                return '#9E9E9E'; // Grey
        }
    };

    // Helper function to combine date and time
    const combineDateAndTime = (dateStr, timeStr) => {
        const date = new Date(dateStr);
        const [hours, minutes] = timeStr.split(':').map(Number);

        date.setHours(hours);
        date.setMinutes(minutes);
        return date;
    };

    // Format session display date
    const formatSessionDate = (dateStr, startTime) => {
        const date = new Date(dateStr);
        return `${moment(date).format('DD/MM/YYYY')} ${startTime}`;
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

    useEffect(() => {
        const fetchData = async () => {
            setIsLoading(true);
            try {
                // Xử lý các tham số tùy thuộc vào chế độ xem
                const cleanedFilters = cleanFilters(filters);

                // Xác định params dựa trên chế độ xem
                const params = {
                    ...(viewMode === 'list' ? { page: currentPage, limit: 10 } : { limit: 1000 }),
                    ...(search ? { search } : {}),
                    ...cleanedFilters
                };

                const response = await axios.get(`${URL_API}trainingSession/all`, {
                    params,
                    withCredentials: true
                });

                if (response.data.status === 'success') {
                    const formattedSessions = response.data.data.trainingSessions.map(session => ({
                        ...session,
                        displayDate: formatSessionDate(session.date, session.startHour),
                        createdAt: reformDateTime(session.createdAt),
                        updatedAt: reformDateTime(session.updatedAt)
                    }));

                    setSessions(formattedSessions);

                    // Convert sessions to calendar events
                    const events = formattedSessions.map(session => {
                        const start = combineDateAndTime(session.date, session.startHour);
                        const end = combineDateAndTime(session.date, session.endHour);

                        return {
                            id: session._id,
                            title: `${session.userID} - ${session.employeeID}`,
                            start,
                            end,
                            resource: session,
                            backgroundColor: getStatusColor(session.status),
                            borderColor: getStatusColor(session.status)
                        };
                    });

                    setCalendarEvents(events);
                    setTotalPages(response.data.metadata?.totalPages || 1);
                } else {
                    console.error('API response error:', response.data.message);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [currentPage, search, filters, viewMode, URL_API]);

    const handleEdit = (id) => {
        navigate(`/admin/trainingSessions/${id}`);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${URL_API}trainingSessions/delete/${id}`, {
                withCredentials: true
            });
            setSessions(sessions.filter(session => session._id !== id));
            setCalendarEvents(calendarEvents.filter(event => event.id !== id));
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

    const changeViewMode = (mode) => {
        setViewMode(mode);
        // Reset search và currentPage khi chuyển mode
        setCurrentPage(1);
        if (mode === 'calendar') {
            // Khi chuyển sang chế độ lịch, không cần giữ search
            setSearch('');
        }
    }

    const applyFilters = () => {
        // Kiểm tra nếu cả hai ngày đều được điền hoặc cả hai đều trống
        if ((filters.startDate && !filters.endDate) || (!filters.startDate && filters.endDate)) {
            alert('Vui lòng nhập đủ cả ngày bắt đầu và kết thúc');
            return;
        }

        setCurrentPage(1);
        setIsFilterModalOpen(false);
    };

    const clearFilters = () => {
        setFilters({
            branchId: '',
            status: '',
            startDate: '',
            endDate: '',
            employeeID: '',
            userID: ''
        });
        setCurrentPage(1);
        setIsFilterModalOpen(false);
    };

    const handleSelectEvent = (event) => {
        // Navigate to edit page when clicking on a calendar event
        handleEdit(event.id);
    };

    const eventStyleGetter = (event) => {
        const status = event.resource.status;
        return {
            style: {
                backgroundColor: getStatusColor(status),
                borderRadius: '5px',
                opacity: 0.8,
                color: 'white',
                border: '0px',
                display: 'block'
            }
        };
    };

    // Calendar toolbar customization
    const CustomToolbar = ({ label, onNavigate, onView }) => (
        <div className="rbc-toolbar">
            <span className="rbc-btn-group">
                <button onClick={() => onNavigate('PREV')}>Trước</button>
                <button onClick={() => onNavigate('TODAY')}>Hôm nay</button>
                <button onClick={() => onNavigate('NEXT')}>Sau</button>
            </span>
            <span className="rbc-toolbar-label">{label}</span>
            <span className="rbc-btn-group">
                <button onClick={() => onView('month')}>Tháng</button>
                <button onClick={() => onView('week')}>Tuần</button>
                <button onClick={() => onView('day')}>Ngày</button>
                <button onClick={() => onView('agenda')}>Lịch biểu</button>
            </span>
        </div>
    );

    // Hiển thị pagination nếu đang ở chế độ xem danh sách
    const renderPagination = () => {
        if (viewMode !== 'list' || totalPages <= 1) return null;

        return (
            <div className="flex justify-center mt-4">
                <div className="flex space-x-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-3 py-1 rounded ${currentPage === page
                                ? 'bg-primary text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            {page}
                        </button>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="mt-4">
            <div className="flex justify-between items-center mb-4">
                <h1 className="text-2xl font-bold">Tất Cả Phiên Tập Luyện</h1>

                <div className="flex items-center space-x-2">
                    {/* Hiển thị search và filter chỉ khi ở chế độ danh sách */}
                    {viewMode === 'list' && (
                        <>
                            <input
                                type="text"
                                placeholder="Tìm kiếm theo ID, User ID..."
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
                        </>
                    )}

                    {/* Toggle giữa chế độ lịch và danh sách */}
                    <div className="flex border rounded overflow-hidden">
                        <button
                            className={`px-4 py-2 flex items-center ${viewMode === 'calendar' ? 'bg-primary text-white' : 'bg-white text-gray-700'}`}
                            onClick={() => changeViewMode('calendar')}
                        >
                            <FaCalendarAlt className="mr-2" /> Lịch
                        </button>
                        <button
                            className={`px-4 py-2 flex items-center ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-white text-gray-700'}`}
                            onClick={() => changeViewMode('list')}
                        >
                            <FaList className="mr-2" /> Danh sách
                        </button>
                    </div>

                    <button
                        className="bg-primary text-white px-4 py-2 rounded hover:bg-secondary transition-all"
                        onClick={() => navigate('/admin/trainingSessions/create')}
                    >
                        Thêm Phiên Tập
                    </button>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
            ) : viewMode === 'calendar' ? (
                <div style={{ height: '700px' }} className="mb-4 bg-white p-4 rounded shadow">
                    <Calendar
                        localizer={localizer}
                        events={calendarEvents}
                        startAccessor="start"
                        endAccessor="end"
                        style={{ height: '100%' }}
                        onSelectEvent={handleSelectEvent}
                        eventPropGetter={eventStyleGetter}
                        components={{
                            toolbar: CustomToolbar
                        }}
                        formats={{
                            dayHeaderFormat: (date) => moment(date).format('dddd DD/MM'),
                            dayFormat: (date) => moment(date).format('DD/MM'),
                            dayRangeHeaderFormat: ({ start, end }) =>
                                `${moment(start).format('DD/MM')} - ${moment(end).format('DD/MM')}`
                        }}
                        messages={{
                            next: "Sau",
                            previous: "Trước",
                            today: "Hôm nay",
                            month: "Tháng",
                            week: "Tuần",
                            day: "Ngày",
                            agenda: "Lịch biểu",
                            date: "Ngày",
                            time: "Thời gian",
                            event: "Sự kiện",
                            allDay: "Cả ngày",
                            noEventsInRange: "Không có phiên tập nào trong khoảng thời gian này"
                        }}
                    />
                </div>
            ) : (
                <div className="space-y-4">
                    {sessions.length > 0 ? (
                        sessions.map(session => (
                            <div
                                key={session._id}
                                className="border rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow bg-white"
                            >
                                <div className="flex justify-between items-start">
                                    <div>
                                        <h3 className="text-xl font-semibold">ID Phiên: {session._id}</h3>
                                        <p className="text-gray-600">Khách hàng: {session.userID || 'N/A'}</p>
                                        <p className="text-gray-600">Huấn luyện viên: {session.employeeID || 'N/A'}</p>
                                        <p className="text-gray-600">Thời gian: {session.displayDate}</p>
                                        <p className="text-gray-600">Thứ: {session.dayOfWeek}</p>
                                        <p className="text-gray-600">Giờ: {session.startHour} - {session.endHour}</p>
                                        <div className="mt-2">
                                            <span
                                                className={`inline-block px-2 py-1 rounded text-xs font-medium ${session.status === 'scheduled' ? 'bg-green-100 text-green-800' :
                                                    session.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-red-100 text-red-800'
                                                    }`}
                                            >
                                                {session.status === 'scheduled' ? 'Đã lên lịch' :
                                                    session.status === 'completed' ? 'Đã hoàn thành' : 'Đã hủy'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                                            onClick={() => handleEdit(session._id)}
                                        >
                                            Sửa
                                        </button>
                                        <button
                                            className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                                            onClick={() => openDeleteModal(session._id)}
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center py-8 text-gray-500 bg-white rounded shadow">
                            Không tìm thấy phiên tập luyện nào
                        </div>
                    )}

                    {renderPagination()}
                </div>
            )}

            <DeleteSessionModal
                isOpen={isDeleteModalOpen}
                onClose={closeDeleteModal}
                onDelete={handleDelete}
                sessionId={selectedSessionId}
            />

            {isFilterModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded shadow-lg w-96">
                        <h2 className="text-xl font-bold mb-4">Lọc Phiên Tập</h2>

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

export default TrainSessions;