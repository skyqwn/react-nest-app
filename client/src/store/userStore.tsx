import { create } from "zustand";
import axios from "axios";

interface UserState {
  user: {
    email: string;
    nickname: string;
  };
  onSignin: () => void;
}

const userStroe = create<UserState>()((set) => ({
  user: { email: "", nickname: "" },
  onSignin: () => {},
}));
