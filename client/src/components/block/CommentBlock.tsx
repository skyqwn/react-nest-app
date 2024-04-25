import { Link } from "react-router-dom";
import { FaRegHeart } from "react-icons/fa6";
import { IoCloseOutline } from "react-icons/io5";
import { MdOutlineEdit } from "react-icons/md";
import { FaHeart } from "react-icons/fa";

import { useAuthState } from "../../context/AuthContext";
import { IPostComments } from "../../hooks/useFetchPostComments";
import useCommentLike from "../../hooks/useCommentLike";
import useDisLikeComment from "../../hooks/useDisLikeComment";
import useDeleteComment from "../../hooks/useDeleteComment";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.locale("ko");
dayjs.extend(relativeTime);

interface CommentProps {
  comment: IPostComments;
  postId: string;
}

const CommentBlock = ({ comment, postId }: CommentProps) => {
  const { user } = useAuthState();
  const commentId = comment?.id;

  const isLike = comment.commentLikeUsers.includes(user?.id + "");

  const { commentLikeMutation } = useCommentLike({ commentId, postId });

  const { commentUnLikeMutation } = useDisLikeComment({ commentId, postId });

  const { deleteCommentMutation } = useDeleteComment({ commentId, postId });

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
                  onClick={() => deleteCommentMutation(comment.id)}
                />
                <MdOutlineEdit className="hover:text-blue-500 hover:bg-neutral-300  rounded-full cursor-pointer" />
              </div>
            )}
          </div>
          <div>{comment.comment}</div>
          {/* 좋아요 기능 */}
          <div className="hover:text-red-500 flex items-center justify-center gap-1 cursor-pointer">
            {isLike ? (
              <FaHeart
                className="text-red-500"
                onClick={() => commentUnLikeMutation(comment.id)}
              />
            ) : (
              <FaRegHeart onClick={() => commentLikeMutation(comment.id)} />
            )}
            <div>{comment.likeCount}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommentBlock;
