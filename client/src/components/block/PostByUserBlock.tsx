import React from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { IPostByUser } from "../../hooks/usePostByUser";
dayjs.locale("ko");
dayjs.extend(relativeTime);

const PostByUserBlock = ({ post }: { post: IPostByUser }) => {
  return (
    <Link key={post.id} to={`/posts/${post.id}`}>
      <div className="flex gap-6 items-center justify-between cursor-pointer">
        <h2 className="text-2xl font-semibold">{post.content}</h2>
        <span className="text-neutral-400 text-sm">
          {dayjs(post.createdAt).fromNow()}
        </span>
      </div>
    </Link>
  );
};

export default PostByUserBlock;
