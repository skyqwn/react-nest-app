import React from "react";
import Layout from "../components/Layout";
import { instance } from "../api/apiconfig";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { queryClient } from "..";
import { useAuthState } from "../context/AuthContext";

interface IFollow {
  email: string;
  id: number;
  isConfirmed: false;
  nickname: string;
  avatar: string;
}

const Alter = () => {
  const { user: loggedInUser } = useAuthState();

  const fetchFollowers = async () => {
    const res = await instance.get(`/users/follow/me?includeNotConfirmed=true`);
    return res.data;
  };

  const { data: followerList } = useQuery({
    queryKey: ["follower", "me"],
    queryFn: fetchFollowers,
  });

  const confirmFollower = async (id: number) => {
    await instance.patch(`/users/follow/${id}/confirm`);
  };

  const { mutate } = useMutation({
    mutationFn: confirmFollower,
    onSuccess: () => {
      toast.success("팔로우 승낙");
      queryClient.invalidateQueries({
        queryKey: ["follower", "me"],
      });
    },
  });

  const followerConfirm = async () => {
    const res = await instance.get(`/users/follow/me/confirm`);
    return res.data;
  };

  const { data: confrimFollowList } = useQuery({
    queryKey: ["follower", "confirm", "me"],
    queryFn: followerConfirm,
  });

  const deleteFollowHandler = async (id: number) => {
    await instance.delete(`/users/follow/${id}`);
  };

  const { mutate: deleteFollowMutate } = useMutation({
    mutationFn: deleteFollowHandler,
    onSuccess: () => {
      toast.success("팔로우 삭제");
      queryClient.invalidateQueries({
        queryKey: ["follower", "me"],
      });
    },
  });

  const fetchFollowee = async () => {
    const res = await instance.get(`/users/followee/me`);
    return res.data;
  };

  const { data: followeeList } = useQuery({
    queryKey: ["follwee", "me"],
    queryFn: fetchFollowee,
  });

  return (
    <Layout>
      <div className="flex flex-col gap-6 p-3">
        <h2>팔로워 요청</h2>
        {followeeList?.length === 0 && <div>팔로우 요청이 없습니다.</div>}
        {followerList?.map((follower: IFollow, i: number) => (
          <div key={i} className="flex gap-4 mt-2 justify-between">
            <>
              <div className="flex items-center gap-2">
                <img className="size-10 rounded-full" src={follower.avatar} />
                <span>{follower.nickname}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    mutate(follower.id);
                  }}
                  className="bg-orange-500 w-14 h-10 rounded-2xl text-white hover:bg-orange-600 transition"
                >
                  확인
                </button>
                <button className="bg-neutral-200 w-14 h-10 rounded-2xl hover:bg-neutral-300 transition">
                  삭제
                </button>
              </div>
            </>
          </div>
        ))}
      </div>

      <div>
        <div>나를 팔로워 한 사람들</div>
        <div>
          {confrimFollowList?.map((follower: IFollow, i: number) => (
            <div key={i} className="flex gap-4 mt-2 justify-between">
              <div className="flex items-center gap-2">
                <img className="size-10 rounded-full" src={follower.avatar} />
                <span>{follower.nickname}</span>
              </div>
              <button
                onClick={() => deleteFollowMutate(follower.id)}
                className="bg-orange-500 w-24 h-10 rounded-2xl text-white hover:bg-orange-600 transition"
              >
                팔로잉 취소
              </button>
            </div>
          ))}
        </div>
      </div>
      <div>
        <div>내가 팔로잉 한 사람들</div>
        <div>
          {followeeList?.map((follower: IFollow, i: number) => (
            <div key={i} className="flex gap-4 mt-2 justify-between">
              <div className="flex items-center gap-2">
                <img className="size-10 rounded-full" src={follower.avatar} />
                <span>{follower.nickname}</span>
              </div>
              <button
                onClick={() => deleteFollowMutate(follower.id)}
                className="bg-orange-500 w-24 h-10 rounded-2xl text-white hover:bg-orange-600 transition"
              >
                팔로잉 취소
              </button>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Alter;
