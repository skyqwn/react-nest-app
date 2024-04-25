import { useMutation } from "@tanstack/react-query";
import { instance } from "../api/apiconfig";

export const useDisLikePosts = (refetch: () => void) => {
  const disLikeMutate = async (postId: number) => {
    await instance.delete(`likes/posts/${postId}`);
  };

  const { mutate: disLikePostMutation } = useMutation({
    mutationFn: disLikeMutate,
    onSuccess: () => refetch(),
  });

  return { disLikePostMutation };
};
