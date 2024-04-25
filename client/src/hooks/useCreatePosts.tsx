import { FieldValues } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { instance } from "../api/apiconfig";
import { queryClient } from "..";

const useCreatePosts = () => {
  const createPost = async (data: FieldValues) => {
    await instance.post("/posts", data);
  };

  const { mutate: createPostMutate, isPending } = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("생성성공");
      //   onClose();
    },
  });
  return { createPostMutate };
};

export default useCreatePosts;
