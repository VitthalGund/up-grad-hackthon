import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import prisma from "../../../../lib/prisma";
import axios from "axios";

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

  const { contentNodeId } = req.body;
  if (!contentNodeId) {
    return res.status(400).json({ message: "contentNodeId is required." });
  }

  try {
    const contentNode = await prisma.contentNode.findUnique({
      where: { id: contentNodeId },
    });

    if (!contentNode) {
      return res.status(404).json({ message: "Content not found." });
    }

    const sourceText = contentNode.transcript;

    if (!sourceText) {
      return res.status(400).json({
        message: "No transcript or source text found for this content.",
      });
    }

    const quizResponse = await axios.post(
      `${process.env.PERSONALIZATION_ENGINE_URL}/quiz/generate`,
      { source_text: sourceText },
      { headers: { "X-Internal-API-Key": process.env.INTERNAL_API_KEY } }
    );

    res.status(200).json(quizResponse.data);
  } catch (error) {
    console.error("Failed to generate quiz:", error);
    res.status(500).json({ message: "An internal error occurred." });
  }
}
