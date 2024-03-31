import { useParams } from "react-router-dom";
import Layout from "../components/Layout";
import { useMutation, useQuery } from "@tanstack/react-query";
import { instance } from "../api/apiconfig";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useAuthState } from "../context/AuthContext";

import { IoCalendarOutline } from "react-icons/io5";
import toast from "react-hot-toast";
import { queryClient } from "..";
import { useState } from "react";

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

interface IFollowConfirm {
  avatar: string;
  createdAt: string;
  id: number;
  isConfirmed: boolean;
  updatedAt: string;
  standByConfirm: boolean;
}

const Profile = () => {
  const { id } = useParams();
  const { user: loggedInUser } = useAuthState();

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

  const { mutate, data } = useMutation({
    mutationFn: handleFollowing,
    onSuccess: () => {
      toast.success("팔로우 요청을 하였습니다.");
    },
    onMutate: () => {
      const value: IFollowConfirm | undefined = queryClient.getQueryData([
        "user",
        "followee",
      ]);
      console.log(value);
      const shallow = { ...value, isConfirmed: true };
      queryClient.setQueryData(["user", "followee"], shallow);
      console.log(shallow);
    },
  });

  const fetchFollowee = async () => {
    const res = await instance.get(`/users/followee/${id}`);
    return res.data;
  };

  const { data: followee } = useQuery({
    queryKey: ["user", "followee"],
    queryFn: fetchFollowee,
  });

  if (!user) return null;

  return (
    <Layout>
      <div className=" flex flex-col">
        <div className="flex justify-between items-end">
          <div className="mt-2 flex flex-col gap-2">
            <img className="size-32 rounded-full" src={user?.avatar} />
            <span className="text-lg">{user?.nickname}</span>
          </div>
          <div>
            {loggedInUser?.id === user?.id ? (
              <button className="border rounded-xl  p-2 font-bold hover:bg-neutral-300 cursor-pointer transition">
                Edit profile
              </button>
            ) : (
              <div
                onClick={() => mutate(user.id)}
                className="border rounded-xl  p-2 font-bold hover:bg-neutral-300 cursor-pointer transition"
              >
                {followee?.standByConfirm ? "요청됨" : "팔로잉"}
              </div>
            )}
          </div>
        </div>
        <div className="text-neutral-500 text-sm flex items-center gap-1">
          <IoCalendarOutline /> joined{" "}
          {dayjs(user?.createdAt).format("MMMM YYYY")}
        </div>
        <div className="flex gap-2 mt-1">
          <div className="flex gap-1 hover:cursor-pointer hover:underline">
            <p className="text-neutral-900 font-bold">{user?.followeeCount}</p>{" "}
            <p className="text-neutral-500">Following</p>
          </div>
          <div className="flex gap-1 hover:cursor-pointer hover:underline">
            <p className="text-neutral-900 font-bold">{user?.followerCount}</p>
            <p className="text-neutral-500"> Followers</p>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
