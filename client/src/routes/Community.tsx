import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCreatePost } from "../store/PostStroe";
import Container from "../components/Container";
import PostCreateModal from "../components/modals/PostCreateModal";
import { useQuery } from "@tanstack/react-query";
import { instance } from "../api/apiconfig";
import PostBlock from "../components/block/PostBlock";

const Community = () => {
  const navigate = useNavigate();
  const { onOpen } = useCreatePost();

  const fetchPosts = () => instance.get("/posts");

  const { data: posts, isPending } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
  });
  console.log(posts);
  return (
    <Container>
      <PostCreateModal />
      <h1 className="w-12 bg-red-500" onClick={onOpen}>
        만들기
      </h1>
      {posts?.data.map((post: any) => (
        <div key={post.id} className="bg-red-200 mb-3">
          <PostBlock post={post} />
        </div>
      ))}
    </Container>
  );
};

export default Community;
