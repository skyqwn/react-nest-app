import { queryClient } from "..";

import { useMutation } from "@tanstack/react-query";
import { instance } from "../api/apiconfig";

const useDisLikeComment = ({
  commentId,
  postId,
}: {
  commentId: number;
  postId: string;
}) => {
  const commentDisLikeFunction = async (commentId: number) => {
    return await instance.delete(`likes/comments/${commentId}`);
  };

  const { mutate: commentUnLikeMutation } = useMutation({
    mutationFn: commentDisLikeFunction,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["posts", postId, "comments"],
      });
    },
  });

  return { commentUnLikeMutation };
};

export default useDisLikeComment;
