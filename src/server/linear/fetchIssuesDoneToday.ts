import { LinearClient } from "@linear/sdk";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export const fetchDoneIssuesToday = async (apiKey: string, tz: string) => {
  const client = new LinearClient({ apiKey });
  try {
    const today = dayjs().tz(tz).startOf("day").toDate();
    const result = await client.issues({
      filter: {
        completedAt: {
          gte: today,
        },
      },
    });

    if (result?.nodes) {
      return result.nodes;
    } else {
      throw new Error("Failed to fetch issues");
    }
  } catch (error) {
    console.error("Error fetching issues:", error);
    return [];
  }
};
