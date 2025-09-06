import { PrismaClient } from "@prisma/client";
import type { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  try {
    const { userId, contentNodeId, interactionType, data } = req.body;

    if (!userId || !contentNodeId || !interactionType) {
      return res.status(400).json({ message: "Missing required fields" });
    }

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
    console.error("Failed to create interaction:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
