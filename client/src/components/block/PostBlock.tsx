import { useState } from "react";
import { Link } from "react-router-dom";
import { IPost } from "../../routes/Posts";

import { FaRegComment } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa6";
import { IoIosArrowBack } from "react-icons/io";
import { IoIosArrowForward } from "react-icons/io";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/ko";

dayjs.locale("ko");
dayjs.extend(relativeTime);

const PostBlock = ({ post }: { post: IPost }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === post.images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? post.images.length - 1 : prevIndex - 1
    );
  };

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
          <div className="flex gap-2">
            <div>{post.author.nickname}</div>
            <div className="text-neutral-400">
              {dayjs(post.createdAt).fromNow()}
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
