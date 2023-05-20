import {
  FormSelect,
  FormSelectProps,
} from "~/components/FormInputs/FormSelect";
import { FC } from "react";
import { api } from "~/utils/api";

type SlackChannelSelectProps = Omit<FormSelectProps, "options">;

export const SlackChannelSelect: FC<SlackChannelSelectProps> = (props) => {
  const { data } = api.slack.getChannels.useQuery();
  return (
    <FormSelect
      options={data ?? []}
      {...props}
      selectProps={{ disabled: !data, ...props.selectProps }}
    />
  );
};
