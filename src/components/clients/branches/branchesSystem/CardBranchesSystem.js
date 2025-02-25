import React from "react";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaFacebookMessenger } from "react-icons/fa";

const CardBranchesSystem = ({ _id, name, address, phone}) => {
    const mapLink = "https://maps.app.goo.gl/hvn25dLT4TJKPA1z5";
    const emailLink = "mailto:contact@gymsystem.com";
    const messengerLink = "https://m.me/gymsystem";
    const addressString = address
    ? `${address.street}, ${address.city}, ${address.country}`
    : "Không có địa chỉ";

  return (
    <div className="flex flex-row items-center justify-between w-full max-w-4xl border border-gray-500 shadow-md py-4">
      
      {/* Phần 1: Tên quận + Bản đồ */}
      <div className="flex flex-col items-center text-center w-52 border-r border-gray-500 ">
        <h2 className="text-lg font-bold text-secondary">{name}</h2>
        <a href={mapLink} target="_blank" rel="noopener noreferrer" className="text-white flex items-center gap-2">
          <FaMapMarkerAlt className="text-blue-600" /> Xem bản đồ
        </a>
      </div>

      {/* Phần 2: Địa chỉ + Số điện thoại */}
      <div className="flex-1 px-4 border-r border-gray-500 flex justify-between items-center py-2">
        <p className="text-white font-bold text-base">{addressString}</p>
        <p className="text-white font-semibold pt-2 flex items-center">
            <FaPhoneAlt className="mr-2 text-white" /> {phone}
        </p>
        </div>

      {/* Phần 3: Email & Messenger */}
      <div className="flex flex-col items-center gap-2 px-8 ">
        <a href={emailLink} target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-500">
          <FaEnvelope size={24} />
        </a>
        <a href={messengerLink} target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-500">
          <FaFacebookMessenger size={24} />
        </a>
      </div>

    </div>
  );
};

export default CardBranchesSystem;
