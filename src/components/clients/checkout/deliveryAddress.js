import React, { useState } from "react";
import AddressSelector from "../../utils/addressSelector"; 

const DeliveryAddress = ({ user }) => {
  const [showForm, setShowForm] = useState(false);
  const [customAddress, setCustomAddress] = useState(null);
  const [errors, setErrors] = useState({}); // Lưu lỗi
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    province: "",
    district: "",
    ward: "",
    street: "",
  });

  const toggleForm = () => {
    setShowForm(!showForm);
    setErrors({}); // Reset lỗi khi mở lại form
  };

  const handleAddressChange = (address) => {
    setFormData((prev) => ({
      ...prev,
      province: address.province,
      provinceName: address.provinceName,
      district: address.district,
      districtName: address.districtName,
      ward: address.ward,
      wardName: address.wardName,
    }));
  };
  
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Vui lòng nhập tên người nhận";
    if (!formData.phone.trim()) newErrors.phone = "Vui lòng nhập số điện thoại";
    if (!formData.province) newErrors.province = "Vui lòng chọn tỉnh/thành phố";
    if (!formData.district) newErrors.district = "Vui lòng chọn quận/huyện";
    if (!formData.ward) newErrors.ward = "Vui lòng chọn phường/xã";
    if (!formData.street.trim()) newErrors.street = "Vui lòng nhập địa chỉ cụ thể";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Trả về true nếu không có lỗi
  };

  const handleSaveAddress = () => {
    if (!validateForm()) return; // Dừng nếu có lỗi
    setCustomAddress(formData);
    setShowForm(false);
  };

  return (
    <div className="w-4/5 border container mx-auto py-5 mt-11 bg-gray-100 rounded-lg">
      <h3 className="pl-5">Thông tin giao hàng</h3>

      {/* Hiển thị địa chỉ hiện tại */}
      {(customAddress || user) ? (
        <div className="flex w-5/6 items-center h-10">
          <div className="flex w-1/2 items-center">
          <p className="font-semibold pl-5 text-base">
  {customAddress ? customAddress.name : user?.name}
</p>
<p className="ml-6 text-sm">
  {customAddress ? customAddress.phone : user?.phone}
</p>

          </div>
          <p className="text-sm">
  {customAddress
    ? `${customAddress.street}, ${customAddress.wardName}, ${customAddress.districtName}, ${customAddress.provinceName}`
    : `${user.address?.street}, ${user.address?.wardName}, ${user.address?.districtName}, ${user.address?.provinceName}`}
</p>
        </div>
      ) : (
        <p className="pl-5">Đang load...</p>
      )}

      {/* Nút Thêm Địa Chỉ Mới */}
      <div className="pl-5 mt-3">
        <button onClick={toggleForm} className="bg-blue-500 text-white px-4 py-2 rounded-md">
          {showForm ? "Hủy" : "Thêm địa chỉ mới"}
        </button>
      </div>

      {/* Hiển thị form dưới dạng modal */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-3/4 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Nhập địa chỉ mới</h2>

            {/* Nhập tên người nhận */}
            <label className="block mt-2 text-sm">Nhập tên người nhận:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="border rounded p-2 w-full"
              placeholder="Nhập tên người nhận"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

            {/* Nhập số điện thoại */}
            <label className="block mt-2 text-sm">Số điện thoại:</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="border rounded p-2 w-full"
              placeholder="Nhập số điện thoại"
            />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}

            {/* Component chọn địa chỉ */}
            <AddressSelector onChange={handleAddressChange} />

            {errors.province && <p className="text-red-500 text-sm">{errors.province}</p>}
            {errors.district && <p className="text-red-500 text-sm">{errors.district}</p>}
            {errors.ward && <p className="text-red-500 text-sm">{errors.ward}</p>}

            {/* Nhập số nhà, số tầng */}
            <label className="block mt-2 text-sm">Số nhà, số tầng:</label>
            <input
              type="text"
              name="street"
              value={formData.street}
              onChange={handleInputChange}
              className="border rounded p-2 w-full"
              placeholder="Nhập địa chỉ cụ thể"
            />
            {errors.street && <p className="text-red-500 text-sm">{errors.street}</p>}

            {/* Nút lưu & hủy */}
            <div className="flex justify-end mt-4">
              <button onClick={toggleForm} className="mr-2 bg-gray-500 text-white px-4 py-2 rounded-md">
                Hủy
              </button>
              <button onClick={handleSaveAddress} className="bg-primary hover:bg-secondary hover:text-primary text-white px-4 py-2 rounded-md">
                Lưu địa chỉ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryAddress;
