import { Link } from "react-router-dom";
import { IPostByUser } from "../../hooks/usePostByUser";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.locale("ko");
dayjs.extend(relativeTime);

const PostByUserBlock = ({ post }: { post: IPostByUser }) => {
  return (
    <Link key={post.id} to={`/posts/${post.id}`}>
      <div className="flex gap-6 items-center justify-between cursor-pointer">
        <h2 className="text-lg sm:text-2xl font-semibold">{post.content}</h2>
        <span className="text-neutral-400 text-xs sm:text-sm">
          {dayjs(post.createdAt).fromNow()}
        </span>
      </div>
    </Link>
  );
};

export default PostByUserBlock;
