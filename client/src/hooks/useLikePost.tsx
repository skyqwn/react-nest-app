import { useMutation } from "@tanstack/react-query";
import React from "react";
import { instance } from "../api/apiconfig";

const useLikePost = (refetch: () => void) => {
  const likeMutate = async (postId: number) => {
    await instance.post(`/likes/posts/${postId}`);
  };

  const { mutate: likePostMutation } = useMutation({
    mutationFn: likeMutate,
    onSuccess: () => refetch(),
  });

  return { likePostMutation };
};

export default useLikePost;
