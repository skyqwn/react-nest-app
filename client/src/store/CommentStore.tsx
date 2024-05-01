import { create } from "zustand";

// interface EditCommentStore {
//   isOpen: boolean;
//   onOpen: () => void;
//   onClose: () => void;
// }

// export const useEditComment = create<EditCommentStore>((set) => ({
//   isOpen: false,
//   onOpen: () => set({ isOpen: true }),
//   onClose: () => set({ isOpen: false }),
// }));

interface CommentEditStore {
  editCommentId: number | null;
  setEditCommentId: (id: number | null) => void;
}

export const useCommentEditStore = create<CommentEditStore>((set) => ({
  editCommentId: null,
  setEditCommentId: (id) => set({ editCommentId: id }),
}));
