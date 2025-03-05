import React, { useState } from "react";
import dvhcvn from "dvhcvn";

const AddressSelector = ({ onChange }) => {
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");

  const provinces = dvhcvn.getProvinces();
  const districts = selectedProvince ? dvhcvn.getDistricts(selectedProvince) : [];
  const wards = selectedDistrict ? dvhcvn.getWards(selectedDistrict) : [];

  const handleProvinceChange = (e) => {
    const provinceCode = e.target.value;
    setSelectedProvince(provinceCode);
    setSelectedDistrict("");
    setSelectedWard("");
    onChange({ province: provinceCode, district: "", ward: "" });
  };

  const handleDistrictChange = (e) => {
    const districtCode = e.target.value;
    setSelectedDistrict(districtCode);
    setSelectedWard("");
    onChange({ province: selectedProvince, district: districtCode, ward: "" });
  };

  const handleWardChange = (e) => {
    const wardCode = e.target.value;
    setSelectedWard(wardCode);
    onChange({ province: selectedProvince, district: selectedDistrict, ward: wardCode });
  };

  return (
    <div className="grid grid-cols-3 gap-4">
      <div>
        <label className="block text-sm font-medium">Tỉnh/Thành phố:</label>
        <select className="border p-2 w-full rounded-md" onChange={handleProvinceChange}>
          <option value="">Chọn tỉnh/thành</option>
          {provinces.map((p) => (
            <option key={p.code} value={p.code}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">Quận/Huyện:</label>
        <select
          className="border p-2 w-full rounded-md"
          onChange={handleDistrictChange}
          disabled={!selectedProvince}
        >
          <option value="">Chọn quận/huyện</option>
          {districts.map((d) => (
            <option key={d.code} value={d.code}>
              {d.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium">Phường/Xã:</label>
        <select
          className="border p-2 w-full rounded-md"
          onChange={handleWardChange}
          disabled={!selectedDistrict}
        >
          <option value="">Chọn phường/xã</option>
          {wards.map((w) => (
            <option key={w.code} value={w.code}>
              {w.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default AddressSelector;
