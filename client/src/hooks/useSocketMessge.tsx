import { useEffect, useState } from "react";
import useChat from "./useChat";
import { socket } from "../libs/socket";
import { useNavigate } from "react-router-dom";
import { IMessage } from "../components/block/ChatMessageBlock";

const useSocketMessge = (cid: string, userId: string) => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const navigate = useNavigate();
  const { chat } = useChat(cid);

  useEffect(() => {
    if (!chat) return;

    if (chat.connectUser.includes(userId)) {
      socket.emit("enter_chat", { chatId: cid }, (res: any) => {
        console.log(res);
      });
    } else {
      navigate("/chat");
    }
  }, [chat]);

  socket.on("receive_message", (newMessages: IMessage) => {
    setMessages([...messages, newMessages]);
  });

  const sendMessage = (message: string) => {
    if (!message) {
      return false;
    }
    socket.emit(
      "send_message",
      {
        chatId: cid,
        message,
        senderId: userId,

        reciverId: chat!.connectUser.filter((u: any) => {
          return u !== userId;
        })[0],
      },
      (newSendMessage: IMessage) => {
        setMessages([...messages, newSendMessage]);
      }
    );
    return true;
  };

  return { messages, sendMessage };
};

export default useSocketMessge;
