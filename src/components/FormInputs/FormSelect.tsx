import { Control } from "react-hook-form";
import { InputProps } from "~/components/ui/Input";
import { FC } from "react";
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/Form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/Select";
import { SelectProps } from "@radix-ui/react-select";
import { z } from "zod";

export const Option = z.object({
  label: z.string(),
  value: z.string(),
});

export type Option = z.infer<typeof Option>;

export type FormSelectProps<T extends Record<string, string> = any> = {
  label?: string;
  description?: string;
  control: Control<T>;
  name: keyof T;
  selectProps?: Omit<SelectProps, "onChange" | "onFocus">;
  className?: string;
  options: Option[];
};

export const FormSelect: FC<FormSelectProps> = ({
  control,
  name,
  selectProps,
  className,
  label,
  description,
  options,
}) => (
  <FormField
    control={control}
    name={name as string}
    render={({ field }) => (
      <FormItem className={className}>
        {label && <FormLabel>{label}</FormLabel>}
        <Select
          onValueChange={field.onChange}
          defaultValue={field.value}
          {...selectProps}
        >
          <FormControl>
            <SelectTrigger>
              <SelectValue placeholder="Select a slack channel to send to" />
            </SelectTrigger>
          </FormControl>
          <SelectContent>
            {options.map((option) => (
              <SelectItem value={option.value}>{option.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        {description && <FormDescription>{description}</FormDescription>}

        <FormMessage />
      </FormItem>
    )}
  />
);
