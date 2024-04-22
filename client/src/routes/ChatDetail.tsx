import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { BsSend } from "react-icons/bs";

import ChatMessageBlock from "../components/block/ChatMessageBlock";
import Layout from "../components/Layout";
import { useAuthState } from "../context/AuthContext";
import useChat from "../hooks/useChat";
import useSocketMessge from "../hooks/useSocketMessge";

const ChatDetail = () => {
  const [message, setMessage] = useState("");
  const { cid } = useParams();
  const { user } = useAuthState();
  const userId = user?.id.toString();

  const { chat, isChatLoading } = useChat(cid!);
  const { messages, sendMessage } = useSocketMessge(cid!, userId!);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  if (isChatLoading) return <h2>loading</h2>;

  return (
    <Layout>
      <div className="h-[calc(100vh-110px)] w-full flex flex-col relative ">
        <div className="h-full overflow-y-auto">
          {chat?.messages.map((message) => (
            <ChatMessageBlock message={message} userId={+userId!} />
          ))}
          {messages?.map((message) => (
            <ChatMessageBlock message={message} userId={+userId!} />
          ))}
        </div>
        <form
          className="absolute bottom-0 left-0 right-0 "
          onSubmit={(e) => {
            e.preventDefault();
            const ok = sendMessage(message);
            if (ok) setMessage("");
          }}
        >
          <input
            className="w-full  border-2 rounded-md absolute p-2 outline-none "
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
