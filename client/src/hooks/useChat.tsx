import { useQuery } from "@tanstack/react-query";
import { instance } from "../api/apiconfig";
import { IMessage } from "../components/block/ChatMessageBlock";
import { IFollowUser } from "./useFollowers";

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
    const res = await instance.get(`message/${cid}`);
    return res.data;
  };

  const { data: chat, isLoading: isChatLoading } = useQuery<IChat>({
    queryKey: ["chats", cid],
    queryFn: () => detilChatsFetch(cid),
  });

  return { chat, isChatLoading };
};

export default useChat;
