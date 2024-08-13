import React, { useState } from "react";
import { IoNotificationsOutline } from "react-icons/io5";
import { PiUserCircleLight } from "react-icons/pi";
import { useSelector, useDispatch } from "react-redux";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { removeToken } from "../features/authUtils";
import { removeTokenAction } from "../features/auth/authSlice";
import { Drawer, IconButton } from "@mui/material";
import { FiMenu } from "react-icons/fi";
import { MdOutlineDashboard } from "react-icons/md";
import { GiCardboardBoxClosed, GiCardboardBox } from "react-icons/gi";
import { LuShoppingCart, LuUsers2 } from "react-icons/lu";
import { IoSettingsOutline } from "react-icons/io5";
import { IoHelpBuoyOutline } from "react-icons/io5";

const Header = ({ text }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [image] = useState(false); 
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDropdownToggle = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleMenuToggle = () => {
    setMenuOpen(!menuOpen);
  };

  const handleLogout = () => {
    removeToken();
    dispatch(removeTokenAction());
    navigate('/');
  };

  return (
    <header className="fixed top-0 w-full md:w-[80%] bg-white z-50 p-4 md:p-6 flex items-center justify-between">
      
      <div className="block md:hidden">
        <IconButton
          onClick={handleMenuToggle}
          
          aria-label="Open menu"
        >
          <svg
            stroke="currentColor"
            fill="none"
            strokeWidth="2"
            viewBox="0 0 24 24"
            strokeLinecap="round"
            strokeLinejoin="round"
            height="30"
            width="30"
            xmlns="http://www.w3.org/2000/svg"
          >
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </IconButton>
        </div>

      <div className="flex-1 flex justify-center md:justify-start">
        <h1 className="text-xl md:text-2xl font-extrabold hidden md:block">{text}</h1>
      </div>

   
      <div className="flex items-center gap-4">
        <button className="hidden md:block">
          <IoNotificationsOutline size={30} color="black" />
        </button>
        <button onClick={handleDropdownToggle} className="relative">
          {image ? (
            <img
              src=""
              alt="User"
              className="w-10 h-10 rounded-full"
            />
          ) : (
            <PiUserCircleLight
              size={55}
              color="gray"
            />
          )}
          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-300 shadow-lg rounded-lg">
              <NavLink to="/profil" className="block px-4 py-2 hover:bg-gray-100 text-left">Profil</NavLink>
              <NavLink to="/parametres" className="block px-4 py-2 hover:bg-gray-100 text-left">Paramètres</NavLink>
              <button
                onClick={handleLogout}
                className="block px-4 py-2 w-full text-left hover:bg-gray-100"
              >
                Se déconnecter
              </button>
            </div>
          )}
        </button>
      </div>

     
      <Drawer
        anchor="left"
        open={menuOpen}
        onClose={handleMenuToggle}
        className="md:hidden"
      >
        <div className="p-4 w-64">
          <NavLink
            to="/"
            className="flex items-center gap-2 p-3 text-customGray hover:bg-gray-100"
            onClick={handleMenuToggle}
          >
            <MdOutlineDashboard size={25} /> Tableau de bord
          </NavLink>
          <NavLink
            to="/products"
            className="flex items-center gap-2 p-3 text-customGray hover:bg-gray-100"
            onClick={handleMenuToggle}
          >
            <GiCardboardBoxClosed size={25} /> Produits
          </NavLink>
          <NavLink
            to="/Commandes"
            className="flex items-center gap-2 p-3 text-customGray hover:bg-gray-100"
            onClick={handleMenuToggle}
          >
            <LuShoppingCart size={25} /> Commandes
          </NavLink>
          <NavLink
            to="/stock"
            className="flex items-center gap-2 p-3 text-customGray hover:bg-gray-100"
            onClick={handleMenuToggle}
          >
            <GiCardboardBox size={25} /> Gestion de stock
          </NavLink>
          <NavLink
            to="/utilisateurs"
            className="flex items-center gap-2 p-3 text-customGray hover:bg-gray-100"
            onClick={handleMenuToggle}
          >
            <LuUsers2 size={25} /> Utilisateurs
          </NavLink>
          <NavLink
            to="/parameters"
            className="flex items-center gap-2 p-3 text-customGray hover:bg-gray-100"
            onClick={handleMenuToggle}
          >
            <IoSettingsOutline size={25} /> Paramètres
          </NavLink>
          <Link
            to="/aide"
            className="flex items-center gap-2 p-3 text-customGray hover:bg-gray-100 mt-auto"
            onClick={handleMenuToggle}
          >
            <IoHelpBuoyOutline size={25} /> Aide et supports
          </Link>
        </div>
      </Drawer>
    </header>
  );
};

export default Header;
