import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import prisma from "../../../lib/prisma";
import getDriveClient from "../../../lib/googleDrive"; // Import our new helper
import { NodeType } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { nodeId } = req.query;
  if (typeof nodeId !== "string") {
    return res.status(400).json({ message: "Invalid Node ID" });
  }

  try {
    const contentNode = await prisma.contentNode.findUnique({
      where: { id: nodeId },
    });

    if (!contentNode) {
      return res.status(404).json({ message: "Content not found" });
    }

    // --- START OF NEW LOGIC ---
    // If the content is a video, fetch its streamable link from Google Drive
    if (
      contentNode.nodeType === NodeType.VIDEO &&
      contentNode.googleDriveFileId
    ) {
      const drive = await getDriveClient();

      const fileMetadata = await drive.files.get({
        fileId: contentNode.googleDriveFileId,
        fields: "webContentLink, webViewLink", // Request specific fields
      });

      // Combine the original node data with the new video links
      const responseData = {
        ...contentNode,
        videoLinks: {
          download: fileMetadata.data.webContentLink, // This link streams/downloads the file
          view: fileMetadata.data.webViewLink, // This link opens it in Google Drive viewer
        },
      };

      return res.status(200).json(responseData);
    }

    return res.status(200).json(contentNode);
  } catch (error) {
    console.error("Failed to fetch content node:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
