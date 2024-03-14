import React from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useCreatePost } from "../store/PostStroe";
import Container from "../components/Container";
import PostCreateModal from "../components/modals/PostCreateModal";
import { useQuery } from "@tanstack/react-query";
import { instance } from "../api/apiconfig";
import PostBlock from "../components/block/PostBlock";

const Community = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { onOpen } = useCreatePost();

  const fetchPosts = async () => {
    // const res = await instance.get("/posts");
    const res = await instance.get(
      "/posts?order__createdAt=DESC&take=10&where__id__less_than=200"
    );
    return res.data;
  };
  const { data: posts, isPending } = useQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
    // queryFn: (curosr) => fetchPosts(),
  });
  // console.log(posts.cursor.after);
  return (
    <Container>
      <PostCreateModal />
      <h1 className="w-12 bg-red-500" onClick={onOpen}>
        만들기
      </h1>

      {posts?.data.map((post: any) => (
        <div key={post.id} className="bg-red-200 mb-3 h-32">
          <PostBlock post={post} />
        </div>
      ))}
    </Container>
  );
};

export default Community;
