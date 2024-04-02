import { useMutation, useQuery } from "@tanstack/react-query";
import { instance } from "../../api/apiconfig";
import { useParams } from "react-router-dom";

import { queryClient } from "../..";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import CommentBlock from "./CommentBlock";
dayjs.locale("ko");
dayjs.extend(relativeTime);

export interface IPostComments {
  author: {
    avatar: string;
    nickname: string;
    id: string;
  };
  comment: string;
  createdAt: string;
  updatedAt: string;
  id: number;
  likeCount: number;
  commentLikeUsers: string[];
}

const PostCommentBlock = () => {
  const { postId } = useParams();

  const fetchPostsComments = async () => {
    const res = await instance.get(`/posts/${postId}/comments`);
    return res.data;
  };
  const { data: postComments } = useQuery({
    queryKey: ["posts", postId, "comments"],
    queryFn: fetchPostsComments,
  });

  return (
    <div>
      {postComments?.map((comment: IPostComments) => (
        <CommentBlock key={comment.id} comment={comment} postId={postId!} />
      ))}
    </div>
  );
};

export default PostCommentBlock;
