import { useState } from "react";
import { Link } from "react-router-dom";
import { IPost } from "../../routes/Posts";

import { FaRegComment } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa6";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";
import { IoCloseOutline } from "react-icons/io5";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";
import toast from "react-hot-toast";
import { queryClient } from "../..";
import { useMutation } from "@tanstack/react-query";
import { instance } from "../../api/apiconfig";

dayjs.locale("ko");
dayjs.extend(relativeTime);

const PostBlock = ({ post }: { post: IPost }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

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

  const deletePost = async (postId: number) => {
    if (window.confirm("정말 이 게시물을 삭제하시겠습니까?")) {
      await instance.delete(`/posts/${post.id}`);
      toast.success("삭제성공!");
    }
  };

  const { mutate } = useMutation({
    mutationFn: (postId: number) => deletePost(postId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["posts"],
      });
    },
  });

  return (
    <div className="h-[516px] border-b-2  last:border-b-0 py-4">
      <div className="flex gap-3 h-full ">
        <div>
          {/* 유저 이미지 */}
          <Link to={"#"}>
            <div className="size-10 bg-orange-500 rounded-full" />
          </Link>
        </div>
        <div className="flex-1 h-full">
          {/* 유지 닉네임 하고 글쓴시간 dayjs */}
          <div className="flex justify-between">
            <div className="flex gap-2">
              <div>{post.author.nickname}</div>
              <div className="text-neutral-400">
                {dayjs(post.createdAt).fromNow()}
              </div>
            </div>
            <div
              onClick={(e: React.MouseEvent<HTMLElement>) => {
                e.stopPropagation();
                mutate(post.id);
              }}
              className="flex items-center justify-center size-8 hover:text-red-500 hover:bg-neutral-300 text-lg  rounded-full cursor-pointer"
            >
              <IoCloseOutline />
            </div>
          </div>
          {/* 게시글 Content */}
          <div className="mb-2">{post.content}</div>
          {/* 게시글하고 사진들 */}
          <div className="relative h-5/6 flex overflow-hidden bg-red-500 items-center">
            {currentIndex !== 0 && (
              <div
                onClick={prevSlide}
                className="absolute text-white text-4xl left-3 bg-neutral-400 flex items-center justify-center hover:bg-neutral-400 rounded-full cursor-pointer z-10"
              >
                <IoIosArrowBack />
              </div>
            )}
            <div
              className="w-full h-full flex transition-transform duration-300"
              style={{
                transform: `translateX(-${currentIndex * 100}%)`,
              }}
            >
              {post.images.map((image, index) => (
                <img
                  key={index}
                  className="object-fill border w-full h-full border-neutral-300"
                  src={image}
                  alt={`Image ${index}`}
                />
              ))}
            </div>
            {currentIndex !== post.images.length - 1 && (
              <div
                onClick={nextSlide}
                className="absolute text-white text-4xl right-3 bg-neutral-400 flex items-center justify-center hover:bg-neutral-500 rounded-full cursor-pointer"
              >
                <IoIosArrowForward />
              </div>
            )}
          </div>
          {/* 좋아요 버튼 댓글버튼 */}
          <div className="flex justify-around mt-2 mb-2">
            <div className="flex items-center justify-center gap-2 hover:text-blue-500">
              <FaRegComment />
              <span>0</span>
            </div>
            <div className="flex items-center justify-center gap-2 hover:text-red-500">
              <FaRegHeart />
              <span>0</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostBlock;
