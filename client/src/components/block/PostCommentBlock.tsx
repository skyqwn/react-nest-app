import { useParams } from "react-router-dom";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import CommentBlock from "./CommentBlock";
import useFetchPostComments from "../../hooks/useFetchPostComments";
dayjs.locale("ko");
dayjs.extend(relativeTime);

const PostCommentBlock = () => {
  const { postId } = useParams();

  const { postComments } = useFetchPostComments(postId);

  return (
    <div>
      {postComments?.map((comment) => (
        <CommentBlock key={comment.id} comment={comment} postId={postId!} />
      ))}
    </div>
  );
};

export default PostCommentBlock;
