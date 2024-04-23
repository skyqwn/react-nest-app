import { useQuery } from "@tanstack/react-query";
import { instance } from "../api/apiconfig";
import { IAuhor } from "../types/PostsTypes";

export interface IPost {
  id: number;
  createdAt: string;
  updatedAt: string;
  title: string;
  content: string;
  likeCount: string;
  commentCount: string;
  author: IAuhor;
  images: string[];
  likeUsers: string[];
}

const usePostDetail = (postId: number) => {
  const fetchPostsDetail = async () => {
    const res = await instance.get(`/posts/${postId}`);
    return res.data;
  };

  const { data: postDetail, refetch } = useQuery<IPost>({
    queryKey: ["posts", postId],
    queryFn: fetchPostsDetail,
  });

  return { postDetail, refetch };
};

export default usePostDetail;
