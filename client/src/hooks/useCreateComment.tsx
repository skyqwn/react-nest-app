import { FieldValues, UseFormReset } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { instance } from "../api/apiconfig";
import { queryClient } from "..";
import { IPost } from "./usePostDetail";

interface IUseCreateCommentProps {
  postId: string | undefined;
  reset: UseFormReset<FieldValues>;
}

const useCreateComment = ({ postId, reset }: IUseCreateCommentProps) => {
  const createComment = async (data: FieldValues) => {
    await instance.post(`/posts/${postId}/comments`, data);
  };

  const { mutate: createCommentMutate, isPending } = useMutation({
    mutationFn: createComment,
    onSuccess: () => {
      toast.success("댓글 생성 성공");
      queryClient.invalidateQueries({
        queryKey: ["posts", postId, "comments"],
      });
      reset({ comment: "" });
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["posts", postId] });
      const prev: IPost | undefined = queryClient.getQueryData([
        "posts",
        postId,
      ]);
      const shallow = { ...prev, commentCount: prev?.commentCount! + 1 };
      queryClient.setQueryData(["posts", postId], shallow);
    },
    onError(error) {
      const prev: any = queryClient.getQueryData(["posts", postId]);
      const shallow = { ...prev, commentCount: prev.commentCount - 1 };
      queryClient.setQueryData(["posts", postId], shallow);
    },
  });

  return { createCommentMutate };
};

export default useCreateComment;
