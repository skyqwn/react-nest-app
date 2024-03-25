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

interface DetailPostStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useDetailPost = create<DetailPostStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
