import React from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FaHome, FaSearch } from "react-icons/fa";
import { SlMagnifier } from "react-icons/sl";
import { RiMessage2Line } from "react-icons/ri";
import { IoPerson } from "react-icons/io5";

import { useAuthDispatch, useAuthState } from "../context/AuthContext";
import UserAvatar from "./block/UserAvatar";
import { authStore } from "../store/AuthStore";
import { instance } from "../api/apiconfig";
import LoginModal from "./modals/LoginModal";

const Layout2 = ({ children }: { children: React.ReactNode }) => {
  const { authenticated, loading } = useAuthState();
  const { user } = useAuthState();
  const { onOpen } = authStore();
  const dispatch = useAuthDispatch();
  const handleLogOut = () => {
    instance
      .post("/auth/logout")
      .then(() => {
        dispatch("LOGOUT");
        toast.success("로그아웃");
      })
      .catch((error) => {
        console.log(error);
      });
  };
  return (
    <div className="w-dvw h-dvh mt-14 px-8 max-w-screen-xl mx-auto">
      <div className="h-[1px] bg-slate-200 rounded-lg" />
      <div className="md:flex ">
        {/* Left */}
        <div className="hidden lg:flex lg:flex-col lg:items-center lg:justify-start lg:gap-5 w-[220px] lg:py-2 lg:border-r-2">
          <Link to={"/"} className="nav-pill">
            <FaHome /> <span>HOME</span>
          </Link>
          <Link to={"/explore"} className="nav-pill">
            <SlMagnifier /> <span>EXPLORE</span>
          </Link>
          <Link to={"/messages"} className="nav-pill">
            <RiMessage2Line /> <span>MESSAGES</span>
          </Link>
          <Link to={"/profile"} className="nav-pill">
            <IoPerson /> <span>PROFILE</span>
          </Link>
        </div>
        {/* Center */}
        <div className="flex flex-col p-4 max-w-screen-md mx-auto md:w-[800px]">
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

export default Layout2;
