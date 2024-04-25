import { instance } from "../api/apiconfig";
import { useQuery } from "@tanstack/react-query";

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

const useFetchPostComments = (postId: string | undefined) => {
  const fetchPostsComments = async (postId: string | undefined) => {
    const res = await instance.get(`/posts/${postId}/comments`);
    return res.data;
  };
  const { data: postComments } = useQuery<IPostComments[]>({
    queryKey: ["posts", postId, "comments"],
    queryFn: () => fetchPostsComments(postId),
  });

  return { postComments };
};

export default useFetchPostComments;
