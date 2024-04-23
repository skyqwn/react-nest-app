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
import { useEffect } from "react";
import { socket } from "../libs/socket";
import usePostByUser from "../hooks/usePostByUser";
import useUser from "../hooks/useUser";
import usePostLikeByUser from "../hooks/usePostLikeByUser";
import ProfilPostLikeByUser from "../components/block/ProfilPostLikeByUser";
import PostByUserBlock from "../components/block/PostByUserBlock";

dayjs.locale("ko");
dayjs.extend(relativeTime);

const Profile = () => {
  const { id } = useParams();
  const { user: loggedInUser } = useAuthState();
  const { onOpen: onFolloweModalOpen } = useFollowerModal();
  const { onOpen: onFollowingModalOpen } = useFollowingModal();
  const { onOpen } = useEditProfile();
  const navigate = useNavigate();

  useEffect(() => {
    socket.on("create_chat_recive", (chatId: any) => {
      navigate(`/chat/${chatId}`);
    });
  }, []);

  const handleRequestSocket = () => {
    socket.emit("create_chat", {
      userIds: [loggedInUser?.id, +id!],
    });
  };

  const { user } = useUser(+id!);

  const { postByUser } = usePostByUser(+id!);

  const { postByLikeUser } = usePostLikeByUser(+id!);

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
            {postByUser?.map((post) => (
              <PostByUserBlock post={post} />
            ))}
          </div>
        </div>
        {/* 글쓴이가 좋아요 한 글들 */}
        <div className="flex flex-col gap-3 mt-6">
          <div>
            <span className="font-bold">{user.nickname}</span> 님이 좋아하는
            포스터
          </div>
          {postByLikeUser?.map((likepost) => (
            <ProfilPostLikeByUser likepost={likepost} />
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
