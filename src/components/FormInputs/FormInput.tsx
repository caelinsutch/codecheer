import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/Form";
import { Control } from "react-hook-form";
import { FC } from "react";
import { Input, InputProps } from "~/components/ui/Input";

export type FormControl<T extends Record<string, string> = any> = {
  label?: string;
  description?: string;
  control: Control<T>;
  name: keyof T;
  inputProps: Omit<InputProps, "onChange" | "onFocus">;
  className?: string;
};

export const FormInput: FC<FormControl> = ({
  control,
  name,
  inputProps,
  className,
  label,
  description,
}) => (
  <FormField
    control={control}
    name={name as string}
    render={({ field }) => (
      <FormItem className={className}>
        {label && <FormLabel>{label}</FormLabel>}
        <FormControl>
          <Input {...field} {...inputProps} />
        </FormControl>
        {description && <FormDescription>{description}</FormDescription>}
        <FormMessage />
      </FormItem>
    )}
  />
);
