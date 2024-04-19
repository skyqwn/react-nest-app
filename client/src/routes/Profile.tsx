import { Link, useNavigate, useParams } from "react-router-dom";
import { IoCalendarOutline } from "react-icons/io5";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import Layout from "../components/Layout";
import { instance } from "../api/apiconfig";
import { useAuthState } from "../context/AuthContext";
import { useEditProfile } from "../store/ProfilStore";
import { useFollowerModal, useFollowingModal } from "../store/FollowStore";
import FollowingModal from "../components/modals/FollowingModal";
import FollowerModal from "../components/modals/FollowerModal";
import { useEffect, useState } from "react";
import { socket } from "../libs/socket";

dayjs.locale("ko");
dayjs.extend(relativeTime);

interface IProfile {
  id: number;
  createdAt: string;
  updatedAt: string;
  nickname: string;
  email: string;
  avatar: string;
  followerCount: number;
  followeeCount: number;
}

interface ILikePost {
  id: number;
  createdAt: string;
  content: string;
}

const Profile = () => {
  const { id } = useParams();
  const { user: loggedInUser } = useAuthState();
  const { onOpen: onFolloweModalOpen } = useFollowerModal();
  const { onOpen: onFollowingModalOpen } = useFollowingModal();
  const { onOpen } = useEditProfile();
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("create_chat_recive", (chatId: any) => {
      console.log(chatId);
      navigate(`/chat/${chatId}`);
    });
  }, []);

  console.log(socket.connected);

  const handleRequestSocket = () => {
    socket.emit("create_chat", { userIds: [loggedInUser?.id, +id!] });
  };

  const fetchUserProfile = async () => {
    const res = await instance.get(`/users/${id}`);

    return res.data;
  };

  const { data: user } = useQuery<IProfile>({
    queryKey: ["user", id],
    queryFn: fetchUserProfile,
  });

  const handleFollowing = async (id: number) => {
    const res = await instance.post(`/users/follow/${id}`);
    return res.data;
  };

  const { mutate } = useMutation({
    mutationFn: handleFollowing,
    onSuccess: () => {
      toast.success("팔로우 요청을 하였습니다.");
      refetch();
    },
  });

  const fetchFollowee = async () => {
    const res = await instance.get(`/users/followee/${id}`);
    return res.data;
  };

  const { data: fetchFollow, refetch } = useQuery({
    queryKey: ["user", "followee"],
    queryFn: fetchFollowee,
  });

  const fetchPostByUser = async (id: number) => {
    const res = await instance.get(`/users/postbyuser/${id}`);
    return res.data;
  };

  const { data: postByUser } = useQuery({
    queryKey: ["user", "postByUser", id],
    queryFn: () => fetchPostByUser(+id!),
  });

  const fetchPostByLikeUser = async (id: number) => {
    const res = await instance.get(`/users/postlikebyuser/${id}`);
    return res.data;
  };

  const { data: postByLikeUser } = useQuery({
    queryKey: ["user", "postByLikeUser", id],
    queryFn: () => fetchPostByLikeUser(+id!),
  });

  if (!user) return null;

  return (
    <Layout>
      <FollowingModal profileId={id!} />
      <FollowerModal profileId={id!} />
      <div className=" flex flex-col">
        <div className="flex justify-between items-end">
          <div className="mt-2 flex flex-col gap-2">
            <img className="size-32 rounded-full" src={user?.avatar} />
            <span className="text-lg">{user?.nickname}</span>
          </div>
          <div>
            {loggedInUser?.id === user?.id ? (
              <div
                onClick={onOpen}
                className="border rounded-xl  p-2 font-bold hover:bg-neutral-300 cursor-pointer transition"
              >
                Edit profile
              </div>
            ) : (
              <div className="flex gap-2 items-center ">
                <div
                  onClick={() => mutate(user?.id)}
                  className="border rounded-xl  p-2 font-bold hover:bg-neutral-300 cursor-pointer transition"
                >
                  {/* {followee.status === "default" ? "팔로잉" :followee.status === "pending" ? "요청됨" : "친구됨"} */}
                  {!fetchFollow
                    ? "팔로잉"
                    : fetchFollow.status === "PENDING"
                    ? "요청됨"
                    : "친구됨"}
                </div>
                {/* 누르면은 createChat 채팅 방을 생성해서 입장해야함 */}
                {/* <Link to={`/chat`}> */}
                <div
                  onClick={handleRequestSocket}
                  className="border rounded-xl p-2 font-bold hover:bg-neutral-300 cursor-pointer transition"
                >
                  메세지 보내기
                </div>
                {/* </Link> */}
              </div>
            )}
          </div>
        </div>
        <div className="text-neutral-500 text-sm flex items-center gap-1">
          <IoCalendarOutline /> joined{" "}
          {dayjs(user?.createdAt).format("MMMM YYYY")}
        </div>
        {/* 팔로잉 팔로워 */}
        <div className="flex gap-2 mt-1">
          <div
            className="flex gap-1 hover:cursor-pointer hover:underline"
            onClick={onFolloweModalOpen}
          >
            <p className="text-neutral-900 font-bold">{user?.followerCount}</p>
            <p className="text-neutral-500"> Followers</p>
          </div>
          <div
            className="flex gap-1 hover:cursor-pointer hover:underline"
            onClick={onFollowingModalOpen}
          >
            <p className="text-neutral-900 font-bold">{user?.followeeCount}</p>{" "}
            <p className="text-neutral-500">Following</p>
          </div>
        </div>
        {/* 글쓴이가 쓴 포스트들 */}
        <div className="flex flex-col gap-3 mt-6">
          <div>
            <span className="font-bold">{user.nickname}</span> 님이 쓴 포스터
          </div>
          <div>
            {postByUser?.map((post: any) => (
              <Link to={`/posts/${post.id}`}>
                <div
                  key={post.id}
                  className="flex gap-6 items-center justify-between cursor-pointer"
                >
                  <h2 className="text-2xl font-semibold">{post.content}</h2>
                  <span className="text-neutral-400 text-sm">
                    {dayjs(post.createdAt).fromNow()}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
        {/* 글쓴이가 좋아요 한 글들 */}
        <div className="flex flex-col gap-3 mt-6">
          <div>
            <span className="font-bold">{user.nickname}</span> 님이 좋아하는
            포스터
          </div>
          {postByLikeUser?.map((likepost: ILikePost) => (
            <Link to={`/posts/${likepost.id}`}>
              <div
                key={likepost.id}
                className="flex gap-6 items-center justify-between cursor-pointer "
              >
                <h2 className="text-2xl font-semibold">{likepost.content}</h2>
                <span className="text-neutral-400 text-sm">
                  {dayjs(likepost.createdAt).fromNow()}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
