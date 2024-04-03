import React from "react";
import { IPostComments } from "./PostCommentBlock";

import { FaRegHeart } from "react-icons/fa6";
import { IoCloseOutline } from "react-icons/io5";
import { MdOutlineEdit } from "react-icons/md";
import { FaHeart } from "react-icons/fa";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useAuthState } from "../../context/AuthContext";
import { queryClient } from "../..";
import { useMutation, useQuery } from "@tanstack/react-query";
import { instance } from "../../api/apiconfig";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
dayjs.locale("ko");
dayjs.extend(relativeTime);

interface CommentProps {
  comment: IPostComments;
  postId: string;
}

const CommentBlock = ({ comment, postId }: CommentProps) => {
  const { user } = useAuthState();

  const fetchAlreadyCommentLike = async (commentId: number) => {
    const res = await instance.get(`/likes/comments/alreadyLike/${commentId}`);
    return res.data;
  };

  const { data: alreadyCommentLike } = useQuery({
    queryKey: ["comment", "alreadyLike"],
    queryFn: () => fetchAlreadyCommentLike(comment.id),
  });

  const isLike = !!alreadyCommentLike?.find(
    (v: any) => v.author.id === user?.id
  );

  const test = async (commentId: number) => {
    const res = await instance.get(
      `posts/:postId/comments/already/${commentId}`
    );
    return res.data;
  };

  const { data: textAlready } = useQuery({
    queryKey: ["comment", "alreadyLike"],
    queryFn: () => test(comment.id),
  });

  //   console.log(alreadyCommentLike.find(user?.id));

  const commentLikeFunction = async (commentId: number) => {
    return instance.post(`likes/comments/${commentId}`);
  };

  const { mutate: commentLikeMutation } = useMutation({
    mutationFn: commentLikeFunction,
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

  const deleteComment = async (commentId: number) => {
    if (window.confirm("정말 댓글을 삭제하시겠습니까?")) {
      await instance.delete(`/posts/${postId}/comments/${commentId}`);
      toast.success("삭제성공!");
    }
  };

  const { mutate: deleteCommentMutate } = useMutation({
    mutationFn: (commentId: number) => deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["posts", postId, "comments"],
      });
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["posts", postId] });
      const prev: any = queryClient.getQueryData(["posts", postId]);
      const shallow = { ...prev, commentCount: prev.commentCount - 1 };
      queryClient.setQueryData(["posts", postId], shallow);
    },
    onError(error) {
      const prev: any = queryClient.getQueryData(["posts", postId]);
      const shallow = { ...prev, commentCount: prev.commentCount + 1 };
      queryClient.setQueryData(["posts", postId], shallow);
    },
  });

  return (
    <div className=" flex flex-col mt-2" key={comment.id}>
      <div className="flex gap-3 w-full h-full  ">
        <Link to={`/profile/${comment.author.id}`}>
          <div className="size-10 ">
            <img
              className="rounded-full size-10"
              src={comment?.author?.avatar}
            />
          </div>
        </Link>
        <div className="flex flex-1 gap-1 items-start flex-col w-full ">
          <div className="flex gap-2 items-center w-full justify-between md:w-[380px] md:justify-start">
            <div className="flex gap-2 items-center">
              <div>{comment.author.nickname}</div>
              <div className="text-xs text-neutral-400">{`@ ${comment.author.nickname}`}</div>
              <div className="text-xs text-neutral-400">
                {dayjs(comment.createdAt).fromNow()}
              </div>
            </div>
            {user?.nickname === comment.author.nickname && (
              <div className=" flex items-center p-1 justify-center gap-2 ">
                <IoCloseOutline
                  className=" ml-10 hover:text-red-500 hover:bg-neutral-300 text-lg  rounded-full cursor-pointer "
                  onClick={() => deleteCommentMutate(comment.id)}
                />
                <MdOutlineEdit className="hover:text-blue-500 hover:bg-neutral-300  rounded-full cursor-pointer" />
              </div>
            )}
          </div>
          <div>{comment.comment}</div>
          {/* 좋아요 기능 */}
          <div
            onClick={() => commentLikeMutation(comment.id)}
            className="hover:text-red-500 flex items-center justify-center gap-1 cursor-pointer"
          >
            {isLike ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
            {/* <FaRegHeart /> */}
            <div>{comment.likeCount}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentBlock;
