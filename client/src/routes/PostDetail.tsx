import { Link, useNavigate, useParams } from "react-router-dom";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { IoIosArrowBack } from "react-icons/io";

import PostActionBlock from "../components/block/PostActionBlock";
import TextArea from "../components/Inputs/TextArea";
import PostCommentBlock from "../components/block/PostCommentBlock";
import UserAvatar from "../components/block/UserAvatar";
import { useMemo } from "react";
import { useAuthState } from "../context/AuthContext";
import usePostDetail from "../hooks/usePostDetail";
import useCreateComment from "../hooks/useCreateComment";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import useDeletePost from "../hooks/useDeletePost";
import { useEditPost } from "../store/PostStroe";
dayjs.locale("ko");
dayjs.extend(relativeTime);

const PostDetail = () => {
  const { user } = useAuthState();
  const { postId } = useParams();
  const navigate = useNavigate();
  const { onOpen } = useEditPost();

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FieldValues>({});

  const { createCommentMutate } = useCreateComment({ postId, reset });

  const onValid: SubmitHandler<FieldValues> = (data) => {
    createCommentMutate(data);
  };

  const { postDetail, refetch } = usePostDetail(+postId!);

  const { deletePostMutation } = useDeletePost(+postId!);

  const isLike = useMemo(() => {
    if (postDetail) {
      return postDetail?.likeUsers?.includes(user?.id! + "") ? true : false;
    }
    return false;
  }, [postDetail]);

  const backButton = () => {
    navigate(-1);
  };

  if (!postDetail) return null;

  return (
    <div className="h-dvh w-dvw relative bg-white z-20 flex flex-col overflow-y-auto md:flex md:flex-row">
      {/* 왼쪽섹션 */}
      <div className="flex flex-col h-full w-full lg:w-4/5 p-2">
        <div className="flex flex-1 items-center justify-center h-2/4 w-full">
          <div className="w-full max-h-[80dvh] aspect-video">
            <img
              className="object-fit w-full h-full"
              src={postDetail?.images[0]}
            />
          </div>
        </div>
        <PostActionBlock
          postCommentCount={+postDetail.commentCount}
          postLikeCount={+postDetail.likeCount}
          postId={postDetail.id}
          isLike={isLike}
          refetch={refetch}
        />
        <div className="absolute top-3 left-3" onClick={backButton}>
          <IoIosArrowBack className="text-3xl bg-neutral-200 size-10 rounded-full hover:bg-neutral-300 transition cursor-pointer" />
        </div>
      </div>
      {/* 오른쪽섹션 */}
      <div className="h-full w-full md:w-[530px] p-3  lg:border-l-[1px] overflow-y-auto">
        <div className=" h-1/6 flex flex-col  ">
          <div className="flex items-center gap-1">
            <div className="flex justify-between gap-2 w-full">
              <div className="flex gap-2">
                <Link to={`/profile/${postDetail.author.id}`}>
                  <img
                    className="size-10 rounded-full"
                    src={postDetail?.author.avatar}
                  />
                </Link>
                <div className="flex flex-col justify-center">
                  <div>{postDetail?.author.nickname}</div>
                  <div className="text-neutral-400 text-sm">
                    @{postDetail?.author.nickname}
                  </div>
                </div>
              </div>
              <div>
                {postDetail.author.id === user?.id && (
                  <div className="flex gap-2">
                    <div
                      onClick={(e: React.MouseEvent<HTMLElement>) => {
                        e.stopPropagation();
                        deletePostMutation(+postId!);
                      }}
                      className="flex items-center justify-center size-8 text-red-500 hover:bg-neutral-200 rounded-full cursor-pointer text-sm"
                    >
                      삭제
                    </div>
                    <div
                      onClick={(e: React.MouseEvent<HTMLElement>) => {
                        e.stopPropagation();
                        onOpen();
                      }}
                      className="flex items-center justify-center size-8 text-blue-500 hover:bg-neutral-200 rounded-full cursor-pointer text-sm"
                    >
                      수정
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="mt-2">{postDetail?.content}</div>
          <div className="text-neutral-400 ">
            {dayjs(postDetail?.createdAt).format("HH:mm MMM DD, YYYY")}
          </div>
          {/* 댓글 파트 */}
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
