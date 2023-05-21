import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { z } from "zod";

export const userRouter = createTRPCRouter({
  getUser: protectedProcedure.query(({ ctx: { session, prisma } }) =>
    prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
    })
  ),

  updateUser: protectedProcedure
    .input(
      z.object({
        data: z.object({
          linearApiKey: z.string().optional(),
          message: z.string().optional(),
          slackChannel: z.string().optional(),
          sendAt: z.date().optional(),
          timezone: z.string().optional(),
        }),
      })
    )
    .mutation(async ({ ctx: { session, prisma }, input }) =>
      prisma.user.update({
        where: {
          id: session.user.id,
        },
        data: {
          linearApiKey: input.data.linearApiKey,
          message: input.data.message,
          slackChannelId: input.data.slackChannel,
          sendAt: input.data.sendAt,
          timezone: input.data.timezone,
        },
      })
    ),
});
