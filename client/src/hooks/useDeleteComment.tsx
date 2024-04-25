import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { queryClient } from "..";
import { instance } from "../api/apiconfig";

const useDeleteComment = ({
  commentId,
  postId,
}: {
  commentId: number;
  postId: string;
}) => {
  const deleteComment = async (commentId: number) => {
    if (window.confirm("정말 댓글을 삭제하시겠습니까?")) {
      await instance.delete(`/posts/${postId}/comments/${commentId}`);
      toast.success("삭제성공!");
    }
  };

  const { mutate: deleteCommentMutation } = useMutation({
    mutationFn: (commentId: number) => deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["posts", postId, "comments"],
      });
    },
  });
  return { deleteCommentMutation };
};

export default useDeleteComment;
