import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import prisma from "../../../lib/prisma";
import { LearnerReport } from "@prisma/client";

// Define a type for the shape of our report data for better type safety
interface ReportData {
  summary: string;
  details: object | null; // Details can be an object or null
  strengths: string[];
  weaknesses: string[];
  engagementScore: number;
}

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
    // 2. Fetch the user's subscription tier and all their reports in a single, efficient query.
    const userWithReports = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        subscriptionTier: true,
        reports: {
          orderBy: {
            generatedAt: "desc", // Order reports from newest to oldest
          },
        },
      },
    });

    if (!userWithReports) {
      return res.status(404).json({ message: "User not found" });
    }

    const { subscriptionTier, reports } = userWithReports;

    // --- START OF TIER-BASED LOGIC ---

    // 3. If the user is on the FREE tier, redact the detailed part of each report.
    if (subscriptionTier === "FREE") {
      const summarizedReports = reports.map((report: LearnerReport) => {
        // Cast the JSON blob to our defined type
        const reportData = report.reportData as ReportData;

        // Create a new report object, returning only the summary part
        return {
          ...report, // Copy all top-level fields like id, generatedAt, etc.
          reportData: {
            summary: reportData.summary,
            // Explicitly set 'details' to null and provide a CTA
            details: null,
            strengths: reportData.strengths,
            weaknesses: reportData.weaknesses,
            upgradePrompt:
              "Upgrade to Premium to unlock detailed analysis and insights.",
          },
        };
      });
      return res.status(200).json(summarizedReports);
    }

    // 4. If the user is PREMIUM (or any other non-free tier), return the full, unmodified reports.
    return res.status(200).json(reports);

    // --- END OF TIER-BASED LOGIC ---
  } catch (error) {
    console.error("Failed to fetch user reports:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
