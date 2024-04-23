import { Link } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { ILikePost } from "../../hooks/usePostLikeByUser";
dayjs.locale("ko");
dayjs.extend(relativeTime);

const ProfilPostLikeByUser = ({ likepost }: { likepost: ILikePost }) => {
  return (
    <Link key={likepost.id} to={`/posts/${likepost.id}`}>
      <div className="flex gap-6 items-center justify-between cursor-pointer ">
        <h2 className="text-2xl font-semibold">{likepost.content}</h2>
        <span className="text-neutral-400 text-sm">
          {dayjs(likepost.createdAt).fromNow()}
        </span>
      </div>
    </Link>
  );
};

export default ProfilPostLikeByUser;
