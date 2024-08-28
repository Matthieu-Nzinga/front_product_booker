import React, { useState } from "react";
import { PiUserCircleLight } from "react-icons/pi";
import { NavLink, useNavigate } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { removeToken } from "../features/authUtils";
import { removeTokenAction } from "../features/auth/authSlice";
import logoImg from '../../public/logo.png';
import SondageForm from "./SondageForm";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";

const NavBar = () => {
  const [image] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // État de la modal
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    removeToken(); 
    dispatch(removeTokenAction()); 
    navigate('/'); 
  };

  return (
    <div className="h-20 bg-custom-gradient flex items-center justify-between px-4 sm:px-6 lg:px-[20%]">
      <div className="md:hidden">
        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="">
          <FiMenu size={30} />
        </button>
      </div>

      <nav className="flex items-center justify-between md:w-full">
        
        <ul className="hidden md:flex items-center gap-5 font-semibold text-base">
          <li>
            <NavLink to="">Produits</NavLink>
          </li>
          <li>
            <NavLink to="reservations">Mes réservations</NavLink>
          </li>
          <li>
            <NavLink to="panier">Mon panier</NavLink>
          </li>
          <li>
            <NavLink to="showSondage">Voir les sondages</NavLink>
          </li>
          <li>
            <button onClick={() => setIsModalOpen(true)}>Suggérer un produit</button>
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
            <div className="absolute right-0 top-full mt-2 w-48 bg-white shadow-lg rounded-md py-2 ">
              <NavLink to="/profil" className="block px-4 py-2 hover:bg-gray-100">Profil</NavLink>
              <button 
                onClick={handleLogout} 
                className="block px-4 py-2 w-full text-left hover:bg-gray-100"
              >
                Se déconnecter
              </button>
            </div>
          )}
        </div>
      </nav>

      <div className={`fixed top-0 left-0 h-full w-[75%] bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${isMenuOpen ? "translate-x-0" : "-translate-x-full"} md:hidden`}>
        <ul className="flex flex-col items-start gap-4 py-8 px-6 font-semibold text-base">
          <li>
            <NavLink to="" onClick={() => setIsMenuOpen(false)}>Produits</NavLink>
          </li>
          <li>
            <NavLink to="reservations" onClick={() => setIsMenuOpen(false)}>Mes réservations</NavLink>
          </li>
          <li>
            <NavLink to="panier" onClick={() => setIsMenuOpen(false)}>Mon panier</NavLink>
          </li>
          <li>
            <NavLink to="showSondage">Voir les sondages</NavLink>
          </li>
          <li>
            <button onClick={() => setIsModalOpen(true)} className="block py-2 w-full text-left hover:bg-gray-100">Suggérer un produit</button>
          </li>
          <li>
            <button 
                onClick={handleLogout} 
                className="block py-2 w-full text-left hover:bg-gray-100"
              >
                Se déconnecter
              </button>
          </li>
        </ul>
      </div>

      {/* Modal pour SondageForm */}
      <Modal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={{ width: '90%', maxWidth: 400, margin: 'auto', marginTop: '5%', padding: 2, backgroundColor: 'white', borderRadius: 2 }}>
          <SondageForm handleClose={() => setIsModalOpen(false)}  title="Votre suggestion"/>
        </Box>
      </Modal>
    </div>
  );
};

export default NavBar;
