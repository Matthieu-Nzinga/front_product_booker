import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { MdOutlineDashboard } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import { HiOutlineLogout } from "react-icons/hi";
import { HiOutlineCreditCard } from "react-icons/hi2";
import { IoHelpBuoyOutline } from "react-icons/io5";
import { useDispatch } from 'react-redux';
import { removeToken } from "../features/authUtils";
import { removeTokenAction } from "../features/auth/authSlice";


const SidBar = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    removeToken(); 
    dispatch(removeTokenAction()); 
    navigate('/');
  };

  return (
    <div className="w-[25%]">
      <div className="bg-[#084999] w-[20%] h-screen text-[#FFFFFFCC]  px-8 py-8 text-base font-normal flex flex-col justify-between fixed">
          <Link>
            <img
              src="/logo-white 1.svg"
              alt="logo"
              className="w-14 cover"
            />
          </Link>
        <nav className="flex flex-col opacity-80">
          <ul className="flex flex-col">
            <NavLink
              to={""}
              className={({ isActive }) => (isActive ? "border rounded-xl bg-[#1C4591] opacity-70" : "")}
            >
              <li className="flex items-center gap-2 p-3">
                <MdOutlineDashboard size={25} /> Tableau de bord
              </li>
            </NavLink>
            <NavLink to={"/Object-list"} className={({ isActive }) => (isActive ? "border rounded-xl bg-[#1C4591] opacity-70" : "")}>
              <li className="flex items-center gap-2 p-3">
                <HiOutlineCreditCard size={25} /> Tous les objets
              </li>
            </NavLink>
            <NavLink to={"/user-objects"} className={({ isActive }) => (isActive ? "border rounded-xl bg-[#1C4591] opacity-70" : "")}>
              <li className="flex items-center gap-2 p-3">
                <HiOutlineCreditCard size={25} /> Mes objets
              </li>
            </NavLink>
            <NavLink to={"/settings"} className={({ isActive }) => (isActive ? "border rounded-xl bg-[#1C4591] opacity-70" : "")}>
              <li className="flex items-center gap-2 p-3">
                <IoSettingsOutline size={25} /> Paramètres
              </li>
            </NavLink>
            <li>
              <button onClick={handleLogout} className="flex items-center gap-2 p-3">
                <HiOutlineLogout size={25} /> Se déconnecter
              </button>
            </li>
          </ul>
        </nav>
        <Link className="flex items-center gap-2 opacity-60 px-3">
          <IoHelpBuoyOutline size={25} /> Aide et supports
        </Link>
      </div>
    </div>
  );
};

export default SidBar;
