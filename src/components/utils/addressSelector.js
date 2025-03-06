import React, { useState, useEffect } from "react";
import * as dvhcvn from "dvhcvn"; // Đảm bảo nhập đúng cách
import { level1s, findById } from "dvhcvn";

const AddressSelector = ({ onChange }) => {
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  useEffect(() => {
    setProvinces(level1s); // Lấy danh sách tỉnh/thành phố
  }, []);

  const handleProvinceChange = (e) => {
    const provinceCode = e.target.value;
    const province = findById(provinceCode);
  
    setSelectedProvince(provinceCode);
    setSelectedDistrict("");
    setSelectedWard("");
    setDistricts(province?.children || []);
    setWards([]);
  
    onChange({
      province: provinceCode,
      provinceName: province ? province.name : "", // Lưu cả tên
      district: "",
      districtName: "",
      ward: "",
      wardName: "",
    });
  };
  
  const handleDistrictChange = (e) => {
    const districtCode = e.target.value;
    const district = findById(districtCode);
  
    setSelectedDistrict(districtCode);
    setSelectedWard("");
    setWards(district?.children || []);
  
    onChange({
      province: selectedProvince,
      provinceName: findById(selectedProvince)?.name || "",
      district: districtCode,
      districtName: district ? district.name : "", // Lưu cả tên
      ward: "",
      wardName: "",
    });
  };
  
  const handleWardChange = (e) => {
    const wardCode = e.target.value;
    const ward = findById(wardCode);
  
    setSelectedWard(wardCode);
  
    onChange({
      province: selectedProvince,
      provinceName: findById(selectedProvince)?.name || "",
      district: selectedDistrict,
      districtName: findById(selectedDistrict)?.name || "",
      ward: wardCode,
      wardName: ward ? ward.name : "", // Lưu cả tên
    });
  };
  
  

  return (
    <div className="grid grid-cols-3 gap-4">
      {/* Chọn tỉnh/thành phố */}
      <div>
        <label className="block text-sm font-medium">Tỉnh/Thành phố:</label>
        <select className="border p-2 w-full rounded-md" value={selectedProvince} onChange={handleProvinceChange}>
          <option value="">Chọn tỉnh/thành</option>
          {provinces.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      {/* Chọn quận/huyện */}
      <div>
        <label className="block text-sm font-medium">Quận/Huyện:</label>
        <select className="border p-2 w-full rounded-md" value={selectedDistrict} onChange={handleDistrictChange} disabled={!selectedProvince}>
          <option value="">Chọn quận/huyện</option>
          {districts.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </div>

      {/* Chọn phường/xã */}
      <div>
        <label className="block text-sm font-medium">Phường/Xã:</label>
        <select className="border p-2 w-full rounded-md" value={selectedWard} onChange={handleWardChange} disabled={!selectedDistrict}>
          <option value="">Chọn phường/xã</option>
          {wards.map((w) => (
            <option key={w.id} value={w.id}>
              {w.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default AddressSelector;
