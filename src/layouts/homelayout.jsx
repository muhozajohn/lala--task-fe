import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar";
const Homelayout = () => {
  return (
    <div>
      <Navbar />

      <div className="px-20 w-[96%] mx-auto flex justify-center flex-col min-h-screen">
          <Outlet />
        </div>
    </div>
  );
};

export default Homelayout;
