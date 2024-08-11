import React from "react";
import { Outlet } from "react-router-dom";
import SidBar from "../components/SidBar";

const Layout = () => {
  return (
    <div className="flex">
      
      <SidBar/>
        <Outlet />
    
    </div>
  );
};

export default Layout;
