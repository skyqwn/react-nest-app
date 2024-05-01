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
    <div className="w-full h-full pt-14 max-w-screen-xl mx-auto lg:flex">
      {/* Left */}
      <div className="hidden lg:flex lg:flex-col lg:items-center lg:justify-start lg:gap-5 w-[220px] lg:py-2 lg:border-r-2 lg:sticky lg:left-0 ">
        <Link to={"/"} className="nav-pill">
          <FaHome /> <span>HOME</span>
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
      <div className="flex flex-col flex-1 p-2 max-w-screen-sm mx-auto md:w-[900px]">
        {children}
      </div>
      {/* Right */}
      <div className="flex flex-col w-[220px] md:border-l-2 md:sticky md:right-0">
        <div className="hidden md:block md:max-w-72 md:p-2">
          <div className="mb-2 font-semibold text-xl">Popular Posts</div>
          {popularPosts?.map((post) => (
            <Link
              to={`/posts/${post.id}`}
              key={post.id}
              className="flex gap-3 justify-between space-y-2 items-center"
            >
              <h1>{post.content}</h1>
              <span>{dayjs(post.createdAt).fromNow()}</span>
            </Link>
          ))}
        </div>
        {user && (
          <div className="hidden md:block md:max-w-72 md:p-2 space-y-2">
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
