import React from "react";
import { Control, FieldErrors, useController } from "react-hook-form";
import ReactSelect from "react-select";

interface SelectTypes {
  options: {
    value: string;
    label: string;
  }[];
  control: Control;
  errors: FieldErrors;
  name: string;
  disabled?: boolean;
}

const Select = ({ options, control, name, disabled }: SelectTypes) => {
  const { field } = useController({ name, control });
  const fieldValue = options.find((item) => item.value === field.value);
  return (
    <ReactSelect
      isDisabled={disabled}
      options={options}
      value={fieldValue}
      name={field.name}
      onChange={(item: any) => {
        if (!item) return;
        field.onChange(item.value);
      }}
    />
  );
};

export default Select;
