import React from "react";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaFacebookMessenger } from "react-icons/fa";

const CardBranchesSystem = ({ _id, name, address, phone }) => {
  const mapLink = "https://maps.app.goo.gl/hvn25dLT4TJKPA1z5";
  const emailLink = "mailto:contact@gymsystem.com";
  const messengerLink = "https://m.me/gymsystem";
  const addressString = address
    ? `${address.street}, ${address.city}, ${address.country}`
    : "Không có địa chỉ";

  return (
    <div className="flex flex-col md:flex-row items-center justify-around w-full md:w-4/5 max-w-4xl mx-auto rounded-md border border-gray-500 shadow-md p-4 gap-4">
  
    {/* Tên chi nhánh + bản đồ */}
    <div className="flex flex-col items-center text-center w-full md:w-1/4 border-b md:border-b-0 md:border-r border-gray-500 pb-2 md:pb-0">
      <h2 className="text-lg font-bold text-secondary">{name}</h2>
      <a
        href={mapLink}
        target="_blank"
        rel="noopener noreferrer"
        className="text-white flex items-center gap-2 text-sm mt-1"
      >
        <FaMapMarkerAlt className="text-blue-600" /> Xem bản đồ
      </a>
    </div>
  
    {/* Địa chỉ + SĐT: giảm chiều rộng */}
    <div className="flex flex-col w-full md:w-2/4 px-2 md:px-4 gap-2 items-center md:items-start text-center md:text-left">
  <p className="text-white font-bold text-sm md:text-base">{addressString}</p>
  <p className="text-white font-semibold flex items-center text-sm md:text-base">
    <FaPhoneAlt className="mr-2" /> {phone}
  </p>
</div>

  
    {/* Email & Messenger */}
    <div className="flex items-center gap-4 justify-start ">
      <a
        href={emailLink}
        target="_blank"
        rel="noopener noreferrer"
        className="text-white hover:text-gray-500"
      >
        <FaEnvelope size={20} />
      </a>
      <a
        href={messengerLink}
        target="_blank"
        rel="noopener noreferrer"
        className="text-white hover:text-blue-500"
      >
        <FaFacebookMessenger size={20} />
      </a>
    </div>
  </div>
  
  );
};

export default CardBranchesSystem;
