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
}

export const authStore = create<AuthState>((set) => ({
  isLogged: false,
}));

const userStroe = create<UserState>()((set) => ({
  user: { email: "", nickname: "" },
  onSignin: () => {},
}));
