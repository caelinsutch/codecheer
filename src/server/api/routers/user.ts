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
});
