import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { FileDropUser } from './FileDropUser';
import { level1s, findById } from "dvhcvn";

const UpdateUserForm = () => {
    const { id } = useParams(); // Lấy id từ URL
    const navigate = useNavigate();
    const [user, setUser] = useState({
        id: '',
        name: '',
        email: '',
        phone: '',
        password: '',
        status: '',
        role: '',
        address: {
            province: '',
            district: '',
            ward: '',
            street: ''
        },
        createdAt: '',
        updatedAt: ''
    });
    const URL_API = process.env.REACT_APP_API_URL;

    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedRole, setSelectedRole] = useState('');
    const status = ['Active', 'Inactive'];
    const role = ['User', 'Silver', 'Gold'];
    const [newFileName, setNewFileName] = useState("");

    // State cho địa chỉ
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState("");
    const [selectedDistrict, setSelectedDistrict] = useState("");
    const [selectedWard, setSelectedWard] = useState("");

    // Load danh sách tỉnh/thành
    useEffect(() => {
        setProvinces(level1s);
    }, []);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`${URL_API}users/${id}`);
                const userData = response.data.data;

                setUser({
                    ...userData,
                    createdAt: new Date(userData.createdAt).toISOString(),
                    updatedAt: new Date(userData.updatedAt).toISOString()
                });

                // Nếu có dữ liệu địa chỉ, tìm ID tỉnh/thành phù hợp
                if (userData.address) {
                    // Tìm ID tỉnh từ tên
                    const provinceObj = level1s.find(p => p.name === userData.address.province);
                    if (provinceObj) {
                        setSelectedProvince(provinceObj.id);

                        // Load danh sách quận/huyện
                        const districtsOfProvince = provinceObj.children || [];
                        setDistricts(districtsOfProvince);

                        // Tìm ID quận/huyện từ tên
                        const districtObj = districtsOfProvince.find(d => d.name === userData.address.district);
                        if (districtObj) {
                            setSelectedDistrict(districtObj.id);

                            // Load danh sách phường/xã
                            const wardsOfDistrict = districtObj.children || [];
                            setWards(wardsOfDistrict);

                            // Tìm ID phường/xã từ tên
                            const wardObj = wardsOfDistrict.find(w => w.name === userData.address.ward);
                            if (wardObj) {
                                setSelectedWard(wardObj.id);
                            }
                        }
                    }
                }
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu user:', error);
            }
        };

        if (id) {
            fetchUser();
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({
            ...prevUser,
            [name]: value
        }));
    };

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setUser((prevUser) => ({
            ...prevUser,
            address: {
                ...prevUser.address,
                [name]: value
            }
        }));
    };

    // Xử lý khi chọn tỉnh/thành
    const handleProvinceChange = (e) => {
        const provinceId = e.target.value;
        const province = findById(provinceId);

        setSelectedProvince(provinceId);
        setSelectedDistrict("");
        setSelectedWard("");

        if (province) {
            setDistricts(province.children || []);
            setWards([]);

            setUser(prevUser => ({
                ...prevUser,
                address: {
                    ...prevUser.address,
                    province: province.name,
                    district: '',
                    ward: ''
                }
            }));
        }
    };

    // Xử lý khi chọn quận/huyện
    const handleDistrictChange = (e) => {
        const districtId = e.target.value;
        const district = findById(districtId);

        setSelectedDistrict(districtId);
        setSelectedWard("");

        if (district) {
            setWards(district.children || []);

            setUser(prevUser => ({
                ...prevUser,
                address: {
                    ...prevUser.address,
                    district: district.name,
                    ward: ''
                }
            }));
        }
    };

    // Xử lý khi chọn phường/xã
    const handleWardChange = (e) => {
        const wardId = e.target.value;
        const ward = findById(wardId);

        setSelectedWard(wardId);

        if (ward) {
            setUser(prevUser => ({
                ...prevUser,
                address: {
                    ...prevUser.address,
                    ward: ward.name
                }
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const updatedUser = {
                ...user,
                avatar: newFileName || user.avatar,
                updatedAt: new Date().toISOString(),
            };
            await axios.put(`${URL_API}users/update/${id}`, updatedUser);
            navigate('/admin/users');
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    const handleCancel = () => {
        navigate('/admin/users'); // Quay lại trang danh sách
    };

    return (
        <div className='bg-background_admin'>
            <h2 className='p-6 block text-xl font-semibold'>Cập nhật thông tin người dùng</h2>
            <div className='w-full flex justify-center items-center'>
                <form onSubmit={handleSubmit} className='w-11/12 ml-6 mb-16 rounded-2xl bg-white'>
                    <div className='ml-6 flex justify-between'>
                        <div className='mt-4 w-2/4'>
                            <p className='block font-semibold text-base text-gray-400'>
                                Mã khách hàng: {user._id}
                            </p>
                        </div>
                        <div className='mt-4 w-2/4'>
                            <div>
                                <p className='block font-semibold text-base text-gray-400'>
                                    Ngày tạo: {new Date(user.createdAt).toLocaleString('vi-VN', {
                                        year: 'numeric', month: '2-digit', day: '2-digit',
                                        hour: '2-digit', minute: '2-digit', second: '2-digit',
                                        hour12: false, timeZone: 'Asia/Ho_Chi_Minh'
                                    })}
                                </p>
                            </div>
                            <div className='mt-2'>
                                <p className='block font-semibold text-base text-gray-400'>
                                    Thời gian cập nhật lần cuối: {new Date(user.updatedAt).toLocaleString('vi-VN', {
                                        year: 'numeric', month: '2-digit', day: '2-digit',
                                        hour: '2-digit', minute: '2-digit', second: '2-digit',
                                        hour12: false, timeZone: 'Asia/Ho_Chi_Minh'
                                    })}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className='flex'>
                        <div className='ml-6 w-2/4'>
                            <div className='mt-1 mb-4'>
                                <label className='block font-semibold text-base'>
                                    Tên khách hàng
                                </label>
                                <input
                                    type='text'
                                    placeholder='Nhập tên khách hàng'
                                    name='name' value={user.name}
                                    onChange={handleChange}
                                    className='mt-2 border-2 border-gray-600 rounded-lg p-1 w-11/12 focus:outline-none focus:ring-2 focus:ring-primary'
                                />
                            </div>

                            <div className='mb-4'>
                                <label className='block font-semibold text-base'>
                                    Email
                                </label>
                                <input
                                    type='email'
                                    placeholder='Nhập email khách hàng'
                                    name='email'
                                    value={user.email}
                                    onChange={handleChange}
                                    className='mt-2 border-2 border-gray-600 rounded-lg p-1 w-11/12 focus:outline-none focus:ring-2 focus:ring-primary'
                                />
                            </div>

                            <div className='mb-4'>
                                <label className='block font-semibold text-base'>
                                    Số điện thoại
                                </label>
                                <input
                                    type='text'
                                    placeholder='Nhập số điện thoại khách hàng'
                                    name='phone'
                                    value={user.phone}
                                    onChange={handleChange}
                                    className='mt-2 border-2 border-gray-600 rounded-lg p-1 w-11/12 focus:outline-none focus:ring-2 focus:ring-primary'
                                />
                            </div>

                            <div className='mb-4'>
                                <label className='block font-semibold text-base'>
                                    Status
                                </label>
                                <select
                                    value={user.status}
                                    name='status'
                                    onChange={handleChange}
                                    className='mt-2 border-2 text-sm border-gray-600 rounded-lg p-1 w-11/12 focus:outline-none focus:ring-2 focus:ring-primary'
                                >
                                    <option disabled>
                                        Tình trạng khách hàng
                                    </option>
                                    {status.map((item, index) => (
                                        <option key={index} value={item}>
                                            {item}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className='mb-4'>
                                <label className='block font-semibold text-base'>
                                    Hạng mức khách hàng
                                </label>
                                <select
                                    value={user.role}
                                    name='role'
                                    onChange={handleChange}
                                    className='mt-2 border-2 text-sm border-gray-600 rounded-lg p-1 w-11/12 focus:outline-none focus:ring-2 focus:ring-primary'
                                >
                                    <option disabled>
                                        Hạng mức khách hàng
                                    </option>
                                    {role.map((item, index) => (
                                        <option key={index} value={item}>
                                            {item}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Địa chỉ với tỉnh/thành, quận/huyện, phường/xã */}
                            <div className='mb-4'>
                                <label className='block font-semibold text-base mb-2'>
                                    Địa chỉ
                                </label>
                                <div className="mb-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Tỉnh/Thành phố:
                                    </label>
                                    <select
                                        className="border p-2 w-11/12 rounded-md"
                                        value={selectedProvince}
                                        onChange={handleProvinceChange}
                                    >
                                        <option value="">Chọn tỉnh/thành</option>
                                        {provinces.map((p) => (
                                            <option key={p.id} value={p.id}>
                                                {p.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mb-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Quận/Huyện:
                                    </label>
                                    <select
                                        className="border p-2 w-11/12 rounded-md"
                                        value={selectedDistrict}
                                        onChange={handleDistrictChange}
                                        disabled={!selectedProvince}
                                    >
                                        <option value="">Chọn quận/huyện</option>
                                        {districts.map((d) => (
                                            <option key={d.id} value={d.id}>
                                                {d.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mb-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Phường/Xã:
                                    </label>
                                    <select
                                        className="border p-2 w-11/12 rounded-md"
                                        value={selectedWard}
                                        onChange={handleWardChange}
                                        disabled={!selectedDistrict}
                                    >
                                        <option value="">Chọn phường/xã</option>
                                        {wards.map((w) => (
                                            <option key={w.id} value={w.id}>
                                                {w.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="mb-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Số nhà, đường:
                                    </label>
                                    <input
                                        type='text'
                                        name='street'
                                        value={user.address?.street || ''}
                                        onChange={handleAddressChange}
                                        placeholder='Số nhà, đường'
                                        className='w-11/12 px-3 py-2 border rounded'
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Avatar */}
                        <div className="flex flex-col items-center">
                            <label className="block font-medium">Ảnh đại diện</label>
                            <div className="flex justify-center w-full">
                                <img
                                    src={newFileName || user.avatar || "https://cellphones.com.vn/sforum/wp-content/uploads/2023/10/avatar-trang-4.jpg"}
                                    alt="Avatar"
                                    className="w-24 h-24 rounded mb-2"
                                />
                            </div>
                            <FileDropUser onFileUpload={setNewFileName} />
                        </div>
                    </div>

                    <div className='w-full mb-4'>
                        <div className='flex justify-center'>
                            <button type='submit' className='m-3 p-2 w-1/4 bg-secondary rounded-lg hover:bg-yellow-400 transition'>
                                Cập nhật
                            </button>
                            <button type='button' onClick={handleCancel} className='m-3 p-2 w-1/4 block border border-primary rounded-lg hover:bg-gray-300 transition'>
                                Hủy
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateUserForm;