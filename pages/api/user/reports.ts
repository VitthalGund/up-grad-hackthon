import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import prisma from "../../../lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  // 1. Ensure the user is authenticated.
  const session = await getSession({ req });
  if (!session?.user?.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const userId = session.user.id;

  try {
    // 2. Fetch all reports for the specific user from the database.
    // Order them by date, so the most recent report is first.
    const reports = await prisma.learnerReport.findMany({
      where: {
        userId: userId,
      },
      orderBy: {
        generatedAt: "desc",
      },
    });

    // 3. Return the array of reports.
    // If no reports exist, this will correctly return an empty array [].
    return res.status(200).json(reports);
  } catch (error) {
    console.error("Failed to fetch user reports:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
