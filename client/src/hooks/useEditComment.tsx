import { useCommentEditStore } from "../store/CommentStore";

export const useEditComment = () => {
  const { editCommentId, setEditCommentId } = useCommentEditStore();

  const openEditComment = (commentId: number) => {
    setEditCommentId(commentId);
  };

  const closeEditComment = () => {
    setEditCommentId(null);
  };

  return {
    editCommentId,
    openEditComment,
    closeEditComment,
  };
};
