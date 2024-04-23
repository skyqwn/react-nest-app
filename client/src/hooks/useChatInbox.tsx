import { useQuery } from "@tanstack/react-query";
import { instance } from "../api/apiconfig";
import { IFollowUser } from "./useFollowers";

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
    const res = await instance.get(`chats/inbox`);
    return res.data;
  };
  const { data: chatInbox, isLoading: chatInboxLoading } = useQuery<IChat[]>({
    queryKey: ["chats"],
    queryFn: fetchChats,
  });
  return { chatInbox, chatInboxLoading };
};

export default useChatInbox;
