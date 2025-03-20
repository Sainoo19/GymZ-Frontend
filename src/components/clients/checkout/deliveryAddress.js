import React, { useState, useEffect } from "react";
import AddressSelector from "../../utils/addressSelector";

const DeliveryAddress = ({ user, setDeliveryAddress }) => {
  const [showForm, setShowForm] = useState(false);
  const [customAddress, setCustomAddress] = useState(null);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    province: "",
    district: "",
    ward: "",
    street: "",
  });

  // Load địa chỉ mặc định từ user khi component mount
  useEffect(() => {
    if (user?.address && !customAddress) {
      const defaultAddress = {
        name: user.name,
        phone: user.phone,
        ...user.address,
      };
      setCustomAddress(defaultAddress);
      setDeliveryAddress(defaultAddress); // Gán vào DeliveryAddress ngay từ đầu
    }
  }, [user, customAddress, setDeliveryAddress]);

  const toggleForm = () => {
    setShowForm(!showForm);
    setErrors({});

    // Khi mở form, load lại địa chỉ hiện tại vào formData
    if (!showForm) {
      setFormData({
        name: customAddress?.name || "",
        phone: customAddress?.phone || "",
        province: customAddress?.province || "",
        provinceName: customAddress?.provinceName || "",
        district: customAddress?.district || "",
        districtName: customAddress?.districtName || "",
        ward: customAddress?.ward || "",
        wardName: customAddress?.wardName || "",
        street: customAddress?.street || "",
      });
    }
  };

  const handleAddressChange = (address) => {
    console.log("Address received:", address);
    setFormData((prev) => ({
      ...prev,
      province: address.province,
      provinceName: address.provinceName || prev.provinceName, // Giữ giá trị cũ nếu thiếu
      district: address.district,
      districtName: address.districtName || prev.districtName,
      ward: address.ward,
      wardName: address.wardName || prev.wardName,
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
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveAddress = () => {
    if (!validateForm()) return;
  
    const newAddress = {
      name: formData.name,
      phone: formData.phone,
      province: formData.province,
      provinceName: formData.provinceName || customAddress?.provinceName || "",  
      district: formData.district,
      districtName: formData.districtName || customAddress?.districtName || "",
      ward: formData.ward,
      wardName: formData.wardName || customAddress?.wardName || "",
      street: formData.street,
    };
  
    console.log("Final address saved:", newAddress); // Debug log
  
    setCustomAddress(newAddress);
    setDeliveryAddress(newAddress);
    setShowForm(false);
  };
  
  

  return (
    <div className="w-full border container mx-auto py-5 mt-11 bg-gray-100 rounded-lg">
      <h3 className="pl-5 font-semibold text-xl">Thông tin giao hàng</h3>
      {customAddress ? (
        <div className=" mt-3  w-full items-center ">
          <div className="flex w-1/2 items-center">
            <p className="text-primary font-semibold pl-5 text-base">{customAddress.name}</p>
            <p className="text-primary ml-6 text-sm">{customAddress.phone}</p>
          </div>
          <p className="pl-5 text-primary mt-1 text-sm">
            {`${customAddress.street || ""}, ${customAddress.ward || ""}, ${customAddress.district || ""}, ${customAddress.province || ""}`}
          </p>
        </div>
      ) : (
        <p className="pl-5">Đang load...</p>
      )}

      {/* Nút Thêm Địa Chỉ Mới */}
      <div className="pl-5 mt-4">
        <button
          onClick={toggleForm}
          className="bg-primary flo text-white px-4 py-2 rounded-md"
        >
          {showForm ? "Hủy" : "Thêm địa chỉ mới"}
        </button>
      </div>

      {/* Hiển thị form thêm địa chỉ */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-3/4 shadow-lg">
            <h2 className="text-lg font-semibold mb-4">Nhập địa chỉ mới</h2>

            <label className="block mt-2 text-sm">Nhập tên người nhận:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="border rounded p-2 w-full"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}

            <label className="block mt-2 text-sm">Số điện thoại:</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="border rounded p-2 w-full"
            />
            {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}

            <AddressSelector onChange={handleAddressChange} />
            {errors.province && <p className="text-red-500 text-sm">{errors.province}</p>}
            {errors.district && <p className="text-red-500 text-sm">{errors.district}</p>}
            {errors.ward && <p className="text-red-500 text-sm">{errors.ward}</p>}

            <label className="block mt-2 text-sm">Số nhà, số tầng:</label>
            <input
              type="text"
              name="street"
              value={formData.street}
              onChange={handleInputChange}
              className="border rounded p-2 w-full"
            />
            {errors.street && <p className="text-red-500 text-sm">{errors.street}</p>}

            <div className="flex justify-end mt-4">
              <button onClick={toggleForm} className="mr-2 bg-gray-500 text-white px-4 py-2 rounded-md">Hủy</button>
              <button onClick={handleSaveAddress} className="bg-primary text-white px-4 py-2 rounded-md">Lưu địa chỉ</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryAddress;
