import React, { useState, useEffect } from "react";

const ChangeAddressModal = ({ isOpen, onClose, currentAddress, onUpdate }) => {
    const [address, setAddress] = useState({ province: '', district: '', ward: '', street: '' });

    // Cập nhật address khi currentAddress thay đổi
    useEffect(() => {
        if (isOpen) {
            setAddress(currentAddress || { province: '', district: '', ward: '', street: '' });
        }
    }, [isOpen, currentAddress]);

    const handleChange = (e) => {
        setAddress({ ...address, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        onUpdate(address);
        window.alert("Cập nhật địa chỉ thành công!")
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-500 bg-opacity-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                <h2 className="text-xl font-semibold mb-4">Cập Nhật Địa Chỉ</h2>
                <div>
                    <label className="block">Tỉnh/Thành phố</label>
                    <input type="text" name="province" value={address.province} onChange={handleChange} className="w-full border rounded p-2" />
                </div>
                <div>
                    <label className="block">Quận/Huyện</label>
                    <input type="text" name="district" value={address.district} onChange={handleChange} className="w-full border rounded p-2" />
                </div>
                <div>
                    <label className="block">Phường/Xã</label>
                    <input type="text" name="ward" value={address.ward} onChange={handleChange} className="w-full border rounded p-2" />
                </div>
                <div>
                    <label className="block">Đường</label>
                    <input type="text" name="street" value={address.street} onChange={handleChange} className="w-full border rounded p-2" />
                </div>
                <div className="mt-4 flex justify-end space-x-2">
                    <button className="bg-gray-400 text-white px-4 py-2 rounded" onClick={onClose}>Hủy</button>
                    <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleSave}>Lưu</button>
                </div>
            </div>
        </div>
    );
};

export default ChangeAddressModal;
