import React from "react";

const DashboardCard = ({ icon, number, title }) => {
  return (
    <div className="bg-custom-gradient rounded-xl p-5 flex flex-col justify-between h-[35vh]">
      <div className="bg-white rounded-full w-[80px]  h-[80px] flex justify-center items-center">
        {icon}
      </div>
      <div>
        <h2 className="font-extrabold text-[64px] ">{number}</h2>
        <p className="font-normal text-base text-[#6B6B6B] mt-[-10px]">{title} </p>
      </div>
    </div>
  );
};

export default DashboardCard;
