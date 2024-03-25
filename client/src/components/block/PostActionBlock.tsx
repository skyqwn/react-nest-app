import React from "react";
import { FaRegComment } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa6";
const PostActionBlock = () => {
  return (
    <div className="flex justify-around mt-2 mb-2 ">
      <div className="flex items-center justify-center gap-2 hover:text-blue-500 cursor-pointer transition">
        <FaRegComment />
        <span>0</span>
      </div>
      <div className="flex items-center  justify-center gap-2 hover:text-red-500 cursor-pointer transition">
        <FaRegHeart />
        <span>0</span>
      </div>
    </div>
  );
};

export default PostActionBlock;
