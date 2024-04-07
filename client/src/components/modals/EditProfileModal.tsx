import React, { useMemo } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";

import { useEditProfile } from "../../store/ProfilStore";
import Modal from "./Modal";
import { Input } from "../Input";
import { useAuthState } from "../../context/AuthContext";
import FileInput from "../Inputs/FileInput";
import { instance } from "../../api/apiconfig";

const EditProfileModal = () => {
  const { isOpen, onClose } = useEditProfile();
  const { user } = useAuthState();
  const navigate = useNavigate();

  const NO_USER_IMAGE_SRC = "imgs/user.png";

  const {
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    values: useMemo(() => {
      return {
        ...user,
        previewImage: user?.avatar ? user.avatar : NO_USER_IMAGE_SRC,
        files: [],
      };
    }, [user]),
  });

  const editUser = async (data: FieldValues) => {
    await instance.patch(`/users/edit/${user?.id!}`, data);
  };

  const { mutate: editUserMutation, isPending } = useMutation({
    mutationFn: editUser,
    onSuccess: () => {
      toast.success("수정성공");
      setTimeout(() => {
        navigate(0);
      }, 600);
    },
  });

  const onValid: SubmitHandler<FieldValues> = (data) => {
    const fd = new FormData();
    fd.append("nickname", data.nickname);
    data.files.map((image: File) => {
      fd.append("files", image);
    });
    editUserMutation(fd);
  };

  const watchFile = watch("files");
  const previewImage = watch("previewImage");

  React.useEffect(() => {
    if (watchFile[0]) {
      const blobPreview = URL.createObjectURL(watchFile[0]);
      setValue("previewImage", blobPreview);
    }
  }, [watchFile]);

  const body = (
    <div className="space-y-5 flex flex-col">
      <div className=" flex items-center justify-center">
        <label htmlFor="avatar" className="">
          <img src={previewImage} className="size-32 rounded-full " />
        </label>
        {/* <div
          onClick={() => {
            setValue("previewImage", NO_USER_IMAGE_SRC);
          }}
          className="absolute top-2 right-10 text-lg cursor-pointer bg-white border rounded-full w-8 h-8 flex items-center justify-center hover:ring-2 hover:ring-purple-300 "
        >
          ❌
        </div> */}
      </div>
      <FileInput
        control={control}
        errors={errors}
        label="프로필변경"
        id="avatar"
        name="files"
        onlyOne
      />
      <Input name="nickname" control={control} label="닉네임" />
    </div>
  );
  return (
    <div>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        body={body}
        label="프로필 수정"
        actionLabel="저장"
        onAction={handleSubmit(onValid)}
        disabled={isPending}
      />
    </div>
  );
};

export default EditProfileModal;
