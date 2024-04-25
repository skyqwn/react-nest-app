import UserAvatar from "./block/UserAvatar";

import { useEffect } from "react";
import { authStore } from "../store/AuthStore";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import ImageFileInput from "./Inputs/ImageFileInput";
import TextArea from "./Inputs/TextArea";
import useCreatePosts from "../hooks/useCreatePosts";

const CreatePosts = () => {
  const { isOpen } = authStore();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      content: "",
      images: [],
      previews: [],
    },
  });

  const { createPostMutate } = useCreatePosts();

  const watchFiles = watch("images");
  const watchPreviews = watch("previews");

  const deletePreview = (targetIndex: number) => {
    const filterFiles = watchFiles.filter(
      (__: any, index: number) => targetIndex !== index
    );
    setValue("files", filterFiles);

    const filterPreviews = watchPreviews.filter(
      (__: any, index: number) => targetIndex !== index
    );
    setValue("previews", filterPreviews);
  };

  useEffect(() => {
    const blobPreviews = watchFiles.map((file: File) =>
      URL.createObjectURL(file)
    );

    setValue("previews", blobPreviews);
  }, [watchFiles]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      // window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  const onValid: SubmitHandler<FieldValues> = (data) => {
    const fd = new FormData();
    // TODO title없애야함!
    fd.append("title", "1");
    fd.append("content", data.content);
    data.images.map((image: File) => {
      fd.append("images", image);
    });
    createPostMutate(fd);
  };

  return (
    <div className="flex mb-6 pb-4  border-b-[1px]">
      <div className="mr-3 items-start flex h-full">
        <UserAvatar />
      </div>
      <div className="flex-1 w-full overflow-x-scroll">
        <div>
          <TextArea
            control={control}
            errors={errors}
            label="무슨 일이 일어나고 있나요?"
            name="content"
            small
          />
          <div className="flex gap-3 w-full overflow-x-auto p-3">
            {watchPreviews.map((preview: string, targetIndex: number) => {
              return (
                <div key={targetIndex} className="relative flex-shrink-0 ">
                  <img
                    src={preview}
                    className="size-24 sm:size-32 rounded object-cover"
                    alt={`Preview ${targetIndex}`}
                  />
                  <div
                    onClick={(e) => {
                      deletePreview(targetIndex);
                      URL.revokeObjectURL(preview);
                    }}
                    className="absolute top-0 right-0 cursor-pointer text-xs"
                  >
                    ❌
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between">
            <div className="cursor-pointer text-2xl">
              <ImageFileInput control={control} name="images" error={errors} />
            </div>
            <button
              onClick={handleSubmit(onValid)}
              className="bg-orange-500 p-2 rounded-full text-white font-semibold"
            >
              게시하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePosts;
