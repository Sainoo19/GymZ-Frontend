import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'moment/locale/vi'; // Import Vietnamese locale
import {
    FaCalendarAlt, FaUser, FaClock, FaFilter, FaSpinner,
    FaPlus, FaCheck, FaTimes, FaEdit, FaExclamationTriangle,
    FaListUl, FaCalendarWeek
} from 'react-icons/fa';

// Set up the localizer for the calendar
moment.locale('vi');
const localizer = momentLocalizer(moment);

const TrainScheduleContent = () => {
    const [sessions, setSessions] = useState([]);
    const [calendarEvents, setCalendarEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFilters] = useState({
        status: '',
        startDate: '',
        endDate: ''
    });
    const [showFilters, setShowFilters] = useState(false);
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'calendar'
    const URL_API = process.env.REACT_APP_API_URL;

    // Add new state for update modal
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [updateSessionData, setUpdateSessionData] = useState({
        id: '',
        date: '',
        startHour: '',
        endHour: ''
    });
    const [updateLoading, setUpdateLoading] = useState(false);
    const [updateError, setUpdateError] = useState('');

    // States for booking feature
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [bookingData, setBookingData] = useState({
        employeeID: '',
        date: '',
        startHour: '',
        endHour: ''
    });
    const [bookingLoading, setBookingLoading] = useState(false);
    const [bookingError, setBookingError] = useState('');
    const [trainers, setTrainers] = useState([]);

    // Status options
    const statusOptions = [
        { value: '', label: 'Tất cả' },
        { value: 'scheduled', label: 'Đã lên lịch' },
        { value: 'completed', label: 'Đã hoàn thành' },
        { value: 'cancelled', label: 'Đã hủy' }
    ];

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

    useEffect(() => {
        fetchTrainingSessions();
    }, [currentPage, filters, viewMode]);

    const fetchTrainingSessions = async () => {
        try {
            setLoading(true);

            // Build query params
            const params = {
                page: currentPage,
                limit: viewMode === 'calendar' ? 1000 : 10, // Get all sessions for calendar view
                ...filters
            };

            // Remove empty filters
            Object.keys(params).forEach(key =>
                params[key] === '' && delete params[key]
            );

            const response = await axios.get(`${URL_API}membership/trainingSessions`, {
                params,
                withCredentials: true
            });

            if (response.data.status === 'success') {
                // Process sessions data
                const formattedSessions = response.data.data.sessions.map(session => ({
                    ...session,
                    formattedDate: formatDate(session.date),
                    formattedTime: `${session.startHour} - ${session.endHour}`,
                    statusLabel: getStatusLabel(session.status),
                    statusClass: getStatusClass(session.status)
                }));

                setSessions(formattedSessions);
                setTotalPages(response.data.metadata.totalPages);

                // Convert sessions to calendar events
                const events = formattedSessions.map(session => {
                    const start = combineDateAndTime(session.date, session.startHour);
                    const end = combineDateAndTime(session.date, session.endHour);

                    return {
                        id: session._id,
                        title: `${session.statusLabel} - ${session.employeeID || 'HLV'}`,
                        start,
                        end,
                        resource: session,
                        backgroundColor: getStatusColor(session.status),
                        borderColor: getStatusColor(session.status)
                    };
                });

                setCalendarEvents(events);
            } else {
                setError('Không thể tải danh sách buổi tập.');
            }

            setLoading(false);
        } catch (err) {
            console.error('Error fetching training sessions:', err);
            setError('Đã xảy ra lỗi khi tải danh sách buổi tập.');
            setLoading(false);
        }
    };

    // Format date to Vietnamese format
    const formatDate = (dateString) => {
        if (!dateString) return "";
        try {
            return format(new Date(dateString), 'EEEE, dd/MM/yyyy', { locale: vi });
        } catch (error) {
            return dateString;
        }
    };

    // Get status label in Vietnamese
    const getStatusLabel = (status) => {
        switch (status) {
            case 'scheduled': return 'Đã lên lịch';
            case 'completed': return 'Đã hoàn thành';
            case 'cancelled': return 'Đã hủy';
            default: return status;
        }
    };

    // Get CSS class based on status
    const getStatusClass = (status) => {
        switch (status) {
            case 'scheduled': return 'bg-blue-100 text-blue-800';
            case 'completed': return 'bg-green-100 text-green-800';
            case 'cancelled': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // Handle page change
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    // Handle filter change
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Apply filters
    const applyFilters = () => {
        setCurrentPage(1);
        fetchTrainingSessions();
        setShowFilters(false);
    };

    // Reset filters
    const resetFilters = () => {
        setFilters({
            status: '',
            startDate: '',
            endDate: ''
        });
        setCurrentPage(1);
    };

    // Toggle filter panel
    const toggleFilters = () => {
        setShowFilters(!showFilters);
    };

    // Toggle view mode
    const toggleViewMode = (mode) => {
        setViewMode(mode);
    };

    // Calendar event style getter
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

    // Handle calendar event selection
    const handleSelectEvent = (event) => {
        const session = sessions.find(s => s._id === event.id);
        if (session && session.status === 'scheduled') {
            openUpdateModal(session);
        }
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

    // Fetch trainers for booking modal
    const fetchTrainers = async () => {
        try {
            // Get the current member profile to get the assigned trainer
            const memberResponse = await axios.get(`${URL_API}membership/profile`, {
                withCredentials: true
            });

            let trainersArray = [];

            if (memberResponse.data.status === 'success') {
                const memberData = memberResponse.data.data;

                // If member has an assigned trainer, add it to the array
                if (memberData.employeeID) {
                    // No need to fetch trainer details, just use the ID and a default name
                    trainersArray.push({
                        _id: memberData.employeeID,
                        name: 'Huấn luyện viên của bạn',
                    });

                    // Pre-select the member's assigned trainer
                    setBookingData(prev => ({
                        ...prev,
                        employeeID: memberData.employeeID
                    }));
                }
            }

            // If no trainers are available, show error
            if (trainersArray.length === 0) {
                setBookingError('Bạn cần đăng ký dịch vụ PT để có thể đặt lịch tập. Vui lòng liên hệ nhân viên tại quầy.');
                return;
            }

            // Set trainers
            setTrainers(trainersArray);

        } catch (err) {
            console.error('Error in trainer setup:', err);
            setBookingError('Không thể tải thông tin huấn luyện viên. Vui lòng liên hệ nhân viên tại quầy để đặt lịch tập.');
        }
    };

    // Handle startHour selection - automatically calculate endHour
    const handleTimeChange = (e) => {
        const { name, value } = e.target;

        if (name === 'startHour') {
            // Parse the hours and minutes
            const [hours, minutes] = value.split(':').map(Number);

            // Calculate end time (start time + 1 hour)
            let endHours = hours + 1;
            if (endHours > 23) endHours = 23; // Cap at 23:00

            const endHour = `${endHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

            // Update both startHour and endHour
            setBookingData(prev => ({
                ...prev,
                startHour: value,
                endHour: endHour
            }));
        } else {
            // For other inputs, just update normally
            setBookingData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    // Update the openBookingModal function to handle the error case
    const openBookingModal = () => {
        setBookingError('');
        setBookingData({
            employeeID: '',
            date: '',
            startHour: '',
            endHour: ''
        });
        setTrainers([]); // Clear trainers before fetching
        fetchTrainers();
        setShowBookingModal(true);
    };

    const handleBookingChange = (e) => {
        const { name, value } = e.target;

        if (name === 'startHour') {
            handleTimeChange(e);
        } else {
            setBookingData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    // Handle session booking submission
    const handleBookSession = async () => {
        try {
            setBookingLoading(true);
            setBookingError('');

            // Validate inputs
            if (!bookingData.employeeID || !bookingData.date || !bookingData.startHour || !bookingData.endHour) {
                setBookingError('Vui lòng điền đầy đủ thông tin.');
                setBookingLoading(false);
                return;
            }

            const response = await axios.post(
                `${URL_API}membership/book-session`,
                bookingData,
                { withCredentials: true }
            );

            if (response.data.status === 'success') {
                setShowBookingModal(false);
                // Refresh the sessions list
                fetchTrainingSessions();
                // Show success notification
                alert('Đăng ký lịch tập thành công!');
            } else {
                setBookingError(response.data.message || 'Không thể đặt lịch tập.');
            }

            setBookingLoading(false);
        } catch (err) {
            console.error('Error booking session:', err);
            setBookingError(err.response?.data?.message || 'Đã xảy ra lỗi khi đặt lịch tập.');
            setBookingLoading(false);
        }
    };

    // Add a function to handle opening the update modal
    const openUpdateModal = (session) => {
        // Only allow updating scheduled sessions
        if (session.status !== 'scheduled') {
            alert('Chỉ có thể cập nhật buổi tập ở trạng thái "Đã lên lịch"');
            return;
        }

        // Parse the date into YYYY-MM-DD format
        const sessionDate = new Date(session.date);
        const formattedDate = sessionDate.toISOString().split('T')[0];

        setUpdateError('');
        setUpdateSessionData({
            id: session._id,
            date: formattedDate,
            startHour: session.startHour,
            endHour: session.endHour
        });
        setShowUpdateModal(true);
    };

    // Add function to handle update form input changes
    const handleUpdateChange = (e) => {
        const { name, value } = e.target;

        if (name === 'startHour') {
            // Parse the hours and minutes
            const [hours, minutes] = value.split(':').map(Number);

            // Calculate end time (start time + 1 hour)
            let endHours = hours + 1;
            if (endHours > 23) endHours = 23; // Cap at 23:00

            const endHour = `${endHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;

            // Update both startHour and endHour
            setUpdateSessionData(prev => ({
                ...prev,
                startHour: value,
                endHour: endHour
            }));
        } else {
            setUpdateSessionData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    // Add function to handle session update submission
    const handleUpdateSession = async () => {
        try {
            setUpdateLoading(true);
            setUpdateError('');

            // Validate inputs
            if (!updateSessionData.date || !updateSessionData.startHour || !updateSessionData.endHour) {
                setUpdateError('Vui lòng điền đầy đủ thông tin.');
                setUpdateLoading(false);
                return;
            }

            const response = await axios.patch(
                `${URL_API}membership/update-session/${updateSessionData.id}`,
                {
                    date: updateSessionData.date,
                    startHour: updateSessionData.startHour,
                    endHour: updateSessionData.endHour
                },
                { withCredentials: true }
            );

            if (response.data.status === 'success') {
                setShowUpdateModal(false);
                // Refresh the sessions list
                fetchTrainingSessions();
                // Show success notification
                alert('Cập nhật lịch tập thành công!');
            } else {
                setUpdateError(response.data.message || 'Không thể cập nhật lịch tập.');
            }

            setUpdateLoading(false);
        } catch (err) {
            console.error('Error updating session:', err);
            setUpdateError(err.response?.data?.message || 'Đã xảy ra lỗi khi cập nhật lịch tập.');
            setUpdateLoading(false);
        }
    };

    // Add a function to handle cancel session
    const handleCancelSession = async (sessionId) => {
        // Confirm with the user before cancellation
        if (!window.confirm('Bạn có chắc chắn muốn hủy buổi tập này không?')) {
            return;
        }

        try {
            setLoading(true);

            const response = await axios.post(
                `${URL_API}membership/cancel-session/${sessionId}`,
                {},
                { withCredentials: true }
            );

            if (response.data.status === 'success') {
                // Refresh the sessions list
                fetchTrainingSessions();
                // Show success notification
                alert('Hủy buổi tập thành công!');
            } else {
                alert(response.data.message || 'Không thể hủy buổi tập.');
            }

            setLoading(false);
        } catch (err) {
            console.error('Error cancelling session:', err);
            alert(err.response?.data?.message || 'Đã xảy ra lỗi khi hủy buổi tập.');
            setLoading(false);
        }
    };

    return (
        <div className="flex-1 p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Lịch Tập Của Tôi</h1>
                <div className="flex space-x-2">
                    {/* Toggle view buttons */}
                    <div className="flex border rounded overflow-hidden mr-2">
                        <button
                            className={`flex items-center px-3 py-2 ${viewMode === 'list' ? 'bg-primary text-white' : 'bg-white text-gray-700'}`}
                            onClick={() => toggleViewMode('list')}
                        >
                            <FaListUl className="mr-1" /> Danh sách
                        </button>
                        <button
                            className={`flex items-center px-3 py-2 ${viewMode === 'calendar' ? 'bg-primary text-white' : 'bg-white text-gray-700'}`}
                            onClick={() => toggleViewMode('calendar')}
                        >
                            <FaCalendarWeek className="mr-1" /> Lịch
                        </button>
                    </div>

                    <button
                        onClick={toggleFilters}
                        className="flex items-center px-4 py-2 bg-primary text-white rounded hover:bg-secondary transition-colors"
                    >
                        <FaFilter className="mr-2" /> Lọc
                    </button>
                    <button
                        onClick={openBookingModal}
                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                    >
                        <FaPlus className="mr-2" /> Đăng Ký Lịch Tập
                    </button>
                </div>
            </div>

            {/* Filter panel */}
            {showFilters && (
                <div className="bg-white p-4 rounded-lg shadow-md mb-6">
                    <h2 className="font-semibold mb-3">Lọc buổi tập</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                            <select
                                name="status"
                                value={filters.status}
                                onChange={handleFilterChange}
                                className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-primary"
                            >
                                {statusOptions.map(option => (
                                    <option key={option.value} value={option.value}>{option.label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Từ ngày</label>
                            <input
                                type="date"
                                name="startDate"
                                value={filters.startDate}
                                onChange={handleFilterChange}
                                className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-primary"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Đến ngày</label>
                            <input
                                type="date"
                                name="endDate"
                                value={filters.endDate}
                                onChange={handleFilterChange}
                                className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-primary"
                            />
                        </div>
                    </div>
                    <div className="flex justify-end space-x-2 mt-4">
                        <button
                            onClick={resetFilters}
                            className="px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                        >
                            Đặt lại
                        </button>
                        <button
                            onClick={applyFilters}
                            className="px-4 py-2 bg-primary text-white rounded hover:bg-secondary transition-colors"
                        >
                            Áp dụng
                        </button>
                    </div>
                </div>
            )}

            {/* Loading state */}
            {loading ? (
                <div className="flex justify-center items-center py-12">
                    <FaSpinner className="animate-spin text-4xl text-primary" />
                </div>
            ) : error ? (
                <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
                    <p>{error}</p>
                    <button
                        onClick={() => fetchTrainingSessions()}
                        className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                    >
                        Thử lại
                    </button>
                </div>
            ) : (
                <>
                    {viewMode === 'calendar' ? (
                        // Calendar View
                        <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
                            <div style={{ height: '700px' }}>
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
                                        noEventsInRange: "Không có buổi tập nào trong khoảng thời gian này"
                                    }}
                                />
                            </div>
                            {sessions.length === 0 && (
                                <div className="mt-4 text-center text-gray-500">
                                    Bạn chưa có buổi tập nào. Hãy đăng ký lịch tập mới!
                                </div>
                            )}
                        </div>
                    ) : (
                        // List View
                        <>
                            {sessions.length > 0 ? (
                                <div className="space-y-4">
                                    {sessions.map((session) => (
                                        <div key={session._id} className="bg-white rounded-lg shadow-md p-4 border-l-4 border-primary">
                                            <div className="flex flex-col sm:flex-row justify-between">
                                                <div className="mb-2 sm:mb-0">
                                                    <h3 className="font-semibold text-lg">Buổi tập #{session._id}</h3>
                                                    <div className="text-sm text-gray-500">
                                                        {session.dayOfWeek && <span className="capitalize">{session.dayOfWeek}</span>}
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${session.statusClass}`}>
                                                        {session.statusLabel}
                                                    </span>
                                                    {session.status === 'scheduled' && (
                                                        <>
                                                            <button
                                                                onClick={() => openUpdateModal(session)}
                                                                className="bg-blue-500 hover:bg-blue-600 text-white rounded p-1"
                                                                title="Cập nhật lịch tập"
                                                            >
                                                                <FaEdit className="text-sm" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleCancelSession(session._id)}
                                                                className="bg-red-500 hover:bg-red-600 text-white rounded p-1"
                                                                title="Hủy buổi tập"
                                                            >
                                                                <FaTimes className="text-sm" />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                                                <div className="flex items-center">
                                                    <FaCalendarAlt className="text-gray-500 mr-2" />
                                                    <div>
                                                        <p className="text-sm text-gray-500">Ngày</p>
                                                        <p className="capitalize">{session.formattedDate}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center">
                                                    <FaClock className="text-gray-500 mr-2" />
                                                    <div>
                                                        <p className="text-sm text-gray-500">Thời gian</p>
                                                        <p>{session.formattedTime}</p>
                                                    </div>
                                                </div>
                                                {session.trainer && (
                                                    <div className="flex items-center">
                                                        <FaUser className="text-gray-500 mr-2" />
                                                        <div>
                                                            <p className="text-sm text-gray-500">Huấn luyện viên</p>
                                                            <p>{session.trainer.name || 'Chưa có thông tin'}</p>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}

                                    {/* Pagination */}
                                    {totalPages > 1 && (
                                        <div className="flex justify-center mt-6">
                                            <div className="flex space-x-1">
                                                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                                                    <button
                                                        key={page}
                                                        onClick={() => handlePageChange(page)}
                                                        className={`px-4 py-2 rounded ${currentPage === page ? 'bg-primary text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
                                                    >
                                                        {page}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                                    <div className="text-gray-500 text-lg mb-3">Bạn chưa có buổi tập nào.</div>
                                    <p className="text-gray-600 mb-4">Bạn có thể đăng ký lịch tập mới bằng cách nhấn vào nút "Đăng Ký Lịch Tập".</p>
                                    <button
                                        onClick={openBookingModal}
                                        className="px-6 py-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
                                    >
                                        <FaPlus className="inline mr-2" /> Đăng Ký Ngay
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </>
            )}

            {/* Update Modal */}
            {showUpdateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">Cập Nhật Lịch Tập</h3>
                            <button
                                onClick={() => setShowUpdateModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        {updateError && (
                            <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                                {updateError}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Ngày Tập *
                                </label>
                                <input
                                    type="date"
                                    name="date"
                                    value={updateSessionData.date}
                                    onChange={handleUpdateChange}
                                    className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-primary"
                                    min={new Date().toISOString().split('T')[0]} // Disable past dates
                                    disabled={updateLoading}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Giờ Bắt Đầu *
                                    </label>
                                    <input
                                        type="time"
                                        name="startHour"
                                        value={updateSessionData.startHour}
                                        onChange={handleUpdateChange}
                                        className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-primary"
                                        disabled={updateLoading}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Giờ Kết Thúc
                                    </label>
                                    <div className="w-full p-2 border rounded bg-gray-100 text-gray-700">
                                        {updateSessionData.endHour}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">Tự động tính (bắt đầu + 1 giờ)</p>
                                </div>
                            </div>

                            <div className="bg-yellow-50 p-3 rounded text-sm text-yellow-700">
                                <p className="font-medium mb-1">Lưu ý:</p>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>Chỉ có thể cập nhật các buổi tập diễn ra sau 24 giờ kể từ hiện tại</li>
                                    <li>Vui lòng chọn thời gian trong khung giờ hoạt động (8:00 - 22:00)</li>
                                    <li>Việc cập nhật sẽ thay đổi thời gian trong lịch của huấn luyện viên</li>
                                </ul>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-2 mt-6">
                            <button
                                onClick={() => setShowUpdateModal(false)}
                                className="px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                                disabled={updateLoading}
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleUpdateSession}
                                className="px-4 py-2 bg-primary text-white rounded hover:bg-secondary transition-colors flex items-center"
                                disabled={updateLoading}
                            >
                                {updateLoading ? (
                                    <>
                                        <FaSpinner className="animate-spin mr-2" /> Đang xử lý...
                                    </>
                                ) : (
                                    <>
                                        <FaCheck className="mr-2" /> Cập Nhật
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Booking Modal */}
            {showBookingModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">Đăng Ký Lịch Tập</h3>
                            <button
                                onClick={() => setShowBookingModal(false)}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <FaTimes />
                            </button>
                        </div>

                        {bookingError && (
                            <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                                {bookingError}
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Huấn Luyện Viên *
                                </label>
                                <select
                                    name="employeeID"
                                    value={bookingData.employeeID}
                                    onChange={handleBookingChange}
                                    className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-primary"
                                    disabled={bookingLoading}
                                >
                                    <option value="">Chọn huấn luyện viên</option>
                                    {trainers.map(trainer => (
                                        <option key={trainer._id} value={trainer._id}>
                                            {trainer.name} {trainer.specialization ? `- ${trainer.specialization}` : ''}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Ngày Tập *
                                </label>
                                <input
                                    type="date"
                                    name="date"
                                    value={bookingData.date}
                                    onChange={handleBookingChange}
                                    className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-primary"
                                    min={new Date().toISOString().split('T')[0]} // Disable past dates
                                    disabled={bookingLoading}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Giờ Bắt Đầu *
                                    </label>
                                    <input
                                        type="time"
                                        name="startHour"
                                        value={bookingData.startHour}
                                        onChange={handleBookingChange}
                                        className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-primary"
                                        disabled={bookingLoading}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Giờ Kết Thúc *
                                    </label>
                                    <input
                                        type="time"
                                        name="endHour"
                                        value={bookingData.endHour}
                                        onChange={handleBookingChange}
                                        className="w-full p-2 border rounded focus:outline-none focus:ring focus:ring-primary"
                                        disabled={bookingLoading}
                                    />
                                </div>
                            </div>

                            <div className="bg-blue-50 p-3 rounded text-sm text-blue-700">
                                <p className="font-medium mb-1">Lưu ý:</p>
                                <ul className="list-disc pl-5 space-y-1">
                                    <li>Vui lòng chọn thời gian trong khung giờ hoạt động (8:00 - 22:00)</li>
                                    <li>Mỗi buổi tập nên kéo dài từ 30 phút đến 2 giờ</li>
                                    <li>Đặt lịch trước ít nhất 24 giờ so với thời gian tập</li>
                                    <li>Huấn luyện viên có thể thay đổi trong trường hợp bất khả kháng</li>
                                </ul>
                            </div>
                        </div>

                        <div className="flex justify-end space-x-2 mt-6">
                            <button
                                onClick={() => setShowBookingModal(false)}
                                className="px-4 py-2 text-gray-700 border border-gray-300 rounded hover:bg-gray-100 transition-colors"
                                disabled={bookingLoading}
                            >
                                Hủy
                            </button>
                            <button
                                onClick={handleBookSession}
                                className="px-4 py-2 bg-primary text-white rounded hover:bg-secondary transition-colors flex items-center"
                                disabled={bookingLoading}
                            >
                                {bookingLoading ? (
                                    <>
                                        <FaSpinner className="animate-spin mr-2" /> Đang xử lý...
                                    </>
                                ) : (
                                    <>
                                        <FaCheck className="mr-2" /> Đăng Ký
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TrainScheduleContent;