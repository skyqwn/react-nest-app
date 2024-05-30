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

socket.on("connect", () => {
  console.log("Connected to the server");
});

socket.on("connect_error", (error) => {
  console.log("Connection Error:", error);
});

socket.on("disconnect", () => {
  console.log("Disconnected from the server");
});
