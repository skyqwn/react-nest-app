import { ChangeEvent, useRef } from "react";
import { Control, FieldErrors, useController } from "react-hook-form";
import { cls } from "../../libs/util";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";

interface FileInputProps {
  name: string;
  label: string;
  required?: string;
  errors: FieldErrors;
  control: Control;
  disabled?: boolean;
  small?: boolean;
  id: string;
  onlyOne?: boolean;
}

const FileInput = ({
  name,
  label,
  required,
  errors,
  control,
  disabled,
  small,
  id,
  onlyOne,
}: FileInputProps) => {
  const ref = useRef<HTMLInputElement>(null);
  const { field } = useController({ control, name, rules: { required } });
  const onClickButton = () => {
    ref.current?.click();
  };
  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    const array = [...field.value];
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
    <div className="relative w-full">
      <input
        id={id}
        multiple
        ref={ref}
        disabled={disabled}
        type="file"
        accept="image/*"
        // value={field.value}
        name={field.name}
        onChange={onChange}
        className={cls(
          "w-full  outline-none px-4 pt-6 pb-2 border-2 focus:border-neutral-700 rounded transition disabled:cursor-not-allowed disabled:opacity-70 hidden",
          small ? "px-4 pt-4 pb-2" : "px-4 pt-7 pb-3"
        )}
      />
      <MdOutlineAddPhotoAlternate
        onClick={onClickButton}
        className="text-2xl  absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer  rounded-full "
      />
    </div>
  );
};

export default FileInput;
