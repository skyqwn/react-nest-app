import { create } from "zustand";

interface AuthModalState {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const authStore = create<AuthModalState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
