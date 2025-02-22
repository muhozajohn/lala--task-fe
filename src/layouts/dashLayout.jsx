import React from "react";
import { Outlet } from "react-router-dom";
import DashNav from "../components/dashNav";
const DashLayout = () => {
  return (
    <div className="px-5">
      <DashNav />
      <Outlet />
    </div>
  );
};

export default DashLayout;
