import React, { FormEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { BsSend } from "react-icons/bs";

import Layout from "../components/Layout";
import { instance } from "../api/apiconfig";
import { useAuthState } from "../context/AuthContext";
import { cls } from "../libs/util";
import { socket } from "../libs/socket";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.locale("ko");
dayjs.extend(relativeTime);

interface IMessage {
  author: {
    avatar: string;
    id: number;
    nickname: string;
  };
  createdAt: string;
  id: number;
  message: string;
  updatedAt: string;
}

const ChatDetail = () => {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<IMessage[]>([]);
  const navigate = useNavigate();
  const { cid } = useParams();
  const { user } = useAuthState();
  const userId = user?.id.toString();

  const detilChatsFetch = async () => {
    const res = await instance.get(`chats/${cid}`);
    setMessages(res.data.messages);
    return res.data;
  };

  const { data: chat, isLoading } = useQuery({
    queryKey: ["chats", cid],
    queryFn: detilChatsFetch,
  });

  socket.on("connect", () => console.log("소켓 연결됌"));

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

  const sendMessage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!message) {
      return;
    }
    socket.emit(
      "send_message",
      {
        chatId: cid,
        message,
        senderId: userId,
        reciverId: chat.connectUser.filter((u: any) => {
          return u !== userId;
        })[0],
      },
      (newSendMessage: IMessage) => {
        setMessages([...messages, newSendMessage]);
      }
    );
    setMessage("");
  };

  socket.on("receive_message", (newMessages: IMessage) => {
    setMessages([...messages, newMessages]);
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  if (isLoading) return <h2>loading</h2>;

  return (
    <Layout>
      <div className="bg-red-200 w-full overflow-y-auto h-full flex flex-col ">
        {messages?.map((message, index: number) => {
          const isSentByCurrentUser = user?.id === message.author.id;
          return (
            <div
              key={index}
              className={cls(
                "flex gap-2 flex-1",
                !isSentByCurrentUser ? " justify-strat " : " justify-end"
              )}
            >
              <div className="flex gap-3 items-center">
                <div className={cls(isSentByCurrentUser ? "hidden" : "block")}>
                  <img
                    src={message.author.avatar}
                    className="size-10 rounded-full"
                  />
                </div>
                <div
                  className={cls(
                    "rounded-2xl p-2",
                    isSentByCurrentUser
                      ? "bg-sky-400 text-white"
                      : "bg-neutral-300"
                  )}
                >
                  {message.message}
                </div>
                <div className="text-xs text-neutral-500">
                  {dayjs(message.createdAt).fromNow()}
                </div>
              </div>
            </div>
          );
        })}
        <form className="relative " onSubmit={(e) => sendMessage(e)}>
          <input
            className="w-full border-2 rounded-md absolute p-2 outline-none"
            type="text"
            placeholder="메세지 입력..."
            onChange={onChange}
            value={message}
          />
          <button
            type="submit"
            className="absolute top-4 right-3 z-20 cursor-pointer"
          >
            <BsSend />
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default ChatDetail;
