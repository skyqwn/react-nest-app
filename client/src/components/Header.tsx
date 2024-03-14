import React, { useContext } from "react";
import Container from "./Container";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const Header = () => {
  const { onSignout, auth } = useContext(UserContext) as any;
  return (
    <div className="bg-[#a29bfe] h-14  fixed inset-x-0 top-0 z-10 ">
      <div className="h-full flex items-center justify-between mx-auto">
        <Link to={"/"}>
          <div>Home</div>
        </Link>
        <div className=" flex gap-5 items-center">
          <Link to={"/post"}>
            <div>커뮤니티</div>
          </Link>
          <Link to={"/gallery"}>
            <div>갤러리 </div>
          </Link>
          <Link to={"/profile"}>
            <div className="p-5 rounded-full bg-slate-700"></div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Header;
