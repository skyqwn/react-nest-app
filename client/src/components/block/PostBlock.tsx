import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";

import PostActionBlock from "./PostActionBlock";
import { useAuthState } from "../../context/AuthContext";
import { IPost } from "../../hooks/usePostDetail";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";

dayjs.locale("ko");
dayjs.extend(relativeTime);

interface PostBlockProps {
  post: IPost;
  refetch: () => void;
}

const PostBlock = ({ post, refetch }: PostBlockProps) => {
  const { user } = useAuthState();

  const isLike = useMemo(() => {
    if (post) {
      return post?.likeUsers?.includes(user?.id! + "") ? true : false;
    }
    return false;
  }, [post]);

  const [currentIndex, setCurrentIndex] = useState(0);

  const navigate = useNavigate();

  const nextSlide = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setCurrentIndex((prevIndex) =>
      prevIndex === post.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? post.images.length - 1 : prevIndex - 1
    );
  };

  const clickProfile = (e: React.MouseEvent<HTMLElement>) => {
    e.stopPropagation();
    navigate(`/profile/${post.author.id}`);
  };

  return (
    <div className="flex gap-3 h-full ">
      {/* 왼쪽 유저 이미지 */}
      <img
        src={post.author.avatar}
        className="size-10  rounded-full"
        onClick={(e) => clickProfile(e)}
      />
      {/* 오른쪽 유저정보 유저가 쓴 글 */}
      <div className="flex-1 h-full">
        {/* 유지 닉네임 하고 글쓴시간 dayjs */}
        <div className="flex flex-col">
          <div className="flex gap-2">
            <div>{post.author.nickname}</div>
            <div className="text-neutral-400">
              {dayjs(post.createdAt).fromNow()}
            </div>
          </div>
          {/* 게시글 Content */}
          <div className="mb-2">{post.content}</div>
          {/* 게시글하고 사진들 */}
          <div className="relative w-full ">
            {post.images.length > 0 && (
              <div className="relative flex aspect-square w-full overflow-x-hidden">
                {currentIndex !== 0 && (
                  <div
                    onClick={prevSlide}
                    className="absolute h-full text-white text-4xl left-3  flex items-center justify-center  z-10"
                  >
                    <div className="bg-neutral-400  hover:bg-neutral-500 rounded-full cursor-pointer">
                      <IoIosArrowBack />
                    </div>
                  </div>
                )}
                {post.images.map((image, index) => (
                  <div
                    key={index}
                    className=" w-full aspect-square transition-transform duration-300"
                    style={{
                      transform: `translateX(-${currentIndex * 100}%)`,
                    }}
                  >
                    <img
                      className=" w-full h-full object-contain"
                      src={image}
                      alt={`Image ${index}`}
                    />
                  </div>
                ))}
                {currentIndex !== post.images.length - 1 && (
                  <div
                    onClick={nextSlide}
                    className="absolute text-white text-4xl right-3 h-full flex items-center justify-center "
                  >
                    <div className="bg-neutral-400 rounded-full hover:bg-neutral-500 cursor-pointer ">
                      <IoIosArrowForward />
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        {/* 좋아요 버튼 댓글버튼 */}
        <PostActionBlock
          postCommentCount={+post.commentCount}
          postLikeCount={+post.likeCount}
          postId={post.id}
          isLike={isLike}
          refetch={refetch}
        />
      </div>
    </div>
  );
};

export default PostBlock;
