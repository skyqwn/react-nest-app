import { Link, useNavigate, useParams } from "react-router-dom";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

import PostActionBlock from "../components/block/PostActionBlock";
import TextArea from "../components/Inputs/TextArea";
import PostCommentBlock from "../components/block/PostCommentBlock";
import { queryClient } from "..";
import { instance } from "../api/apiconfig";
import { IPost } from "../types/PostsTypes";

import { IoIosArrowBack } from "react-icons/io";

import dayjs from "dayjs";
import "dayjs/locale/ko";
import relativeTime from "dayjs/plugin/relativeTime";
import UserAvatar from "../components/block/UserAvatar";
dayjs.locale("ko");
dayjs.extend(relativeTime);

const PostDetail = () => {
  const { postId } = useParams();
  const navigate = useNavigate();

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
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["posts", postId] });
      const prev: IPost | undefined = queryClient.getQueryData([
        "posts",
        postId,
      ]);
      const shallow = { ...prev, commentCount: prev?.commentCount! + 1 };
      queryClient.setQueryData(["posts", postId], shallow);
    },
    onError(error) {
      const prev: any = queryClient.getQueryData(["posts", postId]);
      const shallow = { ...prev, commentCount: prev.commentCount - 1 };
      queryClient.setQueryData(["posts", postId], shallow);
    },
  });

  const onValid: SubmitHandler<FieldValues> = (data) => {
    createCommentMutate(data);
  };

  const fetchPostsDetail = async () => {
    const res = await instance.get(`/posts/${postId}`);
    return res.data;
  };

  const { data: post } = useQuery<IPost>({
    queryKey: ["posts", postId],
    queryFn: fetchPostsDetail,
  });

  const backButton = () => {
    navigate(-1);
  };

  if (!post) return null;

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
        <PostActionBlock
          postCommentCount={+post.commentCount}
          postLikeCount={+post.likeCount}
          // postId={post.id}
        />
        <div className="absolute top-3 left-3" onClick={backButton}>
          <IoIosArrowBack className="text-3xl bg-neutral-200 size-10 rounded-full hover:bg-neutral-300 transition cursor-pointer" />
        </div>
      </div>
      {/* 오른쪽섹션 */}
      <div className="h-full w-full md:w-[530px] p-3  lg:border-l-[1px] overflow-y-auto">
        <div className=" h-1/6 flex flex-col  ">
          <div className="flex items-center gap-1">
            <Link to={`/profile/${post.author.id}`}>
              <img className="size-10 rounded-full" src={post?.author.avatar} />
            </Link>
            <div className="flex flex-col justify-center">
              <div>{post?.author.nickname}</div>
              <div className="text-neutral-400 text-sm">
                @{post?.author.nickname}
              </div>
            </div>
          </div>
          <div className="mt-2">{post?.content}</div>
          <div className="text-neutral-400 ">
            {dayjs(post?.createdAt).format("HH:mm MMM DD, YYYY")}
          </div>
          <div className="h-[450px] flex  gap-3 items-center justify-between border-t-2 mt-1  ">
            <UserAvatar />
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
              className=" flex items-center justify-center bg-orange-500 text-white w-32 h-12 md:size-12 rounded-2xl font-semibold cursor-pointer hover:bg-orange-600 transition"
            >
              댓글
            </div>
          </div>
          {/* 포스트 댓글 */}
          <div className="h-[90px]  md:w-[450px] flex gap-4 flex-col divide-y-[1px]">
            <PostCommentBlock />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetail;
