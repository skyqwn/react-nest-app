import React from "react";
import { instance } from "../api/apiconfig";
import { useQuery } from "@tanstack/react-query";

export interface IFollowUser {
  avatar: string;
  createdAt: string;
  email: string;
  followeeCount: number;
  followerCount: number;
  id: number;
  nickname: string;
  provider: string;
  role: string;
  updatedAt: string;
}

interface IFollow {
  email: string;
  id: number;
  isConfirmed: boolean;
  nickname: string;
  avatar: string;
  status: "PENDING" | "CONFIRMED";
  followee: IFollowUser;
  follower: IFollowUser;
}

const useFollowers = () => {
  const fetchFollowers = async () => {
    const res = await instance.get(`users/requestFollow/me`);
    return res.data;
  };

  const { data: requsetFollower, refetch } = useQuery<IFollow[]>({
    queryKey: ["follower", "me"],
    queryFn: fetchFollowers,
  });
  return { requsetFollower, refetch };
};

export default useFollowers;
