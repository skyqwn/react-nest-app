import { Link, useNavigate } from "react-router-dom";
import { FaSearch } from "react-icons/fa";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import qs from "query-string";

import { useAuthDispatch, useAuthState } from "../context/AuthContext";
import { authStore } from "../store/AuthStore";
import { instance } from "../api/apiconfig";
import UserAvatar from "./block/UserAvatar";

import { SiNestjs } from "react-icons/si";
import { TbBrandReact } from "react-icons/tb";
import { useState } from "react";

const Header = () => {
  const { onOpen } = authStore();
  const { authenticated, loading } = useAuthState();
  const [term, setTerm] = useState("");
  const dispatch = useAuthDispatch();
  const navigate = useNavigate();

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTerm(e.target.value);
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const query = { term };
    const url = qs.stringifyUrl({ url: "/search", query });
    navigate(url);
  };

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

  if (loading) return <>Loading...</>;

  return (
    <div className="border-b-[1px] h-14 w-full fixed inset-x-0 top-0 p-2 bg-white z-10">
      <div className=" max-w-screen-xl mx-auto">
        <div className="h-full flex items-center justify-between mx-auto">
          <Link to={"/"}>
            <div className="  rounded-full flex items-center justify-center gap-2">
              <TbBrandReact className="text-2xl" /> &
              <SiNestjs className="text-2xl" />
            </div>
          </Link>

          <div className="max-w-full px-4">
            <form
              onSubmit={onSubmit}
              className="relative flex items-center bg-gray-100 border rounded hover:bg-white focus:outline-none"
            >
              <button type="submit">
                <FaSearch className="ml-4 text-gray-400" />
              </button>
              <input
                value={term}
                onChange={onChange}
                type="text"
                placeholder="Search..."
                className="px-3 py-1 bg-transparent rounded h-7 focus:outline-none"
              />
            </form>
          </div>

          <div className=" flex gap-5 items-center">
            <div>
              {!loading && authenticated ? (
                <div className="flex  items-center justify-center gap-4">
                  <UserAvatar />
                  {/* <div className="size-10 rounded-full bg-slate-500" /> */}
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
      </div>
    </div>
  );
};

export default Header;
