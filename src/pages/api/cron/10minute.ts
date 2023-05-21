import { NextApiHandler } from "next";
import { createTRPCContext } from "~/server/api/trpc";
import { WebClient } from "@slack/web-api";
import { fetchDoneIssuesToday } from "~/server/linear/fetchIssuesDoneToday";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import * as handlebars from "handlebars";
import { compile } from "handlebars";

dayjs.extend(utc);
dayjs.extend(timezone);

const TenMinuteCron: NextApiHandler = async (req, res) => {
  const { prisma } = await createTRPCContext({ req, res });

  const users = await prisma.user.findMany({
    where: {
      slackAccessToken: {
        not: null,
      },
      slackChannelId: {
        not: null,
      },
      linearApiKey: {
        not: null,
      },
      sendAt: {
        not: null,
        gte: dayjs().subtract(10, "minute").toDate(),
        lte: dayjs().toDate(),
      },
      timezone: {
        not: null,
      },
    },
  });

  await Promise.all(
    users.map(async (user) => {
      if (
        !user.slackAccessToken ||
        !user.slackChannelId ||
        !user.linearApiKey ||
        !user.slackAccessToken ||
        !user.timezone
      )
        return;

      const issues = await fetchDoneIssuesToday(
        user.linearApiKey,
        user.timezone
      );

      const totalPoints = issues.reduce((acc, issue) => {
        return acc + (issue.estimate ?? 0);
      }, 0);

      const template = compile(user.message);
      const message = template({
        numIssuesCompleted: issues.length.toString(),
        numPointsCompleted: totalPoints.toString(),
      });

      const web = new WebClient(user.slackAccessToken);

      await web.conversations.join({
        channel: user.slackChannelId,
        token: user.slackAccessToken,
      });
      await web.chat.postMessage({
        channel: user.slackChannelId,
        text: message,
        token: user.slackAccessToken,
      });
    })
  );

  return res.status(200).json({ success: true });
};

export default TenMinuteCron;
