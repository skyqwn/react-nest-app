import React from "react";
import { instance } from "../api/apiconfig";
import { useQuery } from "@tanstack/react-query";

export interface ILikePost {
  id: number;
  createdAt: string;
  content: string;
}

const usePostLikeByUser = (id: number) => {
  const fetchPostByLikeUser = async (id: number) => {
    const res = await instance.get(`/users/postlikebyuser/${id}`);
    return res.data;
  };

  const { data: postByLikeUser } = useQuery<ILikePost[]>({
    queryKey: ["user", "postByLikeUser", id],
    queryFn: () => fetchPostByLikeUser(+id!),
  });

  return { postByLikeUser };
};

export default usePostLikeByUser;
