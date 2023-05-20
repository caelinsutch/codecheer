import {
  FormSelect,
  FormSelectProps,
} from "~/components/FormInputs/FormSelect";
import { FC } from "react";

type SlackChannelSelectProps = Omit<FormSelectProps, "options">;

export const SlackChannelSelect: FC<SlackChannelSelectProps> = (props) => {
  return <FormSelect options={[]} {...props} />;
};
