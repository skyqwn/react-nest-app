import { Link } from "react-router-dom";

import Layout from "../components/Layout";
import useChatInbox from "../hooks/useChatInbox";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.locale("ko");
dayjs.extend(relativeTime);

const Chat = () => {
  const { chatInbox, chatInboxLoading } = useChatInbox();

  if (chatInboxLoading) return <h2>Loading</h2>;

  return (
    <Layout>
      <div className="mt-10">
        {chatInbox?.map((chat) => (
          <Link key={chat.id} to={`/chat/${chat.id}`}>
            <div className="flex gap-10">
              <div>
                {chat.users.map((user, index: number) => (
                  <div key={index} className="flex items-center gap-6 ">
                    <img
                      className="size-20 rounded-full"
                      src={user.avatar}
                      alt={user.nickname}
                    />
                    <div>{user.nickname}</div>
                    {/* 마지막 메세지 */}
                    {chat.messages?.slice(-1).map((m) => (
                      <div className="text-sm text-neutral-500" key={m.id}>
                        <span className="mr-48">{m.message}</span>
                        <span>{dayjs(m.createdAt).fromNow()}</span>
                      </div>
                    ))}
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
