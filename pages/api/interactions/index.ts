import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { z } from "zod";
import Redis from "ioredis";
import { InteractionType } from "@prisma/client";

const interactionSchema = z.object({
  contentNodeId: z.string().cuid(),
  interactionType: z.nativeEnum(InteractionType),
  data: z.record(z.unknown()),
});

const redis = new Redis(process.env.REDIS_URL!);
const INTERACTION_QUEUE_KEY = "interaction-queue";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const session = await getSession({ req });
  if (!session?.user?.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const userId = session.user.id;

  try {
    const { contentNodeId, interactionType, data } = interactionSchema.parse(
      req.body
    );

    const eventPayload = {
      userId,
      contentNodeId,
      interactionType,
      data,
      timestamp: new Date().toISOString(),
    };

    await redis.lpush(INTERACTION_QUEUE_KEY, JSON.stringify(eventPayload));

    return res
      .status(202)
      .json({ message: "Interaction accepted for processing." });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    console.error("Failed to queue interaction:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
