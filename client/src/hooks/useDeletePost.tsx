import React from "react";
import { queryClient } from "..";
import { instance } from "../api/apiconfig";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const useDeletePost = (postId: number) => {
  const navigate = useNavigate();
  const deletePost = async (postId: number) => {
    if (window.confirm("정말 이 게시물을 삭제하시겠습니까?")) {
      await instance.delete(`/posts/${postId}`);
      toast.success("삭제성공!");
      navigate("/");
    }
  };

  const { mutate: deletePostMutation } = useMutation({
    mutationFn: (postId: number) => deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
    },
  });
  return { deletePostMutation };
};

export default useDeletePost;
