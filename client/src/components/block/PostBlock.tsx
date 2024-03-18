import React from "react";
import { Link } from "react-router-dom";
import { IPost } from "../../routes/Posts";

const PostBlock = ({ post }: { post: IPost }) => {
  return (
    <div className="h-32 bg-red-200 mb-10">
      <Link to={`${post.id}`}>
        <h1>{post.title}</h1>
        <h3>{post.author.nickname}</h3>
      </Link>
    </div>
  );
};

export default PostBlock;
