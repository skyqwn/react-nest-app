import { useQuery } from "@tanstack/react-query";
import React from "react";
import { instance } from "../api/apiconfig";
import { IFollowUser } from "../routes/Alter";
import { IMessage } from "../components/block/ChatMessageBlock";

interface IChat {
  connectUser: string[];
  createdAt: string;
  id: number;
  messages: IMessage[];
  updatedAt: string;
  users: IFollowUser[];
}

const useChat = (cid: string) => {
  const detilChatsFetch = async (cid: string) => {
    const res = await instance.get(`chats/${cid}`);
    return res.data;
  };

  const { data: chat, isLoading: isChatLoading } = useQuery<IChat>({
    queryKey: ["chats", cid],
    queryFn: () => detilChatsFetch(cid),
  });

  return { chat, isChatLoading };
};

export default useChat;
