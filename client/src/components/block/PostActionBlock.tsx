import { useMutation, useQuery } from "@tanstack/react-query";
import React from "react";
import { FaRegComment } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa6";
import { useParams } from "react-router-dom";
import { instance } from "../../api/apiconfig";
import { queryClient } from "../..";
import { IPost } from "../../types/PostsTypes";
import { cls } from "../../libs/util";

interface PostActionBlockProps {
  postCommentCount: number | undefined;
  postLikeCount: number | undefined;
  // postId?: number;
}

const PostActionBlock = ({
  postCommentCount,
  postLikeCount,
}: // postId,
PostActionBlockProps) => {
  const { postId } = useParams();
  const fetchAlreadyLike = async (postId: number) => {
    const res = await instance.get(`/likes/posts/${postId}`);
    return res.data;
  };

  const { data: isLike } = useQuery({
    queryKey: ["likes", "posts", postId],
    queryFn: () => fetchAlreadyLike(+postId!),
  });

  const likeMutate = async (postId: number) => {
    await instance.post(`/likes/posts/${postId}`);
  };

  const { mutate: likeMutation } = useMutation({
    mutationFn: likeMutate,
    onMutate: () => {
      const prev: IPost | undefined = queryClient.getQueryData([
        "posts",
        postId,
      ]);
      const prevIsLike: boolean | undefined = queryClient.getQueryData([
        "likes",
        "posts",
        postId,
      ]);
      const shallow = { ...prev, likeCount: +prev?.likeCount! + 1 };
      queryClient.setQueryData(["posts", postId], shallow);
      queryClient.setQueryData(["likes", "posts", postId], !prevIsLike);
    },
    onError: () => {
      const prev: IPost | undefined = queryClient.getQueryData([
        "posts",
        postId,
      ]);
      const prevIsLike: boolean | undefined = queryClient.getQueryData([
        "likes",
        "posts",
        postId,
      ]);
      const shallow = { ...prev, likeCount: +prev?.likeCount! - 1 };
      queryClient.setQueryData(["posts", postId], shallow);
      queryClient.setQueryData(["likes", "posts", postId], !prevIsLike);
    },
  });

  const disLikeMutate = async (postId: number) => {
    await instance.delete(`likes/posts/${postId}`);
  };

  const { mutate: disLikeMutation } = useMutation({
    mutationFn: disLikeMutate,
    onMutate: () => {
      const prev: IPost | undefined = queryClient.getQueryData([
        "posts",
        postId,
      ]);
      console.log(prev);
      const prevIsLike: boolean | undefined = queryClient.getQueryData([
        "likes",
        "posts",
        postId,
      ]);
      const shallow = { ...prev, likeCount: +prev?.likeCount! - 1 };
      queryClient.setQueryData(["posts", postId], shallow);
      queryClient.setQueryData(["likes", "posts", postId], !prevIsLike);
    },
    onError: () => {
      const prev: IPost | undefined = queryClient.getQueryData([
        "posts",
        postId,
      ]);
      const prevIsLike: boolean | undefined = queryClient.getQueryData([
        "likes",
        "posts",
        postId,
      ]);
      const shallow = { ...prev, likeCount: +prev?.likeCount! + 1 };
      queryClient.setQueryData(["posts", postId], shallow);
      queryClient.setQueryData(["likes", "posts", postId], !prevIsLike);
    },
  });
  return (
    <div className="flex justify-around mt-2 mb-2 ">
      <div className="flex items-center justify-center gap-2 hover:text-blue-500 cursor-pointer transition">
        <FaRegComment />
        <span>{postCommentCount}</span>
      </div>
      <div
        onClick={
          isLike
            ? (e: React.MouseEvent<HTMLElement>) => {
                e.stopPropagation();
                disLikeMutation(+postId!);
              }
            : (e: React.MouseEvent<HTMLElement>) => {
                e.stopPropagation();
                likeMutation(+postId!);
              }
        }
        className="flex items-center  justify-center gap-2 hover:text-red-500 cursor-pointer transition active:scale-150"
      >
        <FaRegHeart className={cls(isLike ? "text-red-500" : "text-black")} />
        <span>{postLikeCount}</span>
      </div>
    </div>
  );
};

export default PostActionBlock;
