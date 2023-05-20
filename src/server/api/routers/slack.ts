import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { WebClient } from "@slack/web-api";

export const slackRouter = createTRPCRouter({
  getChannels: protectedProcedure.query(
    async ({ ctx: { session, prisma } }) => {
      const user = await prisma.user.findUnique({
        where: {
          id: session.user.id,
        },
      });

      if (!user?.slackAccessToken) return [];

      const web = new WebClient(user.slackAccessToken);

      const channels = await web.conversations.list();

      if (!channels.ok) throw new Error(channels.error);

      return (
        channels?.channels?.map(({ name, id }) => ({
          label: `#${name}`,
          value: id as string,
        })) ?? []
      );
    }
  ),
});
