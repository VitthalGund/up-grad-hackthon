import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import prisma from "../../../lib/prisma";
import getDriveClient from "../../../lib/googleDrive";
import { NodeType } from "@prisma/client";
import axios from "axios"; // Import axios

/**
 * ACTUAL PERSONALIZATION LOGIC
 * This function calls the external Python Decision-Making Service to get the next activity.
 */
async function getNextActivityRecommendation(
  userId: string
): Promise<string | null> {
  try {
    // 1. Make a POST request to the Python service endpoint.
    const response = await axios.post(
      `${process.env.PERSONALIZATION_ENGINE_URL}/recommend`,
      {
        userId: userId, // Send the user's ID in the request body
      }
    );

    // 2. Expect a response containing the next contentNodeId.
    const nextNodeId = response.data?.contentNodeId;

    if (typeof nextNodeId === "string") {
      return nextNodeId;
    }

    // If the response is malformed, return null.
    return null;
  } catch (error) {
    // 3. If the Python service is down or returns an error, log it and fail gracefully.
    console.error(
      "Error fetching recommendation from personalization engine:",
      error
    );
    // In a real-world scenario, you might have fallback logic here,
    // but for now, we'll return null.
    return null;
  }
}

export default async function handler(
  // ... the rest of the handler function remains exactly the same
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  // 1. Ensure user is authenticated
  const session = await getSession({ req });
  if (!session?.user?.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // 2. Get the recommended next activity ID from our REAL logic
    const nextNodeId = await getNextActivityRecommendation(session.user.id);

    if (!nextNodeId) {
      return res
        .status(404)
        .json({ message: "Could not determine next activity." });
    }

    // 3. Fetch the full content for the recommended node
    const contentNode = await prisma.contentNode.findUnique({
      where: { id: nextNodeId },
    });

    if (!contentNode) {
      return res
        .status(404)
        .json({ message: "Recommended content not found." });
    }

    // 4. If the content is a video, fetch its streamable link
    if (
      contentNode.nodeType === NodeType.VIDEO &&
      contentNode.googleDriveFileId
    ) {
      const drive = await getDriveClient();
      const fileMetadata = await drive.files.get({
        fileId: contentNode.googleDriveFileId,
        fields: "webContentLink, webViewLink",
      });

      const responseData = {
        ...contentNode,
        videoLinks: {
          download: fileMetadata.data.webContentLink,
          view: fileMetadata.data.webViewLink,
        },
      };

      return res.status(200).json(responseData);
    }

    // 5. Return the content node to the frontend
    return res.status(200).json(contentNode);
  } catch (error) {
    console.error("Failed to get next activity:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
