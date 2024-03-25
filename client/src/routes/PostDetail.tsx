import { useNavigate, useParams } from "react-router-dom";
import PostActionBlock from "../components/block/PostActionBlock";
import { useQuery } from "@tanstack/react-query";
import { instance } from "../api/apiconfig";
import { IPost } from "../routes/Posts";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";
import TextArea from "../components/Inputs/TextArea";

dayjs.locale("ko");
dayjs.extend(relativeTime);

interface IPostComments {
  author: {
    avatar: string;
    nickname: string;
  };
  comment: string;
  createdAt: string;
  updatedAt: string;
  id: number;
  likeCount: number;
}

const PostDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();

  const fetchPostsDetail = async () => {
    const res = await instance.get(`/posts/${postId}`);
    return res.data;
  };
  const fetchPostsComments = async () => {
    const res = await instance.get(`/posts/${postId}/comments`);
    return res.data;
  };

  const { data: post } = useQuery<IPost>({
    queryKey: ["posts", postId],
    queryFn: fetchPostsDetail,
  });
  const { data: postComments } = useQuery({
    queryKey: ["posts", postId, "comments"],
    queryFn: fetchPostsComments,
  });

  console.log(postComments?.data);
  const backButton = () => {
    navigate(-1);
  };

  return (
    <div className="h-dvh w-dvw relative bg-white z-20 flex">
      {/* 왼쪽섹션 */}
      <div className="flex flex-col h-full w-full lg:w-3/4 p-2">
        <div className="flex flex-1 items-center justify-center h-2/4 w-full">
          <div className="w-full max-h-[80dvh] aspect-video">
            <img className="object-fit w-full h-full" src={post?.images[0]} />
          </div>
        </div>
        <PostActionBlock />
        <div className="absolute top-3 left-3" onClick={backButton}>
          ❌
        </div>
      </div>
      {/* 오른쪽섹션 */}
      <div className="h-full w-[430px] p-2 hidden lg:border-l-[1px] lg:flex lg:flex-col lg:overflow-y-auto">
        <div className="w-full h-1/6 ">
          <div className="flex items-center gap-1">
            <div className="size-10 bg-neutral-400 rounded-full" />
            <div className="flex flex-col justify-center">
              <div>{post?.author.nickname}</div>
              <div className="text-neutral-400 text-sm">
                @{post?.author.nickname}
              </div>
            </div>
          </div>
          <div className="mt-4">{post?.content}</div>
          <div className="text-neutral-400 mt-10">
            {dayjs(post?.createdAt).format("HH:mm MMM DD, YYYY")}
          </div>
        </div>
        <div className="w-full h-1/6 flex items-center justify-center gap-3 border-y-[1px] ">
          <div className="size-10 bg-neutral-400 rounded-full" />
          <div>
            <textarea placeholder="답변을 달아주세요" />
          </div>
          <div className="bg-orange-500  text-white rounded-full px-3 py-2 font-semibold">
            댓글달기
          </div>
        </div>
        <div className="w-full   h-4/6 flex gap-3 flex-col  ">
          {postComments?.data.map((comment: IPostComments) => (
            <div className=" flex flex-col">
              <div className="flex gap-3 w-full h-full bg-fuchsia-600 p-2">
                <div>
                  <div className="bg-neutral-400 size-10 rounded-full" />
                </div>
                <div className="flex gap-1 items-start flex-col ">
                  <div className="flex gap-2">
                    <div>{comment.author.nickname}</div>
                    <div className="text-xs text-neutral-400">{`@ ${comment.author.nickname}`}</div>
                    <div className="text-xs text-neutral-400">
                      {dayjs(comment.createdAt).fromNow()}
                    </div>
                  </div>
                  <div>{comment.comment}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
