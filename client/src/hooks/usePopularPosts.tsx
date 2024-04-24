import React from "react";
import { instance } from "../api/apiconfig";
import { useQuery } from "@tanstack/react-query";

interface IPopularPost {
  id: number;
  createdAt: string;
  content: string;
}
const usePopularPosts = () => {
  const fetchPopularPost = async () => {
    const res = await instance.get("posts/popular");
    return res.data;
  };

  const { data: popularPosts, isLoading: isPopularPostLoading } = useQuery<
    IPopularPost[]
  >({
    queryKey: ["popluar", "posts"],
    queryFn: fetchPopularPost,
  });

  return { popularPosts, isPopularPostLoading };
};

export default usePopularPosts;
