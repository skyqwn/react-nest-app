import React from "react";
import { instance } from "../api/apiconfig";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "..";
import { IPostComments } from "./useFetchPostComments";

const useCommentLike = ({
  commentId,
  postId,
}: {
  commentId: number;
  postId: string;
}) => {
  const commentLikeFunction = async (commentId: number) => {
    return await instance.post(`likes/comments/${commentId}`);
  };

  const { mutate: commentLikeMutation } = useMutation({
    mutationFn: commentLikeFunction,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["posts", postId, "comments"],
      });
    },
    onMutate: (variables) => {
      const prev: IPostComments[] | undefined = queryClient.getQueryData([
        "posts",
        postId,
        "comments",
      ]);
      const index = prev?.findIndex((v) => v.id === variables) as number;
      if (prev) {
        const shallow = [...prev];
        shallow[index] = {
          ...shallow[index],
          likeCount: shallow[index].likeCount + 1,
        };

        queryClient.setQueryData(["posts", postId, "comments"], shallow);
      }
    },
    onError: (variables) => {
      const prev: IPostComments[] | undefined = queryClient.getQueryData([
        "posts",
        postId,
        "comments",
      ]);
      //@ts-ignore
      const index = prev?.findIndex((v) => v.id === variables) as number;
      if (prev) {
        const shallow = [...prev];
        shallow[index] = {
          ...shallow[index],
          likeCount: shallow[index].likeCount - 1,
        };

        queryClient.setQueryData(["posts", postId, "comments"], shallow);
      }
    },
  });
  return { commentLikeMutation };
};

export default useCommentLike;
