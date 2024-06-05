import { useParams } from "react-router-dom";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import CommentBlock from "./CommentBlock";
import useFetchPostComments from "../../hooks/useFetchPostComments";
dayjs.locale("ko");
dayjs.extend(relativeTime);

// const PostCommentBlock = () => {
const PostCommentBlock = ({ postIds }: { postIds: string[] }) => {
  const { postId } = useParams();

  // const { postComments } = useFetchPostComments(postId);
  const { postComments, results } = useFetchPostComments(postIds);

  if (results.some((result) => result.isLoading)) {
    return <div>Loading...</div>;
  }
  if (results.some((result) => result.isError)) {
    return <div>Error</div>;
  }

  return (
    <div>
      {postComments.map((comments, index) => (
        <div key={postIds[index]}>
          {comments?.map((comment) => (
            <CommentBlock
              key={comment.id}
              comment={comment}
              postId={postIds[index]}
            />
          ))}
        </div>
      ))}
      {/* {postComments?.map((comment) => (
        <CommentBlock key={comment.id} comment={comment} postId={postId!} />
      ))} */}
    </div>
  );
};

export default PostCommentBlock;
