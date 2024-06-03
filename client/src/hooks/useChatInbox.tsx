import { useQuery } from "@tanstack/react-query";
import { instance } from "../api/apiconfig";
import { IFollowUser } from "./useFollowers";
import axios from "axios";

interface IMessage {
  createdAt: string;
  id: number;
  message: string;
  updatedAt: string;
}

export interface IChat {
  createdAt: string;
  id: number;
  messages: IMessage[];
  users: IFollowUser[];
}

const useChatInbox = () => {
  const fetchChats = async () => {
    try {
      const res = await instance.get(`message/inbox`);
      return res.data;
    } catch (error) {
      console.log(error);
    }
  };
  const { data: chatInbox, isLoading: chatInboxLoading } = useQuery<IChat[]>({
    queryKey: ["chats"],
    queryFn: fetchChats,
  });

  return { chatInbox, chatInboxLoading };
};

export default useChatInbox;
