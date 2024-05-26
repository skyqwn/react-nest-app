import { io } from "socket.io-client";
import { getCookie } from "./cookie";

const accessToken = getCookie("accessToken");

export const socket = io(
  `${process.env.REACT_APP_SOCKET_URL}` || "https://modong.site/api",
  {
    withCredentials: true,
    extraHeaders: {
      Authorization: `Bearer ${accessToken}`,
    },
  }
);
