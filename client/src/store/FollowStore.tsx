import { create } from "zustand";

interface FollowingStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useFollowingModal = create<FollowingStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

interface FollowerStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useFollowerModal = create<FollowerStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
