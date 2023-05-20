import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { Button } from "~/components/ui/Button";
import { env } from "~/env.mjs";
import { SlackLogo } from "~/components/slackLogo";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/Form";
import { z } from "zod";
import { Input } from "~/components/ui/Input";
import { FormInput } from "~/components/FormInputs/FormInput";
import { SlackChannelSelect } from "~/components/SlackChannelSelect";
import { FormTextarea } from "~/components/FormInputs/FormTextarea";
import { zodResolver } from "@hookform/resolvers/zod";

const formSchema = z.object({
  linearApiKey: z.string().length(48, {
    message: "Linear API Key is 48 characters long",
  }),
  message: z.string(),
  sentAt: z.date(),
  slackChannel: z.string().optional(),
  sendAt: z.date(),
});

type FormData = z.infer<typeof formSchema>;

export const Dashboard = () => {
  const { data: user } = api.user.getUser.useQuery();

  if (!user) return null;
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  return (
    <div className="flex w-[24rem] w-full max-w-xl flex-col items-center py-4 ">
      <h2 className="text-2xl font-bold">Configure Settings</h2>
      <div className="space-between mt-4 flex w-full items-center justify-between">
        <p className="text-lg font-semibold">Slack</p>
        {user?.slackAccessToken ? (
          <SlackChannelSelect
            control={form.control}
            name="slackChannel"
            label="Slack Channel"
          />
        ) : (
          <Button asChild disabled={Boolean(user?.slackAccessToken)}>
            <a href={`${env.NEXT_PUBLIC_DOMAIN}/api/slack/link`}>
              <SlackLogo className="mr-2 h-4 w-4" />
              {user?.slackAccessToken ? "Slack Connected" : "Connect Slack"}
            </a>
          </Button>
        )}
      </div>
      <hr className="my-4 h-[2px] w-full border-t-0 bg-neutral-200 opacity-50" />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-[24rem] space-y-6"
        >
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
          <FormTextarea control={form.control} name="message" label="Message" />
          <Button type="submit" disabled={!form.formState.isDirty}>
            Update
          </Button>
        </form>
      </Form>
    </div>
  );
};
