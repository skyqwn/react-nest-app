import { create } from "zustand";
import axios from "axios";

interface UserState {
  user: {
    email: string;
    nickname: string;
  };
  onSignin: () => void;
}
interface AuthState {
  isLogged: boolean;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onLogin: () => void;
  onLogout: () => void;
}

export const authStore = create<AuthState>((set) => ({
  isLogged: false,
  isOpen: false,
  onLogin: () => set({ isLogged: true }),
  onLogout: () => set({ isLogged: false }),
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));

const userStroe = create<UserState>()((set) => ({
  user: { email: "", nickname: "" },
  onSignin: () => {},
}));
