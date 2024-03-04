import React, { useRef } from "react";
import { useController } from "react-hook-form";
import { cls } from "../../libs/util";
import { TextAreaProps } from "../../types/InputTypes";

const TextArea = ({
  name,
  label,
  required,
  errors,
  control,
  small,
  disabled = false,
}: TextAreaProps) => {
  const ref = useRef<HTMLTextAreaElement>(null);
  const { field } = useController({ name, control, rules: { required } });
  return (
    <div className="relative w-full ">
      <textarea
        ref={ref}
        disabled={disabled}
        value={field.value}
        name={field.name}
        onChange={field.onChange}
        className={cls(
          "w-full outline-none px-4 pt-6 pb-2 border-2 focus:border-neutral-700 rounded peer transition resize-none disabled:cursor-not-allowed disabled:opacity-70",
          small ? "px-4 pt-4 pb-2 h-28" : "px-4 pt-7 pb-3 h-52"
        )}
      />
      <div
        onClick={() => ref.current?.focus()}
        className={cls(
          "absolute origin-[0] font-bold left-4 text-xs scale-100 text-neutral-400 peer-placeholder-shown:scale-100 peer-focus:text-neutral-700 peer-focus:scale-105 cursor-text transition peer-disabled:cursor-not-allowed disabled:opacity-70",
          small ? "top-1" : "top-2 "
        )}
      >
        {label}
      </div>
    </div>
  );
};

export default TextArea;
