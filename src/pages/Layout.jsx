import React from "react";
import { Outlet } from "react-router-dom";
import SidBar from "../components/SidBar";

const Layout = () => {
  return (
    <div className="flex h-screen m-0 p-0">
      <div className="hidden lg:block w-[20%]">
        <SidBar />
      </div>
      <div className="w-full lg:w-[80%] m-0 p-0 h-full">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
