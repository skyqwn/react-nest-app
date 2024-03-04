import React from "react";
import { useNavigate } from "react-router-dom";
import { useCreatePost } from "../store/PostStroe";
import Container from "../components/Container";
import PostCreateModal from "../components/modals/PostCreateModal";

const Community = () => {
  const navigate = useNavigate();
  const { isOpen, onClose, onOpen } = useCreatePost();
  return (
    <Container>
      <PostCreateModal />
      <h1 className="w-12 bg-red-500" onClick={onOpen}>
        만들기
      </h1>
    </Container>
  );
};

export default Community;
