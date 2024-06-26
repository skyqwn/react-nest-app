import UserAvatar from "./block/UserAvatar";

import { useEffect } from "react";
import { authStore } from "../store/AuthStore";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import ImageFileInput from "./Inputs/ImageFileInput";
import TextArea from "./Inputs/TextArea";
import useCreatePosts from "../hooks/useCreatePosts";
import Button from "./buttons/Button";
import { useAuthState } from "../context/AuthContext";

const CreatePosts = () => {
  const { isOpen, onOpen } = authStore();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      content: "",
      images: [],
      previews: [],
    },
  });

  const { authenticated } = useAuthState();

  const { createPostMutate } = useCreatePosts({ reset });

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
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  const onValid: SubmitHandler<FieldValues> = (data) => {
    if (!data.content) return;
    const fd = new FormData();
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
          {watchPreviews.length > 0 && (
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
          )}
          <div className="flex justify-between">
            <div className="cursor-pointer text-2xl">
              <ImageFileInput control={control} name="images" error={errors} />
            </div>
            <Button
              actionText="게시하기"
              onAction={authenticated ? handleSubmit(onValid) : onOpen}
              canClick={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePosts;
