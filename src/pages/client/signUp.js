import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { level1s, findById } from "dvhcvn";
import { ReactComponent as ViewHideLight } from "../../assets/icons/View_hide_light.svg";
import { ReactComponent as ViewLight } from "../../assets/icons/View_light.svg";


const SignUpPageUser = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState({ street: "", city: "", country: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const URL_API = process.env.REACT_APP_API_URL;
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  

  useEffect(() => {
    setProvinces(level1s); // Lấy danh sách tỉnh/thành phố
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Mật khẩu không khớp!");
      return;
    }

    try {
      const response = await axios.post(`${URL_API}auth/register/user`, {
        email,
        password,
        phone,
        name,
        address: {
          city: selectedProvince ? findById(selectedProvince)?.name : "",
          district: selectedDistrict ? findById(selectedDistrict)?.name : "",
          ward: selectedWard ? findById(selectedWard)?.name : "",
          street: address.street,
        },
      });

      if (response.data.status === "success") {
        navigate("/login-user");
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError("Lỗi đăng ký, vui lòng thử lại!");
    }
};


  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress((prevAddress) => ({
      ...prevAddress,
      [name]: value,
    }));
  };
  const handleProvinceChange = (e) => {
    const provinceCode = e.target.value;
    const province = findById(provinceCode);

    setSelectedProvince(provinceCode);
    setSelectedDistrict("");
    setSelectedWard("");
    setDistricts(province?.children || []);
    setWards([]);

    setAddress((prevAddress) => ({
      ...prevAddress,
      city: province.name,
    }));
  };

  const handleDistrictChange = (e) => {
    const districtCode = e.target.value;
    const district = findById(districtCode);

    setSelectedDistrict(districtCode);
    setSelectedWard("");
    setWards(district?.children || []);

    setAddress((prevAddress) => ({
      ...prevAddress,
      district: district.name,
    }));

  };

  const handleWardChange = (e) => {
    const wardCode = e.target.value;
    const ward = findById(wardCode);

    setSelectedWard(wardCode);

    setAddress((prevAddress) => ({
      ...prevAddress,
      ward:  ward.name ,
    }));

  };

  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen">
      <div className="bg-white shadow-lg rounded-lg flex max-w-4xl w-full">
        {/* Left Section */}
        <div className="w-1/2 p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Chào mừng <span className="wave">👋</span>
          </h1>
          <p className="text-gray-600 mb-6">
            Hôm nay là một ngày mới. Đó là ngày của bạn!
          </p>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="name"
              >
                Tên người dùng
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="name"
                type="text"
                placeholder="Tên người dùng"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mb-4 relative">
  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
    Mật khẩu
  </label>
  <input
    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
    id="password"
    type={showPassword ? "text" : "password"}
    placeholder="Mật khẩu"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
  />
  <button
    type="button"
    className="absolute right-3 top-10 text-gray-500"
    onClick={() => setShowPassword(!showPassword)}
  >
  {showPassword ? <ViewLight className="w-5 h-5" /> : <ViewHideLight className="w-5 h-5" />}
  </button>
</div>

<div className="mb-4 relative">
  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
    Nhập lại mật khẩu
  </label>
  <input
    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
    id="confirmPassword"
    type={showConfirmPassword ? "text" : "password"}
    placeholder="Nhập lại mật khẩu"
    value={confirmPassword}
    onChange={(e) => setConfirmPassword(e.target.value)}
  />
  <button
    type="button"
    className="absolute right-3 top-10 text-gray-500"
    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
  >
  {showConfirmPassword ? <ViewLight className="w-5 h-5" /> : <ViewHideLight className="w-5 h-5" />}
  </button>
</div>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="phone"
              >
                Số điện thoại
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="phone"
                type="text"
                placeholder="Số điện thoại"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Tỉnh/Thành phố:
              </label>
              <select
                className="border p-2 w-full rounded-md"
                value={selectedProvince}
                onChange={handleProvinceChange}
              >
                <option value="">Chọn tỉnh/thành</option>
                {provinces.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} {/* Hiển thị tên */}
                  </option>
                ))}
              </select>
            </div>

            {/* Chọn quận/huyện */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Quận/Huyện:
              </label>
              <select
                className="border p-2 w-full rounded-md"
                value={selectedDistrict}
                onChange={handleDistrictChange}
                disabled={!selectedProvince}
              >
                <option value="">Chọn quận/huyện</option>
                {districts.map((d) => (
                  <option key={d.id} value={d.id}>
                    {" "}
                    {/* ✅ Lưu ID */}
                    {d.name} {/* Hiển thị tên */}
                  </option>
                ))}
              </select>
            </div>

            {/* Chọn phường/xã */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Phường/Xã:
              </label>
              <select
                className="border p-2 w-full rounded-md"
                value={selectedWard}
                onChange={handleWardChange}
                disabled={!selectedDistrict}
              >
                <option value="">Chọn phường/xã</option>
                {wards.map((w) => (
                  <option key={w.id} value={w.id}>
                    {" "}
                    {/* ✅ Lưu ID */}
                    {w.name} {/* Hiển thị tên */}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="street"
              >
                Địa chỉ (Số nhà, đường)
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                id="street"
                type="text"
                placeholder="Số nhà, đường"
                name="street"
                value={address.street}
                onChange={handleAddressChange}
              />
            </div>
            {error && (
              <p className="text-red-500 text-xs italic mb-4">{error}</p>
            )}
            <div className="mb-6">
              <button
                className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                type="submit"
              >
                Đăng ký
              </button>
            </div>
          </form>
          <p className="text-center text-gray-500 mt-6">
            Bạn đã có tài khoản?
            <a
              className="text-blue-500 hover:text-blue-800 ml-1"
              href="/login-user"
            >
              Đăng nhập
            </a>
          </p>
        </div>

        {/* Right Section */}
        <div className="w-1/2 relative">
          <img
            src="https://storage.googleapis.com/a1aa/image/15kDt7v93-7BnU9_EzemqaW9rY4V3vZ2BsfuCXGz8nM.jpg"
            alt="Gym background"
            className="w-full h-full object-cover rounded-r-lg"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-center p-8">
            <h2 className="text-4xl font-bold text-yellow-500 mb-2">
              START TRAINING NOW
            </h2>
            <p className="text-white mb-4">
              Golden Health — Your Dream Body! Discover a modern fitness space
              with state-of-the-art equipment, professional trainers, and
              personalized workout plans. Your journey to transformation starts
              here!
            </p>
            <button className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded">
              START NOW
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUpPageUser;
