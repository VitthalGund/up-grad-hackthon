import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { z } from "zod";
import prisma from "../../../lib/prisma";
import { InteractionType } from "@prisma/client";

const interactionSchema = z.object({
  contentNodeId: z.string().cuid(),
  interactionType: z.nativeEnum(InteractionType),
  data: z.record(z.unknown()),
});

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

    const newInteraction = await prisma.userInteraction.create({
      data: {
        userId,
        contentNodeId,
        interactionType,
        data,
      },
    });

    return res.status(201).json(newInteraction);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }
    console.error("Failed to create interaction:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
