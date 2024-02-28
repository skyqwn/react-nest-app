import { Control, FieldErrors } from "react-hook-form";

export interface InputProps {
  name: string;
  label: string;
  control: Control;
  type?: "text" | "password" | "email" | "file";
  disabled?: boolean;
  small?: boolean;
  rules?: any;
}
