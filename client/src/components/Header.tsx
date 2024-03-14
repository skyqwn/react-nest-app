import React, { useContext } from "react";
import Container from "./Container";
import { Link } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { FaSearch } from "react-icons/fa";
import { authStore } from "../store/AuthStore";

const Header = () => {
  const { isOpen, onOpen, onClose, isLogged } = authStore();
  const { auth, onSignout, loading } = useContext(UserContext) as any;

  if (loading) {
    return <>Loading...</>;
  }

  return (
    <div className=" h-14  fixed inset-x-0 top-0 z-10 px-8 hover:border-gray-700 ">
      <div className="h-full flex items-center justify-between mx-auto">
        <Link to={"/"}>
          <div>Home</div>
        </Link>

        <div className="max-w-full px-4">
          <div className="relative flex items-center bg-gray-100 border rounded  hover:bg-white focus:outline-none">
            <FaSearch className="ml-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search."
              className="px-3 py-1 bg-transparent rounded h-7 focus:outline-none"
            />
          </div>
        </div>
        <div className=" flex gap-5 items-center">
          <div>
            {auth ? (
              <div className="flex  items-center justify-center gap-4">
                <div className="size-10 rounded-full bg-slate-500" />
                <div onClick={onSignout}>로그아웃</div>
              </div>
            ) : (
              <span
                className="bg-orange-600 py-2 px-3 rounded-3xl text-white hover:bg-orange-800 text-md cursor-pointer"
                onClick={onOpen}
              >
                Log In
              </span>
            )}
          </div>
        </div>
      </div>
      <div className="h-[1px] bg-slate-200 rounded-lg" />
    </div>
  );
};

export default Header;
