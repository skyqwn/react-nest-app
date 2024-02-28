import React from "react";
import Container from "./Container";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <div className="bg-[#a29bfe] h-14">
      <Container>
        <div className="h-full flex items-center justify-between mx-auto">
          <Link to={"/"}>
            <div>Home</div>
          </Link>
          <div className=" flex gap-5 items-center">
            <Link to={"/community"}>
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
      </Container>
    </div>
  );
};

export default Header;
