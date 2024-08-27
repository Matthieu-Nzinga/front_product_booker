import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { MdOutlineDashboard } from "react-icons/md";
import { GiCardboardBoxClosed} from "react-icons/gi";
import { LuShoppingCart, LuUsers2 } from "react-icons/lu";
import { useDispatch } from "react-redux";
import { removeToken } from "../features/authUtils";
import { removeTokenAction } from "../features/auth/authSlice";
import { IoIosLogOut } from "react-icons/io";
import logoImg from '../../public/logo.png';
import { RiSurveyLine } from "react-icons/ri";
<RiSurveyLine />

const SidBar = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = () => {
    removeToken();
    dispatch(removeTokenAction());
    navigate('/');
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
              to="/stock"
              className={({ isActive }) =>
                isActive ? "border rounded-xl bg-customBlue text-white" : ""
              }
            >
              {/* <li className="flex items-center gap-2 p-3">
                <GiCardboardBox size={25} /> Gestion de stock
              </li> */}
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
            <NavLink
              to="/sondage"
              className={({ isActive }) =>
                isActive ? "border rounded-xl bg-customBlue text-white" : ""
              }
            >
              <li className="flex items-center gap-2 p-3">
              <RiSurveyLine size={25}/> Sondage
              </li>
            </NavLink>
            
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
