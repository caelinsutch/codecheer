import axios from "axios";
import { createTRPCContext } from "~/server/api/trpc";
import { NextApiRequest, NextApiResponse } from "next";

type SlackResponse = {
  ok: boolean;
  access_token: string;
  token_type: string;
  scope: string;
  bot_user_id: string;
  app_id: string;
  team: {
    name: string;
    id: string;
  };
  enterprise: {
    name: string;
    id: string;
  };
  authed_user: {
    id: string;
    scope: string;
    access_token: string;
    token_type: string;
  };
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { session, prisma } = await createTRPCContext({ req, res });
  if (!session?.user) return res.status(403).json({ error: "Not Authorized" });

  const code = req.query.code;

  if (!code) {
    return res.status(400).json({ error: "Missing code parameter" });
  }

  try {
    const response = await axios.post(
      "https://slack.com/api/oauth.v2.access",
      null,
      {
        params: {
          client_id: process.env.SLACK_CLIENT_ID,
          client_secret: process.env.SLACK_CLIENT_SECRET,
          code: code,
          redirect_uri: `${process.env.NEXT_PUBLIC_DOMAIN}/api/slack/callback`,
        },
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    if (response.data.ok) {
      const data = response.data as SlackResponse;
      await prisma.user.update({
        where: {
          id: session.user.id,
        },
        data: {
          slackAccessToken: data.access_token,
        },
      });

      return res.redirect(`/?slackConnected=true`);
    } else {
      return res.redirect(`/?slackConnected=false`);
    }
  } catch (error: any) {
    console.error(error);
    return res.redirect(`/?slackConnected=false`);
  }
};
