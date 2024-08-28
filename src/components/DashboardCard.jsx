const DashboardCard = ({ icon, number, title }) => {
  return (
    <div className="bg-custom-gradient rounded-xl p-5 flex flex-col justify-between h-[35vh] md:h-[25vh] sm:h-[20vh]">
      <div className="bg-white rounded-full w-[80px] h-[80px] flex justify-center items-center sm:w-[60px] sm:h-[60px]">
        {icon}
      </div>
      <div>
        <h2 className="font-extrabold text-[64px] sm:text-[48px]">{number}</h2>
        <p className="font-normal text-base text-[#6B6B6B] mt-[-10px] sm:mt-[-5px]">
          {title}
        </p>
      </div>
    </div>
  );
};

export default DashboardCard;
