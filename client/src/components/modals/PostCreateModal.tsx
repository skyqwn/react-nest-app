import React, { useEffect } from "react";
import toast from "react-hot-toast";

import Modal from "./Modal";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { Input } from "../Input";
import { useCreatePost } from "../../store/PostStroe";
import TextArea from "../Inputs/TextArea";
import { instance } from "../../api/apiconfig";
import { QueryClient, useMutation } from "@tanstack/react-query";
import { queryClient } from "../..";

const defaultValues = {
  title: "",
  content: "",
  // category: "FREE",
};

interface CreatePostProps {
  title: string;
  content: string;
}

const PostCreateModal = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues,
  });
  const { isOpen, onClose } = useCreatePost();

  const createPost = async (post: CreatePostProps) =>
    await instance.post("/posts", post);
  const randomPost = async (post: CreatePostProps) =>
    await instance.post("/posts/random", post);

  const { mutate, isPending } = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      toast.success("생성성공");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      onClose();
    },
  });
  const { mutate: randomMutate, isPending: randomPending } = useMutation({
    mutationFn: createPost,
    onSuccess: () => {
      toast.success("생성성공");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      onClose();
    },
  });

  const onValid: SubmitHandler<FieldValues> = async (data) => {
    const { title, content } = data;
    mutate({ title, content });
  };

  const body = (
    <div className="space-y-5">
      <Input name="title" control={control} label="제목" />
      <TextArea name="content" control={control} errors={errors} label="본문" />
    </div>
  );

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        label="커뮤니티 글쓰기"
        actionLabel="제출"
        onAction={handleSubmit(onValid)}
        body={body}
        secondActionLabel="취소"
        secondAction={onClose}
        disabled={isPending}
      />
    </>
  );
};

export default PostCreateModal;
