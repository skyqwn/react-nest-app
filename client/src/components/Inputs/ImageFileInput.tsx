import React, { ChangeEvent, useRef } from "react";
import { Control, FieldErrors, useController } from "react-hook-form";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";

interface ImageFileInputProps {
  control: Control;
  error: FieldErrors;
  name: string;
  disabled?: boolean;
  required?: boolean;
  onlyOne?: boolean;
}

const ImageFileInput = ({
  control,
  error,
  name,
  disabled,
  required,
  onlyOne,
}: ImageFileInputProps) => {
  const imageRef = useRef<HTMLInputElement>(null);
  const { field } = useController({ control, name, rules: { required } });
  const onClickButton = () => {
    imageRef.current?.click();
  };
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const array = [...field.value];
    console.log(array);
    const oneArr = [];

    if (!e.target.files) return;

    for (let i = 0; i < e.target.files.length; i++) {
      array.push(e.target.files[i]);
    }

    if (onlyOne) {
      const lastFile = array[array.length - 1];
      field.onChange([lastFile]);
    } else {
      field.onChange(array);
    }
  };
  return (
    <div>
      <input
        type="file"
        name={field.name}
        accept="image/*"
        multiple
        hidden
        ref={imageRef}
        onChange={onChange}
      />
      <MdOutlineAddPhotoAlternate
        onClick={onClickButton}
        className="text-orange-500 "
      />
    </div>
  );
};

export default ImageFileInput;
