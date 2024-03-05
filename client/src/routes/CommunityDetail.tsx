import { useQuery } from "@tanstack/react-query";
import React from "react";
import { instance } from "../api/apiconfig";
import { useParams } from "react-router-dom";

const CommunityDetail = () => {
  const { id } = useParams();

  const getPostDetail = async () => (await instance.get(`/posts/${id}`)).data;
  const {
    data: post,
    isPending,
    isError,
  } = useQuery<any>({
    queryKey: ["postDetail", id],
    queryFn: getPostDetail,
  });
  console.log(post);
  if (isPending) return <h6>loading..</h6>;
  if (isError) return <h3>error</h3>;
  // return <div>타이틀:</div>;
  return <div>타이틀: {post.title}</div>;
};

export default CommunityDetail;
