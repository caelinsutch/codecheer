import { type NextApiRequest, type NextApiResponse } from "next";
import { createTRPCContext } from "~/server/api/trpc";
import { env } from "~/env.mjs";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { session } = await createTRPCContext({ req, res });
  if (!session?.user) return res.status(403).json({ error: "Not Authorized" });

  if (req.method === "GET") {
    const clientId = env.SLACK_CLIENT_ID;
    const scopes =
      "commands,chat:write,channels:join,channels:read,chat:write.public,groups:read,groups:write,im:read,im:write,mpim:read,mpim:write,users:read,users:read.email,users.profile:read,users:write";
    const redirectUri = env.SLACK_REDIRECT_URL;

    const installUrl = `https://slack.com/oauth/v2/authorize?client_id=${clientId}&scope=${scopes}&redirect_uri=${redirectUri}`;

    res.redirect(installUrl);
  } else {
    res.status(405).send("Method not allowed");
  }
};
