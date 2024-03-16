import { create } from "zustand";

interface UserState {
  user: {
    nickname: string;
    avatar: string;
  };
  onSignin: () => void;
}

const userStroe = create<UserState>()((set) => ({
  user: { nickname: "", avatar: "" },
  onSignin: () => {},
}));
