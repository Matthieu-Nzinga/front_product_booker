import React, { useState } from "react";
import { IoNotificationsOutline } from "react-icons/io5";
import { PiUserCircleLight } from "react-icons/pi";
import { useSelector } from "react-redux";


const Header = ({ text }) => {
  const image = useState(false);
  const token = useSelector((state) => state.auth.token);
  

  return (
    <div className="w-[80%] fixed bg-white z-50 p-6 top-0 flex justify-between">
      <div className="flex items-center">
        
        <div className="hidden md:block">
          <h1 className="text-[40px] font-extrabold">{text}</h1>
        </div>
      </div>
      <div className="flex items-center gap-8">
        
        <button className="hidden md:block mx-[-13px]">
          <IoNotificationsOutline size={30} color="black" />
        </button>
        <div className="flex justify-end w-full md:w-auto">
          {image ? (
            <PiUserCircleLight size={55} color="gray" />
          ) : (
            <img src="" alt="" />
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
