import { api } from "~/utils/api";
import { Button } from "~/components/ui/Button";
import { env } from "~/env.mjs";
import { SlackLogo } from "~/components/slackLogo";
import { useForm } from "react-hook-form";
import { Form } from "~/components/ui/Form";
import { z } from "zod";
import { FormInput } from "~/components/FormInputs/FormInput";
import { SlackChannelSelect } from "~/components/SlackChannelSelect";
import { FormTextarea } from "~/components/FormInputs/FormTextarea";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import customParseFormat from "dayjs/plugin/customParseFormat";
import { User } from "@prisma/client";
import { useToast } from "~/hooks/useToast";
import { FormSelect } from "~/components/FormInputs/FormSelect";
import { timezones } from "~/constants/timezones";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

const formSchema = z.object({
  linearApiKey: z.string().length(48, {
    message: "Linear API Key is 48 characters long",
  }),
  message: z.string().optional(),
  slackChannel: z.string().optional(),
  sendAt: z.string().optional(),
  timezone: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const userToData = (user: User): FormData => ({
  sendAt: dayjs(user.sendAt).format("HH:mm"),
  linearApiKey: user.linearApiKey ?? "",
  message: user.message,
  slackChannel: user.slackChannelId ?? "",
  timezone: user.timezone ?? Intl.DateTimeFormat().resolvedOptions().timeZone,
});

export const Dashboard = () => {
  const { toast, toasts } = useToast();
  const { data: user } = api.user.getUser.useQuery();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: user ? userToData(user) : {},
  });

  const { mutate: updateUser, isLoading } = api.user.updateUser.useMutation({
    onSuccess: (user) => {
      form.reset(userToData(user));
      toast({
        title: "Settings updated",
        variant: "success",
      });
      console.log(toasts);
    },
  });

  const onSubmit = (data: FormData) => {
    const parsedData = {
      ...data,
      sendAt: dayjs(data.sendAt, "HH:mm").tz(dayjs.tz.guess()).toDate(),
    };
    updateUser({
      data: parsedData,
    });
  };

  if (!user) return null;

  return (
    <div className="flex w-[24rem] w-full max-w-xl flex-col items-center py-4 ">
      <h2 className="text-2xl font-bold">Configure Settings</h2>
      <div className="space-between mt-4 flex w-full items-center justify-between">
        <p className="text-lg font-semibold">Slack</p>
        <Button
          asChild
          className={
            user?.slackAccessToken ? "pointer-events-none opacity-50" : ""
          }
        >
          <a href={`${env.NEXT_PUBLIC_DOMAIN}/api/slack/link`}>
            <SlackLogo className="mr-2 h-4 w-4" />
            {user?.slackAccessToken ? "Slack Connected" : "Connect Slack"}
          </a>
        </Button>
      </div>
      <hr className="my-4 h-[2px] w-full border-t-0 bg-neutral-200 opacity-50" />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-6"
        >
          {user?.slackAccessToken && (
            <SlackChannelSelect
              control={form.control}
              name="slackChannel"
              label="Slack Channel"
            />
          )}
          <FormInput
            control={form.control}
            name="linearApiKey"
            label="Linear API Key"
            inputProps={{ placeholder: "XXXX..." }}
          />
          <FormInput
            control={form.control}
            name="sendAt"
            label="Time"
            inputProps={{ placeholder: "XXXX...", type: "time" }}
          />
          <FormSelect
            control={form.control}
            name="timezone"
            label="Timezone"
            options={timezones.map((timezone) => ({
              label: timezone,
              value: timezone,
            }))}
          />
          <FormTextarea
            control={form.control}
            name="message"
            label="Message"
            description="You can use variables {{numIssuesCompleted}} and {{numPointsCompleted}}"
          />
          <Button type="submit" disabled={!form.formState.isDirty || isLoading}>
            Update
          </Button>
        </form>
      </Form>
    </div>
  );
};
