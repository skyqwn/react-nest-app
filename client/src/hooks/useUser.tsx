import React from "react";
import { instance } from "../api/apiconfig";
import { useQuery } from "@tanstack/react-query";

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

const useUser = (id: number) => {
  const fetchUserProfile = async () => {
    const res = await instance.get(`/users/${id}`);

    return res.data;
  };

  const { data: user } = useQuery<IProfile>({
    queryKey: ["user", id],
    queryFn: fetchUserProfile,
  });

  return { user };
};

export default useUser;
