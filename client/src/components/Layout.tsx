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

const Layout = ({ children }: React.PropsWithChildren) => {
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
    // container
    <div className="flex items-stretch mt-2 overflow-x-hidden">
      {/* leftSectionWrapper */}
      <header className="flex items-end flex-col flex-grow">
        {/* lefrSection */}
        <section className="w-80 h-dvh ">
          {/* leftSectionFixed */}
          <div className="fixed w-80 h-dvh flex flex-col items-center border-r-2 ">
            <div>HOme</div>
            <nav className="flex-1">
              <ul>
                <li>
                  <Link to={"/"}>
                    <div className="flex items-center gap-3">
                      <FaHome /> <span>HOME</span>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link to={"/explore"}>
                    <div className="flex items-center gap-3">
                      <SlMagnifier /> <span>EXPLORE</span>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link to={"/messages"}>
                    <div className="flex items-center gap-3">
                      <RiMessage2Line /> <span>MESSAGES</span>
                    </div>
                  </Link>
                </li>
                <li>
                  <Link to={"/profile"}>
                    <div className="flex items-center gap-3">
                      <IoPerson /> <span>PROFILE</span>
                    </div>
                  </Link>
                </li>
              </ul>
              <button>게시하기</button>
            </nav>
            <div className=" flex gap-5 items-center p-4">
              <div>
                {!loading && authenticated ? (
                  <div className="flex  items-center justify-center gap-4">
                    <UserAvatar />
                    <div>{user?.nickname}</div>
                    <div
                      className="bg-orange-600 py-2 px-3 rounded-3xl text-white hover:bg-orange-800 text-md cursor-pointer text-xs sm:text-base"
                      onClick={handleLogOut}
                    >
                      로그아웃
                    </div>
                  </div>
                ) : (
                  <span
                    className="bg-orange-600 py-2 px-3 rounded-3xl text-white hover:bg-orange-800 text-md cursor-pointer"
                    onClick={onOpen}
                  >
                    로그인
                  </span>
                )}
              </div>
            </div>
          </div>
        </section>
      </header>
      <div className="flex items-start h-dvh flex-col flex-grow">
        <div className=" h-dvh w-[990px] flex justify-between">
          <main className="w-[600px] h-full ">{children}</main>
          <section className=" h-full w-[350px] border-l-2">
            <div className="max-w-full px-4">
              <div className="relative  flex items-center bg-gray-100 border rounded-3xl  hover:bg-white focus:outline-none">
                <FaSearch className="ml-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search."
                  className="px-3 py-5 bg-transparent rounded h-7 focus:outline-none"
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Layout;
