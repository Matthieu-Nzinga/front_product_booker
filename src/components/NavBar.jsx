import React, { useState } from "react";
import { PiUserCircleLight } from "react-icons/pi";
import { NavLink, useNavigate } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { removeToken } from "../features/authUtils";
import { removeTokenAction } from "../features/auth/authSlice";

const NavBar = () => {
  const [image] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); 
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    removeToken(); 
    dispatch(removeTokenAction()); 
    navigate('/'); 
  };

  return (
    <div className="h-20 bg-custom-gradient flex items-center justify-between px-4 sm:px-6 lg:px-[15%]">
     
      <div className="md:hidden">
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-customGray">
          <FiMenu size={30} />
        </button>
      </div>
      <h2 className="hidden md:block font-black text-2xl text-customBlue">LOGO</h2>
      
      <nav className="flex items-center gap-10">
        
        <ul className="hidden md:flex items-center gap-10 text-customGray font-semibold text-base">
          <li>
            <NavLink to="">Produits</NavLink>
          </li>
          <li>
            <NavLink to="reservations">Mes reservations</NavLink>
          </li>
          <li>
            <NavLink to="panier">Mon panier</NavLink>
          </li>
        </ul>
        <div className="relative flex items-center">
          
          <div className="flex justify-end">
            {image ? (
              <img 
                src="votre-image.jpg" 
                alt="User" 
                className="w-10 h-10 rounded-full cursor-pointer" 
                onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
              />
            ) : (
              <PiUserCircleLight 
                size={55} 
                color="gray" 
                className="cursor-pointer"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)} 
              />
            )}
          </div>
          
          {isDropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-48 bg-white shadow-lg rounded-md py-2 text-customGray">
              <NavLink to="/profil" className="block px-4 py-2 hover:bg-gray-100">Profil</NavLink>
              <NavLink to="/parametres" className="block px-4 py-2 hover:bg-gray-100">Paramètres</NavLink>
              <button 
                onClick={handleLogout} 
                className="block px-4 py-2 w-full text-left hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </nav>
      
      
      <div className={`fixed top-0 left-0 h-full w-[75%] bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${isMenuOpen ? "translate-x-0" : "-translate-x-full"} md:hidden`}>
        <ul className="flex flex-col items-start gap-4 py-8 px-6 text-customGray font-semibold text-base">
          <li>
            <NavLink to="" onClick={() => setIsMenuOpen(false)}>
              Produits
            </NavLink>
          </li>
          <li>
            <NavLink to="reservations" onClick={() => setIsMenuOpen(false)}>
              Mes reservations
            </NavLink>
          </li>
          <li>
            <NavLink to="panier" onClick={() => setIsMenuOpen(false)}>
              Mon panier
            </NavLink>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default NavBar;
