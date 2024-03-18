import { ChangeEventHandler, useEffect, useRef, useState } from "react";
import TextareaAutosize from "react-textarea-autosize";
import { MdAddPhotoAlternate } from "react-icons/md";

import Posts from "./Posts";
import UserAvatar from "../components/block/UserAvatar";
import Layout from "../components/Layout";
import { authStore } from "../store/AuthStore";
import Layout2 from "../components/Layout2";

export const Home = () => {
  const imageRef = useRef<HTMLInputElement>(null);
  const [content, setContent] = useState("");
  const { isOpen } = authStore();

  const onChange: ChangeEventHandler<HTMLTextAreaElement> = (e) => {
    setContent(e.target.value);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  const onClickButton = () => {
    imageRef.current?.click();
  };

  return (
    <Layout2>
      <div className="flex flex-col p-4">
        <div className="flex items-center mb-6 pb-4  border-b-[1px]">
          <div className="mr-4 w-10 ">
            <UserAvatar />
          </div>
          <div className="flex-1">
            <div>
              <TextareaAutosize
                className="w-full py-3"
                value={content}
                onChange={onChange}
                placeholder="무슨 일이 일어나고 있나요?"
              />
              <div className="flex justify-between">
                <div className="cursor-pointer text-2xl">
                  <input
                    type="file"
                    name="imageFiles"
                    multiple
                    hidden
                    ref={imageRef}
                    // onChange={onUpload}
                  />
                  <MdAddPhotoAlternate onClick={onClickButton} />
                </div>
                <div>게시하기</div>
              </div>
            </div>
          </div>
        </div>
        <Posts />
      </div>
    </Layout2>
  );
};
