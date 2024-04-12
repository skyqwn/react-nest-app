import { io } from "socket.io-client";
import { getCookie } from "./cookie";

const accessToken = getCookie("accessToken");

export const socket = io("http://localhost:4000/chats", {
  withCredentials: true,
  extraHeaders: {
    Authorization: `Bearer ${accessToken}`,
  },
});
