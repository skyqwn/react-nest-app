import { create } from "zustand";
import axios from "axios";

interface AuthState {
  isLogged: boolean;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onLogin: () => void;
  onLogout: () => void;
}

// interface SignupModalState {
//   isOpen: boolean;
//   onOpen: () => void;
//   onClose: () => void;
// }

// export const useSignupModal = create<SignupModalState>((set) => ({
//   isOpen: true,
//   onOpen: () => set({ isOpen: true }),
//   onClose: () => set({ isOpen: false }),
// }));

export const authStore = create<AuthState>((set) => ({
  isLogged: false,
  isOpen: false,
  onLogin: () => set({ isLogged: true }),
  onLogout: () => set({ isLogged: false }),
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
