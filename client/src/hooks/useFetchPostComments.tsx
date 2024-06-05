import { instance } from "../api/apiconfig";
import { UseQueryResult, useQueries, useQuery } from "@tanstack/react-query";

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
const fetchPostsComments = async (postId: string | undefined) => {
  const res = await instance.get(`/posts/${postId}/comments`);
  return res.data;
};

// const useFetchPostComments = (postId: string | undefined) => {
//   const { data: postComments } = useQuery<IPostComments[]>({
//     queryKey: ["posts", postId, "comments"],
//     queryFn: () => fetchPostsComments(postId),
//   });

//   return { postComments };
// };
const useFetchPostComments = (postIds: string[]) => {
  const queries = postIds.map((postId) => ({
    queryKey: ["posts", postId, "comments"],
    queryFn: () => fetchPostsComments(postId),
  }));

  const results = useQueries({
    queries,
  }) as UseQueryResult<IPostComments[], Error>[];

  const postComments = results.map((result) => result.data);

  return { postComments, results };
};

export default useFetchPostComments;
