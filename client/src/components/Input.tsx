import { useRef } from "react";
import { InputProps } from "../types/InputTypes";
import { cls } from "../libs/util";
import { useController } from "react-hook-form";
import FormError from "./FormError";

export const Input = ({
  name,
  label,
  control,
  small,
  type = "text",
  disabled = false,
  rules,
}: InputProps) => {
  const ref = useRef<HTMLInputElement>(null);
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
    rules,
  });

  return (
    <div className={cls("relative w-full")}>
      <input
        ref={ref}
        disabled={disabled}
        type={type}
        value={field.value}
        name={field.name}
        onChange={field.onChange}
        className={cls(
          "w-full outline-none px-4 pt-6 pb-2 border-2 focus:border-neutral-700 rounded peer transition disabled:cursor-not-allowed disabled:opacity-70",
          small ? "px-4 pt-4 pb-2" : "px-4 pt-7 pb-3"
        )}
      />
      <div
        onClick={() => ref.current?.focus()}
        className={cls(
          "absolute origin-[0] font-bold left-4 text-xs scale-100 text-neutral-400 peer-placeholder-shown:scale-100 peer-focus:text-neutral-700 peer-focus:scale-105 cursor-text transition peer-disabled:cursor-not-allowed",
          small ? "top-1" : "top-2 "
        )}
      >
        {label}
      </div>
      {error && <FormError errorMessage={error?.message} />}
      {error && error?.type === "pattern" && (
        <FormError errorMessage={"이메일형식에 맞춰 입력해주세요!"} />
      )}
    </div>
  );
};
