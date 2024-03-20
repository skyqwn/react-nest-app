import React from "react";
import { Link } from "react-router-dom";
import { IPost } from "../../routes/Posts";
import UserAvatar from "./UserAvatar";

import { FaRegComment } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa6";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";

dayjs.locale("ko");
dayjs.extend(relativeTime);

const PostBlock = ({ post }: { post: IPost }) => {
  return (
    <div className="h-[516px] border-b-2  last:border-b-0 py-4">
      <div className="flex gap-3 h-full ">
        <div>
          {/* 유저 이미지 */}
          <Link to={"#"}>
            <div className="size-10 bg-orange-500 rounded-full" />
          </Link>
        </div>
        <div className=" flex-1 h-full">
          {/* 유지 닉네임 하고 글쓴시간 dayjs */}
          <div className="flex gap-2">
            <div>{post.author.nickname}</div>
            <div className="text-neutral-400">
              {dayjs(post.createdAt).fromNow()}
            </div>
          </div>
          {/* 게시글 Content */}
          <div className="mb-2">{post.content}</div>
          {/* 게시글하고 사진들 */}
          <div className="h-5/6">
            {post.images.map((image) => (
              <img
                className="object-fill border w-full h-full border-neutral-300 rounded-lg"
                src={image}
              />
            ))}
          </div>
          {/* 좋아요 버튼 댓글버튼 */}
          <div className=" flex justify-around mt-2 mb-2">
            <div className="flex items-center justify-center gap-2">
              <FaRegComment />
              <span>0</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <FaRegHeart />
              <span>0</span>
            </div>
          </div>
        </div>
      </div>
      {/* <h1>{post.content}</h1>
        <h3>{post.author.nickname}</h3>
        <div className="flex flex-col">
          {post.images.map((image) => (
            <img src={image} />
          ))}
        </div> */}
    </div>
  );
};

export default PostBlock;
