import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { z } from "zod";
import prisma from "../../../lib/prisma";
import { NodeType } from "@prisma/client";

// 1. Define a Zod schema to validate the incoming request body.
const useHintSchema = z.object({
  contentNodeId: z.string().cuid("Invalid content ID format"),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  // 2. Ensure the user is authenticated and get their session.
  const session = await getSession({ req });
  if (!session?.user?.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const userId = session.user.id;

  try {
    // 3. Validate the request body.
    const { contentNodeId } = useHintSchema.parse(req.body);

    let hintData: any = null;

    // 4. Use a database transaction to ensure atomicity.
    // This prevents race conditions where a user might be able to spend the same credit twice.
    await prisma.$transaction(async (tx) => {
      // Get the current user from within the transaction.
      const user = await tx.user.findUnique({
        where: { id: userId },
        select: { hintCredits: true },
      });

      // 5. Check if the user has enough credits.
      if (!user || user.hintCredits <= 0) {
        // Throw an error to automatically roll back the transaction.
        throw new Error("INSUFFICIENT_CREDITS");
      }

      // 6. Decrement the user's hint credits.
      await tx.user.update({
        where: { id: userId },
        data: {
          hintCredits: {
            decrement: 1,
          },
        },
      });

      // 7. Fetch the hint from the content node.
      const contentNode = await tx.contentNode.findUnique({
        where: { id: contentNodeId },
        select: { contentJson: true, nodeType: true },
      });

      if (!contentNode || contentNode.nodeType !== NodeType.QUIZ) {
        throw new Error("INVALID_CONTENT");
      }

      // Assume the hint is stored in a 'hint' key within the JSON.
      hintData = (contentNode.contentJson as any)?.hint;

      if (!hintData) {
        throw new Error("HINT_NOT_FOUND");
      }
    });

    // 8. If the transaction was successful, return the hint.
    return res.status(200).json({ hint: hintData });
  } catch (error: any) {
    // Handle our specific, controlled errors.
    if (error.message === "INSUFFICIENT_CREDITS") {
      return res.status(402).json({
        message: "Insufficient hint credits. Upgrade to Premium for more.",
      });
    }
    if (
      error.message === "INVALID_CONTENT" ||
      error.message === "HINT_NOT_FOUND"
    ) {
      return res
        .status(404)
        .json({ message: "Hint not available for this content." });
    }

    // Handle Zod validation errors.
    if (error instanceof z.ZodError) {
      return res.status(400).json({ errors: error.errors });
    }

    // Handle any other unexpected errors.
    console.error("Failed to use hint:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
