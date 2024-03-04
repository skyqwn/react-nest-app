import React from "react";
import { Link } from "react-router-dom";

const PostBlock = ({ post }: { post: any }) => {
  return (
    <div>
      <Link to={`${post.id}`}>
        <h1>{post.title}</h1>
      </Link>
    </div>
  );
};

export default PostBlock;
