import React from "react";
import { Link } from "react-router-dom";
import { FaHome } from "react-icons/fa";
import { TbFriends } from "react-icons/tb";
import { SlMagnifier } from "react-icons/sl";
import { IoPerson } from "react-icons/io5";
import { FaRegMessage } from "react-icons/fa6";

import { useAuthDispatch, useAuthState } from "../context/AuthContext";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user, authenticated } = useAuthState();
  const dispatch = useAuthDispatch();

  return (
    <div className="w-dvw h-dvh mt-14 px-8 max-w-screen-xl mx-auto">
      <div className="md:flex ">
        {/* Left */}
        <div className="hidden lg:flex lg:flex-col lg:items-center lg:justify-start lg:gap-5 w-[220px] lg:py-2 lg:border-r-2">
          <Link to={"/"} className="nav-pill">
            <FaHome /> <span>HOME</span>
          </Link>
          <Link to={"/explore"} className="nav-pill">
            <SlMagnifier /> <span>EXPLORE</span>
          </Link>
          <Link to={"/chat"} className="nav-pill">
            <FaRegMessage /> <span>CHAT</span>
          </Link>
          <Link to={"/alter"} className="nav-pill">
            <TbFriends /> <span>Alter</span>
          </Link>
          <Link to={`/profile/${user?.id}`} className="nav-pill">
            <IoPerson /> <span>PROFILE</span>
          </Link>
        </div>
        {/* Center */}
        <div className="flex flex-col p-2 max-w-screen-sm mx-auto md:w-[900px] ">
          {children}
        </div>
        {/* Right */}
        <div className="hidden md:block md:max-w-72 md:border-l-2 md:p-2">
          POPULAR COMMUNITYLIST
        </div>
      </div>
    </div>
  );
};

export default Layout;
