import { create } from "zustand";

interface CreatePostStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useCreatePost = create<CreatePostStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

interface EditPostStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useEditPost = create<EditPostStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
