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
import { Textarea, TextareaProps } from "~/components/ui/Textarea";

export type FormControl<T extends Record<string, string> = any> = {
  label?: string;
  description?: string;
  control: Control<T>;
  name: keyof T;
  textareaProps?: Omit<TextareaProps, "onChange" | "onFocus">;
  className?: string;
};

export const FormTextarea: FC<FormControl> = ({
  control,
  name,
  textareaProps,
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
          <Textarea {...field} {...textareaProps} />
        </FormControl>
        {description && <FormDescription>{description}</FormDescription>}
        <FormMessage />
      </FormItem>
    )}
  />
);
