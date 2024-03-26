import { useNavigate, useParams } from "react-router-dom";
import PostActionBlock from "../components/block/PostActionBlock";
import { useMutation, useQuery } from "@tanstack/react-query";
import { instance } from "../api/apiconfig";
import { IPost } from "../routes/Posts";
import { FaRegHeart } from "react-icons/fa6";
import { IoCloseOutline } from "react-icons/io5";
import { MdOutlineEdit } from "react-icons/md";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";
import TextArea from "../components/Inputs/TextArea";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { queryClient } from "..";
import { useAuthState } from "../context/AuthContext";
import UserAvatar from "../components/block/UserAvatar";
import { authStore } from "../store/AuthStore";

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

  const { isOpen, onClose, onOpen } = authStore();
  const { authenticated, loading, user } = useAuthState();

  console.log(authenticated);
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FieldValues>({});

  const createComment = async (data: FieldValues) => {
    await instance.post(`/posts/${postId}/comments`, data);
  };

  const { mutate: createCommentMutate, isPending } = useMutation({
    mutationFn: createComment,
    onSuccess: () => {
      toast.success("댓글 생성 성공");
      queryClient.invalidateQueries({
        queryKey: ["posts", postId, "comments"],
      });
      reset({ comment: "" });
    },
  });

  const onValid: SubmitHandler<FieldValues> = (data) => {
    createCommentMutate(data);
  };

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

  const deleteComment = async (commentId: number) => {
    if (window.confirm("정말 댓글을 삭제하시겠습니까?")) {
      await instance.delete(`/posts/${postId}/comments/${commentId}`);
      toast.success("삭제성공!");
    }
  };

  const { mutate } = useMutation({
    mutationFn: (commentId: number) => deleteComment(commentId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["posts", postId, "comments"],
      });
    },
  });

  const backButton = () => {
    navigate(-1);
  };

  return (
    <div className="h-dvh w-dvw relative bg-white z-20 flex flex-col overflow-y-auto md:flex md:flex-row">
      {/* <div className="h-dvh w-dvw relative bg-white z-20 flex "> */}
      {/* 왼쪽섹션 */}
      <div className="flex flex-col h-full w-full lg:w-4/5 p-2">
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
      <div className="h-full w-full md:w-[430px] p-3  lg:border-l-[1px] lg:flex lg:flex-col overflow-y-auto">
        <div className="w-full h-1/6 flex flex-col  ">
          <div className="flex items-center gap-1">
            <img className="size-10 rounded-full" src={post?.author.avatar} />
            <div className="flex flex-col justify-center">
              <div>{post?.author.nickname}</div>
              <div className="text-neutral-400 text-sm">
                @{post?.author.nickname}
              </div>
            </div>
          </div>
          <div className="mt-2">{post?.content}</div>
          <div className="text-neutral-400 ">
            {/* <div className="text-neutral-400 mt-10"> */}
            {dayjs(post?.createdAt).format("HH:mm MMM DD, YYYY")}
          </div>
          <div className="w-full h-[150px] flex  gap-3 items-center justify-between border-t-2 mt-1  ">
            {/* <UserAvatar /> */}
            <div className="size-10 bg-neutral-400 rounded-full" />
            <div>
              <TextArea
                control={control}
                label="답글을 남겨주세요."
                errors={errors}
                name="comment"
                small
              />
            </div>
            <div
              onClick={handleSubmit(onValid)}
              className=" flex items-center justify-center bg-orange-500 text-white w-32 h-12 rounded-2xl font-semibold cursor-pointer hover:bg-orange-600 transition"
            >
              댓글달기
            </div>
          </div>
          <div className="w-full h-[90px] md:min-w-36 flex gap-4 flex-col divide-y-[1px]">
            {postComments?.data.map((comment: IPostComments) => (
              <div className=" flex flex-col">
                <div className="flex gap-3 w-full h-fullp-2">
                  <div>
                    <img
                      className="size-10 rounded-full"
                      src={comment.author.avatar}
                    />
                  </div>
                  <div className="flex gap-1 items-start flex-col ">
                    <div className="flex gap-2">
                      <div>{comment.author.nickname}</div>
                      <div className="text-xs text-neutral-400">{`@ ${comment.author.nickname}`}</div>
                      <div className="text-xs text-neutral-400">
                        {dayjs(comment.createdAt).fromNow()}
                      </div>
                      {user?.nickname === comment.author.nickname && (
                        <div className=" flex items-center justify-center gap-2">
                          <IoCloseOutline
                            className=" ml-10 hover:text-red-500 hover:bg-neutral-300 text-lg  rounded-full "
                            onClick={() => mutate(comment.id)}
                          />
                          <MdOutlineEdit className="hover:text-blue-500 hover:bg-neutral-300  rounded-full" />
                        </div>
                      )}
                    </div>
                    <div>{comment.comment}</div>
                    <div className="hover:text-red-500 flex items-center justify-center gap-1">
                      <FaRegHeart />
                      <div>{comment.likeCount}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
