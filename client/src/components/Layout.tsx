import React from "react";
import { FaHome } from "react-icons/fa";
import { FaRegMessage } from "react-icons/fa6";
import { IoPerson } from "react-icons/io5";
import { TbFriends } from "react-icons/tb";
import { Link } from "react-router-dom";

import { useAuthState } from "../context/AuthContext";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import usePopularPosts from "../hooks/usePopularPosts";
import useRecommendationUser from "../hooks/useRecommendationUser";
dayjs.locale("ko");
dayjs.extend(relativeTime);

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthState();

  const { isPopularPostLoading, popularPosts } = usePopularPosts();

  const { recommendationUsers } = useRecommendationUser();

  if (isPopularPostLoading) return <div>Loading..</div>;

  return (
    <div className="w-full h-full pt-14 max-w-screen-xl mx-auto flex">
      {/* Left */}
      <div className="flex w-[80px] h-full border-r-2  lg:justify-start md:w-[230px] lg:gap-5 lg:w-[220px] lg:py-2 lg:border-r-2 lg:sticky lg:left-0 ">
        {/* <div className="hidden lg:flex lg:flex-col lg:items-center lg:justify-start lg:gap-5 w-[220px] lg:py-2 lg:border-r-2 lg:sticky lg:left-0 "> */}
        <div className="flex flex-col items-center w-full h-full gap-10 mt-8  ">
          <Link to={"/"} className="md:nav-pill text-2xl">
            <FaHome /> <span className="hidden md:block">HOME</span>
          </Link>
          <Link to={"/chat"} className="md:nav-pill text-2xl">
            <FaRegMessage /> <span className="hidden md:block">CHAT</span>
          </Link>
          <Link to={"/alter"} className="md:nav-pill text-2xl">
            <TbFriends /> <span className="hidden md:block">Alter</span>
          </Link>
          <Link to={`/profile/${user?.id}`} className="md:nav-pill text-2xl">
            <IoPerson /> <span className="hidden md:block">PROFILE</span>
          </Link>
        </div>
      </div>
      {/* Center */}
      <div className="flex flex-col flex-1 p-2 max-w-screen-sm mx-auto md:w-[900px]">
        {children}
      </div>
      {/* Right */}
      <div className="md:flex md:flex-col lg:min-w-[260px] lg:border-l-2 lg:sticky hidden lg:right-0">
        <div className="hidden lg:block lg:max-w-72 lg:p-2 lg:border-2 lg:ml-10">
          <div className="mb-2 font-semibold text-xl">Popular Posts</div>
          {popularPosts?.map((post) => (
            <div className="">
              <Link
                to={`/posts/${post.id}`}
                key={post.id}
                className="flex gap-3 justify-between space-y-2 items-center"
              >
                <h1>{post.content}</h1>
                <span>{dayjs(post.createdAt).fromNow()}</span>
              </Link>
            </div>
          ))}
        </div>
        {user && (
          <div className="hidden lg:block max-w-72 p-2 border-2 ml-10 space-y-2 mt-2 ">
            <div className="mb-2 font-semibold text-xl">Recommend Users</div>
            {recommendationUsers?.map((user) => (
              <div
                className="flex items-center justify-between mb-10"
                key={user.id}
              >
                <>
                  <Link to={`/profile/${user.id}`}>
                    <div className="flex items-center gap-2">
                      <img
                        className="w-10 h-10 rounded-full"
                        src={user.avatar}
                        alt={user.nickname}
                      />
                      <span>{user.nickname}</span>
                    </div>
                  </Link>
                  <button onClick={() => console.log(1)}>Follow</button>
                </>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default Layout;
