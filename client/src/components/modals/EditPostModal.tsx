import toast from "react-hot-toast";

import { useMutation } from "@tanstack/react-query";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";

import { useEditPost } from "../../store/PostStroe";
import TextArea from "../Inputs/TextArea";
import { instance } from "../../api/apiconfig";
import { queryClient } from "../..";
import { IPost } from "../../hooks/usePostDetail";
import { useEffect, useMemo, useState } from "react";
import Modal from "./Modal";
import ImageFileInput from "../Inputs/ImageFileInput";

const defaultValues = {
  title: "",
  content: "",
};

interface EditPostProps {
  title: string;
  content: string;
}

const EditPostModal = ({ postDetail }: { postDetail: IPost }) => {
  const {
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues,
    values: useMemo(() => {
      return {
        ...postDetail,
        files: [],
        previewFiles: [],
      };
    }, [postDetail]),
  });

  const oldImages = watch("images");
  const watchFiles = watch("files");
  const watchPreviewFiles = watch("previewFiles");

  const { isOpen, onClose } = useEditPost();
  const { postId } = useParams();

  const [scrollPosition, setScrollPosition] = useState(0);

  const top = scrollPosition + "px";

  const deleteOldPreview = (targetIndex: number) => {
    const filterOldImages = oldImages.filter(
      (__: any, index: number) => targetIndex !== index
    );
    setValue("images", filterOldImages);
  };

  const deleteNewPreview = (targetIndex: number) => {
    const filterNewImages = watchFiles.filter(
      (__: any, index: number) => targetIndex !== index
    );
    setValue("files", filterNewImages);
  };

  useEffect(() => {
    if (watchFiles) {
      const blobPreviews = watchFiles.map((file: File) =>
        URL.createObjectURL(file)
      );

      setValue("previewFiles", blobPreviews);
    }
  }, [watchFiles]);

  const patchPost = async (data: FieldValues) => {
    for (const [key, value] of data.entries()) {
      console.log(key, value);
    }
    await instance.patch(`/posts/${postId}`, data);
  };

  const { mutate: patchPostMutation, isPending } = useMutation({
    mutationFn: patchPost,
    onSuccess: () => {
      toast.success("수정성공");
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      onClose();
    },
  });

  const onValid: SubmitHandler<FieldValues> = async (data) => {
    const fd = new FormData();
    fd.append("content", data.content);
    data.files.map((file: File) => {
      fd.append("files", file);
    });
    const imageLocations = new Array();
    data.images.map((image: string) => {
      imageLocations.push(image);
    });
    // @ts-ignore
    fd.append("images", imageLocations);

    patchPostMutation(fd);
  };

  const body = (
    <div className="space-y-5 h-full w-full">
      <div className=" flex items-center gap-2">
        <div className="cursor-pointer text-2xl">
          <ImageFileInput control={control} name="files" error={errors} />
        </div>
        <div className="border-2 flex p-2 gap-2">
          {oldImages.map((preview: string, targetIndex: number) => {
            return (
              <div key={targetIndex} className="relative w-20">
                <img src={preview} className="size-20 rounded" />
                <div
                  onClick={(e) => {
                    deleteOldPreview(targetIndex);
                    URL.revokeObjectURL(preview);
                  }}
                  className="absolute top-0 right-0 cursor-pointer text-xs"
                >
                  ❌
                </div>
              </div>
            );
          })}
          {watchPreviewFiles.map((preview: string, targetIndex: number) => {
            return (
              <div key={targetIndex} className="relative  w-20">
                <img src={preview} className="w-20 h-20 rounded" />
                <div
                  onClick={(e) => {
                    deleteNewPreview(targetIndex);
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
      </div>
      <div>
        <TextArea
          name="content"
          control={control}
          errors={errors}
          label="본문"
        />
      </div>
    </div>
  );

  return (
    <Modal
      body={body}
      isOpen={isOpen}
      label={"포스트 수정"}
      onAction={handleSubmit(onValid)}
      onClose={onClose}
      actionLabel="수정"
      disabled={isPending}
      big
    />
  );
};

export default EditPostModal;
