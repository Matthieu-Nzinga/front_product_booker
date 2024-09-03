import React, { useState } from "react";
import { PiUserCircleLight } from "react-icons/pi";
import {  useDispatch } from "react-redux";
import {  NavLink, useNavigate } from "react-router-dom";
import { removeToken } from "../features/authUtils";
import { removeTokenAction } from "../features/auth/authSlice";
import { Accordion, AccordionDetails, AccordionSummary, Drawer, IconButton } from "@mui/material";
import { MdOutlineDashboard } from "react-icons/md";
import { GiCardboardBoxClosed} from "react-icons/gi";
import { LuShoppingCart, LuUsers2 } from "react-icons/lu";
import { IoIosLogOut } from "react-icons/io";
import { setFilteredRole } from "../features/products/products";
import { RiSurveyLine } from "react-icons/ri";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';


const Header = ({ text }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [image] = useState(false); 
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeLink, setActiveLink] = useState(""); // État pour gérer le lien actif


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


  const handleRoleChangeAdmin = () => {
    dispatch(setFilteredRole("Admin"));
    setActiveLink("admin"); // Met à jour le lien actif
  };

  const handleRoleChangeClient = () => {
    dispatch(setFilteredRole("Client"));
    setActiveLink("client"); // Met à jour le lien actif
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
        {/* <button className="hidden md:block">
          <IoNotificationsOutline size={30} color="black" />
        </button> */}
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
              {/* <NavLink to="/parametres" className="block px-4 py-2 hover:bg-gray-100 text-left">Paramètres</NavLink> */}
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
            className="flex items-center gap-2 p-3  hover:bg-gray-100"
            onClick={handleMenuToggle}
          >
            <MdOutlineDashboard size={25} /> Tableau de bord
          </NavLink>
          <NavLink
            to="/products"
            className="flex items-center gap-2 p-3  hover:bg-gray-100"
            onClick={handleMenuToggle}
          >
            <GiCardboardBoxClosed size={25} /> Produits 
          </NavLink>
          <NavLink
            to="/Commandes"
            className="flex items-center gap-2 p-3  hover:bg-gray-100"
            onClick={handleMenuToggle}
          >
            <LuShoppingCart size={25} /> Commandes
          </NavLink>
          <NavLink
            to="/utilisateurs"
            className="flex items-center gap-2 p-3  hover:bg-gray-100"
            onClick={handleMenuToggle}
          >
            <LuUsers2 size={25} /> Utilisateurs
          </NavLink>
          <Accordion
            className="border rounded-xl bg-transparent"
            disableGutters
            sx={{
              backgroundColor: 'transparent',
              boxShadow: 'none',
              border: 'none'
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon className="text-black" />}
              aria-controls="panel1a-content"
              id="panel1a-header"
              Style={{ pandding: 0 }}
              sx={{
                backgroundColor: 'transparent',
                boxShadow: 'none'
              }}
            >
              <li className="flex items-center gap-2 p-3 w-full">
                <RiSurveyLine size={25} /> Sondages
              </li>
            </AccordionSummary>
            <AccordionDetails className="pl-4">
              <ul className="flex flex-col gap-2">
                <NavLink to="/sondage">
                  <li
                    className={`cursor-pointer p-2 rounded-xl ${activeLink === "client" ? "bg-customBlue text-white" : "hover:bg-customBlue"}`}
                    onClick={handleRoleChangeClient}
                  >
                    Suggestions des clients
                  </li>
                </NavLink>
                <NavLink to="/sondage">
                  <li
                    className={`cursor-pointer p-2 rounded-xl ${activeLink === "admin" ? "bg-customBlue text-white" : "hover:bg-customBlue"}`}
                    onClick={handleRoleChangeAdmin}
                  >
                    Vos sondages
                  </li>
                </NavLink>
              </ul>
            </AccordionDetails>
          </Accordion>
          <button
            onClick={handleLogout}
            className={({ isActive }) =>
              isActive ? "border rounded-xl bg-customBlue text-white" : ""
            }

          >
            <li className="flex items-center gap-2 p-3">
              <IoIosLogOut size={25} />   Se déconnecter
            </li>

          </button>
        </div>
      </Drawer>
    </header>
  );
};

export default Header;
