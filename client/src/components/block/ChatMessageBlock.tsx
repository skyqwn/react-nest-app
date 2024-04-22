import { cls } from "../../libs/util";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.locale("ko");
dayjs.extend(relativeTime);

export interface IMessage {
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

const ChatMessageBlock = ({
  message,
  userId,
}: {
  message: IMessage;
  userId: number;
}) => {
  const isSentByCurrentUser = userId === message.author.id;
  return (
    <div
      key={message.id}
      className={cls(
        "flex gap-3 p-2",
        !isSentByCurrentUser ? " justify-strat " : " justify-end"
      )}
    >
      <div className="flex gap-3 items-center">
        <div className={cls(isSentByCurrentUser ? "hidden" : "block")}>
          <img
            src={message.author.avatar}
            className="size-10 rounded-full"
            alt={message.author.avatar}
          />
        </div>
        <div
          className={cls(
            "rounded-2xl p-2",
            isSentByCurrentUser ? "bg-sky-400 text-white" : "bg-neutral-300"
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
};

export default ChatMessageBlock;
