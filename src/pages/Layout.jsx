import React from "react";
import { Outlet } from "react-router-dom";
import SidBar from "../components/SidBar";

const Layout = () => {
  return (
    <div className="flex">
      <SidBar />
      <div className="w-full">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
