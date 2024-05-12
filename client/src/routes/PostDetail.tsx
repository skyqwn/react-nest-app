import { Link, useNavigate, useParams } from "react-router-dom";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";

import PostActionBlock from "../components/block/PostActionBlock";
import TextArea from "../components/Inputs/TextArea";
import PostCommentBlock from "../components/block/PostCommentBlock";
import UserAvatar from "../components/block/UserAvatar";
import { useMemo, useState } from "react";
import { useAuthState } from "../context/AuthContext";
import usePostDetail from "../hooks/usePostDetail";
import useCreateComment from "../hooks/useCreateComment";
import useDeletePost from "../hooks/useDeletePost";
import { useEditPost } from "../store/PostStroe";
import EditPostModal from "../components/modals/EditPostModal";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Layout from "../components/Layout";
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

  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    if (postDetail) {
      setCurrentIndex((prevIndex) =>
        prevIndex === postDetail.images.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const prevSlide = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    if (postDetail) {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? postDetail.images.length - 1 : prevIndex - 1
      );
    }
  };

  const isLike = useMemo(() => {
    if (postDetail) {
      return postDetail?.likeUsers?.includes(user?.id! + "") ? true : false;
    }
    return false;
  }, [postDetail]);

  const backButton = () => {
    navigate(-1);
  };

  const isImage = useMemo(() => {
    if (!postDetail) return false;
    if (postDetail?.images.length > 0) return true;
    return false;
  }, [postDetail]);

  if (!postDetail) return null;

  return (
    <>
      <EditPostModal postDetail={postDetail} />
      {isImage ? (
        <div className="flex flex-col h-full md:h-dvh w-dvw relative bg-white z-20 overflow-y-auto md:flex md:flex-row">
          {/* 왼쪽섹션 */}
          <div className="relative flex flex-col w-full p-2">
            {/* 이미지사진 */}
            <div className="relative flex-1 h-full w-full overflow-x-hidden">
              <div className="relative flex h-full items-center">
                {currentIndex !== 0 && (
                  <div
                    onClick={prevSlide}
                    className="absolute h-full text-white text-4xl left-3 flex items-center justify-center z-10"
                  >
                    <div className="bg-neutral-400 hover:bg-neutral-500 rounded-full cursor-pointer">
                      <IoIosArrowBack />
                    </div>
                  </div>
                )}
                {postDetail.images?.map((image, index: number) => (
                  <div
                    key={index}
                    className="w-full h-full flex flex-shrink-0 transition-transform duration-300"
                    style={{
                      transform: `translateX(-${currentIndex * 100}%)`,
                    }}
                  >
                    <img
                      className="w-full h-full object-contain md:w-full "
                      src={image}
                      alt={`Image ${index}`}
                    />
                  </div>
                ))}
                {currentIndex !== postDetail!.images.length - 1 && (
                  <div
                    onClick={nextSlide}
                    className="absolute text-white text-4xl right-3 h-full flex items-center justify-center z-10"
                  >
                    <div className="bg-neutral-400 rounded-full hover:bg-neutral-500 cursor-pointer ">
                      <IoIosArrowForward />
                    </div>
                  </div>
                )}
              </div>
            </div>
            {/* 좋아요 댓글갯수확인 */}
            <PostActionBlock
              postCommentCount={+postDetail.commentCount}
              postLikeCount={+postDetail.likeCount}
              postId={postDetail.id}
              isLike={isLike}
              refetch={refetch}
            />
          </div>
          {/* 오른쪽섹션 */}
          <div className="h-full w-full md:w-[530px] p-3  lg:border-l-[1px]">
            <div className=" h-1/6 flex flex-col  ">
              <div className="flex items-center gap-1">
                <div className="flex justify-between gap-2 w-full">
                  <div className="flex gap-2">
                    <Link to={`/profile/${postDetail.author?.id}`}>
                      <img
                        className="size-10 rounded-full"
                        src={postDetail.author?.avatar}
                      />
                    </Link>
                    <div className="flex flex-col justify-center">
                      <div>{postDetail?.author.nickname}</div>
                      <div className="text-neutral-400 text-sm">
                        @{postDetail?.author?.nickname}
                      </div>
                    </div>
                  </div>
                  {/* 글의 주인일경우 수정 삭제버튼 */}
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
              <div className="flex  gap-3 items-center justify-between border-y mt-1 py-2 ">
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
              <div className="h-[90px]  md:w-[450px] flex gap-4 flex-col ">
                <PostCommentBlock />
              </div>
            </div>
          </div>
          {/* 뒤로가기버튼 */}
          <div className="absolute top-3 left-3" onClick={backButton}>
            <IoIosArrowBack className="text-3xl bg-neutral-200 size-10 rounded-full hover:bg-neutral-300 transition cursor-pointer" />
          </div>
        </div>
      ) : (
        // 이미지없고 글만있을때 보여주는 화면
        <Layout>
          <div className="h-full w-full p-3 lg:border-x-2 overflow-y-auto">
            <div className=" h-1/6 flex flex-col  ">
              {/* 유저 정보 */}
              <div className="flex items-center gap-1">
                <div className="flex justify-between gap-2 w-full">
                  <div className="flex gap-2">
                    <Link to={`/profile/${postDetail.author?.id}`}>
                      <img
                        className="size-10 rounded-full"
                        src={postDetail.author?.avatar}
                      />
                    </Link>
                    <div className="flex flex-col justify-center">
                      <div>{postDetail?.author.nickname}</div>
                      <div className="text-neutral-400 text-sm">
                        @{postDetail?.author?.nickname}
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
              <div className="h-[450px]  w-full flex gap-3 items-center justify-between border-y-[1px] mt-1 py-2  ">
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
        </Layout>
      )}
    </>
  );
};

export default PostDetail;
