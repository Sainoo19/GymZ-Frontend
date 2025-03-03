import React from "react";
import { useEffect, useState } from "react";
import axios from "axios";

const DeliveryAddress = ({user}) => {

  return (
    <div className="w-4/5 border container mx-auto items-center py-5 mt-11 bg-gray-100 rounded-lg">
      <h3 className=" pl-5">Thông tin giao hàng</h3>
      {user ? (
        <div className="flex w-5/6  items-center  h-10 ">
          <div className="flex  w-1/2 items-center">
          <p className="font-semibold pl-5 text-base">
             {user.name}
             
          </p>
          <p className="ml-6 text-sm">
            {user.phone}
          </p>
          </div>
         
         
          <p className="text-sm">
             {user.address?.street},{" "}
            {user.address?.city}, {user.address?.country}
          </p>
        </div>
      ) : (
        <p>Đang load</p>
      )}
    </div>
  );
};

export default DeliveryAddress;
