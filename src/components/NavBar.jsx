import React, { useState } from "react";
import { PiUserCircleLight } from "react-icons/pi";
import { NavLink } from "react-router-dom";

const NavBar = () => {
  const image = useState(false);
  return (
    <div className="h-20 bg-custom-gradient flex items-center justify-between px-[15%]">
      <h2 className="font-black text-2xl text-customBlue ">LOGO</h2>
      <nav className="flex items-center gap-10">
        <ul className="flex items-center gap-10 text-customGray font-semibold text-base">
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
        <div className="flex justify-end w-full md:w-auto">
          {image ? (
            <PiUserCircleLight size={55} color="gray" />
          ) : (
            <img src="" alt="" />
          )}
        </div>
      </nav>
    </div>
  );
};

export default NavBar;
