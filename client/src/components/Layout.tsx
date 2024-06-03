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

const NavIcon = ({ item }: { item: any }) => {
  return (
    <Link
      className=" cursor-pointer text-2xl p-3 md:py-2 lg:px-1 lg:py-2 group w-full"
      to={item.to}
    >
      <div className="group-hover:bg-neutral-200 rounded-full size-10 md:w-5/6 md:justify-between flex items-center justify-center transition">
        {item.component}
      </div>
    </Link>
  );
};

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuthState();
  const itemsArray = [
    {
      to: "/",
      component: (
        <>
          <FaHome /> <span className="hidden md:block">HOME</span>
        </>
      ),
    },
    {
      to: "/chat",
      component: (
        <>
          <FaRegMessage /> <span className="hidden md:block">CHAT</span>
        </>
      ),
    },
    {
      to: "/alter",
      component: (
        <>
          <TbFriends /> <span className="hidden md:block">Alter</span>
        </>
      ),
    },
    {
      to: `/profile/${user?.id}`,
      component: (
        <>
          <IoPerson /> <span className="hidden md:block">PROFILE</span>
        </>
      ),
    },
  ];

  const { isPopularPostLoading, popularPosts } = usePopularPosts();

  const { recommendationUsers } = useRecommendationUser();

  if (isPopularPostLoading) return <div>Loading..</div>;

  return (
    <div className="w-screen h-screen pt-14 max-w-screen-xl mx-auto ">
      <div className="flex h-full overflow-y-auto relative ">
        {/* Left */}
        <div className="flex lg:h-full border-r-2 lg:border-none lg:justify-start md:w-[230px] lg:gap-5 lg:w-[220px] lg:py-2 lg:border-r-2 sticky left-0 top-0">
          <div className="flex flex-col items-center  w-full h-full mt-4 ">
            {itemsArray.map((item, index: number) => (
              <NavIcon item={item} key={index} />
            ))}
          </div>
        </div>
        {/* Center */}
        <div className="flex flex-col lg:h-[calc[100-dvh-56px]] flex-1 p-2 max-w-screen-sm mx-auto md:w-[900px]">
          {children}
        </div>
        {/* Right */}
        <div className="md:flex lg:h-fit md:flex-col lg:min-w-[260px] lg:sticky hidden right-0 top-0 lg:mt-2">
          <div className="hidden lg:block lg:max-w-72 lg:p-2 lg:border-2 lg:ml-10">
            <div className="mb-2 font-semibold text-xl">Popular Posts</div>
            {popularPosts?.map((post) => (
              <div key={post.id}>
                <Link
                  to={`/posts/${post.id}`}
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
                  </>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Layout;
