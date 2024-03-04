import { useQuery } from "@tanstack/react-query";
import React from "react";
import { instance } from "../api/apiconfig";
import { useParams } from "react-router-dom";

// export const getComments: QueryFunction<
//   Post[],
//   [_1: string, _2: string, _3: string]
// > = async ({ queryKey }) => {
//   const [_1, id] = queryKey;
//   const res = await fetch(`http://localhost:9090/api/posts/${id}`, {
//     next: {
//       tags: ["posts", id, "comments"],
//     },
//     cache: "no-store",
//   });

//   if (!res.ok) {
//     throw new Error("Failed to fetch data");
//   }

//   return res.json();
// };

const CommunityDetail = () => {
  const { id } = useParams();

  const getPostDetail = () => instance.get(`/posts/${id}`);
  const { data: post, isPending } = useQuery<any>({
    queryKey: ["postDetail", id],
    queryFn: getPostDetail,
  });

  console.log(post.data.post.title);

  if (isPending) return <h6>loading..</h6>;

  return <div>타이틀: {post.data.post.title}</div>;
};

export default CommunityDetail;
