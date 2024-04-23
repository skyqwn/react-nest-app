import { useQuery } from "@tanstack/react-query";
import React from "react";
import { instance } from "../api/apiconfig";

export interface IPostByUser {
  commentCount: number;
  content: string;
  createdAt: string;
  id: number;
  images: string[];
  likeCount: number;
  likeUsers: string[];
  title: string;
  updatedAt: string;
}

const usePostByUser = (id: number) => {
  const fetchPostByUser = async (id: number) => {
    const res = await instance.get(`/users/postbyuser/${id}`);
    return res.data;
  };

  const { data: postByUser, isLoading: isPostByUserLoading } = useQuery<
    IPostByUser[]
  >({
    queryKey: ["user", "postByUser", id],
    queryFn: () => fetchPostByUser(+id!),
  });
  return { postByUser, isPostByUserLoading };
};

export default usePostByUser;
