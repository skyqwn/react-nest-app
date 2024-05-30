import { io } from "socket.io-client";
import { getCookie } from "./cookie";

const accessToken = getCookie("accessToken");

export const socket = io(
  // "http://localhost:4000/api/chats",
  "https://modong.site/api/chats",
  // `${process.env.REACT_APP_SOCKET_URL}` || "https://modong.site/api",
  {
    withCredentials: true,
    extraHeaders: {
      Authorization: `Bearer ${accessToken}`,
    },
  }
);
