import { create } from "zustand";

interface EditProfileState {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useEditProfile = create<EditProfileState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
