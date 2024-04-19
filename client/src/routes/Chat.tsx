import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";

import Layout from "../components/Layout";
import { instance } from "../api/apiconfig";
import { IFollowUser } from "./Alter";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.locale("ko");
dayjs.extend(relativeTime);

interface IMessage {
  createdAt: string;
  id: number;
  message: string;
  updatedAt: string;
}

interface IChat {
  createdAt: string;
  id: number;
  messages: IMessage[];
  users: IFollowUser[];
}

const Chat = () => {
  const fetchChats = async () => {
    const res = await instance.get(`chats/inbox`);
    return res.data;
  };
  const { data, isLoading } = useQuery({
    queryKey: ["chats"],
    queryFn: fetchChats,
  });

  if (isLoading) return <h2>Loading</h2>;

  return (
    <Layout>
      <meta name="referrer" content="no-referrer" />

      <div className="mt-10">
        {data?.map((chat: IChat) => (
          <Link key={chat.id} to={`/chat/${chat.id}`}>
            <div className="flex gap-10">
              <div>
                {chat.users.map((user) => (
                  <div key={user.id} className="flex items-center gap-6">
                    <img
                      className="size-20 rounded-full"
                      src={user.avatar}
                      alt={user.nickname}
                    />
                    <div>{user.nickname}</div>
                    {chat.messages?.slice(-1).map((m) => (
                      <span className="text-sm text-neutral-500">
                        {m.message}
                      </span>
                    ))}
                    <span className="text-sm text-neutral-500">
                      {dayjs(chat.createdAt).fromNow()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
      <meta name="referrer" content="unsafe-url" />
    </Layout>
  );
};

export default Chat;
