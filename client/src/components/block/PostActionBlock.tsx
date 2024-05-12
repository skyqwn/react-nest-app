import React from "react";
import { FaRegComment } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa6";
import { FaHeart } from "react-icons/fa";

import useLikePost from "../../hooks/useLikePost";
import { useDisLikePosts } from "../../hooks/useDisLikePosts";

interface PostActionBlockProps {
  postCommentCount: number | undefined;
  postLikeCount: number | undefined;
  postId?: number;
  isLike?: boolean;
  refetch: () => void;
}

const PostActionBlock = ({
  postCommentCount,
  postLikeCount,
  isLike,
  postId,
  refetch,
}: PostActionBlockProps) => {
  const { likePostMutation } = useLikePost(refetch);
  const { disLikePostMutation } = useDisLikePosts(refetch);

  return (
    <div className="flex justify-around my-2">
      <div className="flex items-center justify-center gap-2 hover:text-blue-500 cursor-pointer transition">
        <FaRegComment />
        <span>{postCommentCount}</span>
      </div>
      <div
        onClick={
          isLike
            ? (e: React.MouseEvent<HTMLElement>) => {
                e.stopPropagation();
                disLikePostMutation(+postId!);
              }
            : (e: React.MouseEvent<HTMLElement>) => {
                e.stopPropagation();
                likePostMutation(+postId!);
              }
        }
        className="flex items-center  justify-center gap-2 hover:text-red-500 cursor-pointer transition active:scale-150"
      >
        {isLike ? (
          <FaHeart className="text-red-500" />
        ) : (
          <FaRegHeart className="text-black" />
        )}
        <span>{postLikeCount}</span>
      </div>
    </div>
  );
};

export default PostActionBlock;
