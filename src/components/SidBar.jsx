import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { MdOutlineDashboard } from "react-icons/md";
import { GiCardboardBoxClosed } from "react-icons/gi";
import { LuShoppingCart, LuUsers2 } from "react-icons/lu";
import { useDispatch } from "react-redux";
import { removeToken } from "../features/authUtils";
import { removeTokenAction } from "../features/auth/authSlice";
import { IoIosLogOut } from "react-icons/io";
import logoImg from '../../public/logo.png';
import { RiSurveyLine } from "react-icons/ri";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { setFilteredRole } from "../features/products/products";

const SidBar = () => {
  const [activeLink, setActiveLink] = useState(""); // État pour gérer le lien actif

  const navigate = useNavigate();
  const dispatch = useDispatch();

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
    <div className="w-[20%] h-screen bg-custom-gradient text-black px-6 py-8 text-base font-normal flex flex-col justify-between fixed">
      <div className="flex flex-col gap-12">
        <img src={logoImg} alt="Logo" className='mb-4 h-20 w-20 mx-auto' />
        <nav>
          <ul className="flex flex-col">
            <NavLink
              to=""
              className={({ isActive }) =>
                isActive ? "border rounded-xl bg-customBlue text-white" : ""
              }
            >
              <li className="flex items-center gap-2 p-3">
                <MdOutlineDashboard size={25} /> Tableau de bord
              </li>
            </NavLink>
            <NavLink
              to="/products"
              className={({ isActive }) =>
                isActive ? "border rounded-xl bg-customBlue text-white" : ""
              }
            >
              <li className="flex items-center gap-2 p-3">
                <GiCardboardBoxClosed size={25} /> Produits
              </li>
            </NavLink>
            <NavLink
              to="/Commandes"
              className={({ isActive }) =>
                isActive ? "border rounded-xl bg-customBlue text-white" : ""
              }
            >
              <li className="flex items-center gap-2 p-3">
                <LuShoppingCart size={25} /> Commandes
              </li>
            </NavLink>
            <NavLink
              to="/utilisateurs"
              className={({ isActive }) =>
                isActive ? "border rounded-xl bg-customBlue text-white" : ""
              }
            >
              <li className="flex items-center gap-2 p-3">
                <LuUsers2 size={25} /> Utilisateurs
              </li>
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
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default SidBar;
