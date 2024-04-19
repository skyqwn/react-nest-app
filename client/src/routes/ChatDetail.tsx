import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { instance } from "../api/apiconfig";
import { IFollowUser } from "./Alter";
import { useAuthState } from "../context/AuthContext";
import { cls } from "../libs/util";
import { socket } from "../libs/socket";
import toast from "react-hot-toast";
import { io } from "socket.io-client";
import { getCookie } from "../libs/cookie";

interface IMessage {
  author: IFollowUser;
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

  // useEffect(() => {
  //   socket.emit("enter_chat", { chatId: cid });
  // }, []);
  useEffect(() => {
    if (!chat) return;

    if (chat.connectUser.includes(userId)) {
      socket.emit("enter_chat", { chatId: cid });
    } else {
      navigate("/chat");
    }
  }, [chat]);

  socket.on("connect", () => console.log("연결됌"));

  const sendMessage = () => {
    if (!message) {
      return toast.error("메세지값을 입력해주세요");
    }
    socket.emit("send_message", {
      chatId: cid,
      message,
      senderId: userId,
      reciverId: chat.connectUser.filter((u: any) => {
        return u !== userId;
      })[0],
    });
  };

  socket.on("receive_message", (data: any) => {
    console.log(data);
    setMessages([...messages, data]);
  });

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  if (isLoading) return <h2>loading</h2>;

  return (
    <Layout>
      <div className="flex ">
        <input type="text" placeholder="채팅" onChange={onChange} />
        <button onClick={sendMessage}>전송</button>
      </div>

      <div>
        {messages?.map((message: any, index: number) => {
          const isSentByCurrentUser = user?.id === message.author.id;
          return (
            <div
              key={index}
              className={cls(
                "flex gap-3 mb-1",
                isSentByCurrentUser ? " justify-strat " : " justify-end"
              )}
            >
              <div className="flex gap-2 items-center">
                <div className={cls(!isSentByCurrentUser ? "hidden" : "block")}>
                  {message.author.nickname}
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
              </div>
            </div>
          );
        })}
      </div>
    </Layout>
  );
};

export default ChatDetail;
