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
    // 2. Fetch all required data in a single, efficient Prisma query.
    const userData = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        subscriptionTier: true,
        hintCredits: true,
        // Include the related learner profile
        profile: {
          select: {
            engagementScore: true,
            competenceMap: true,
          },
        },
        // Include the 5 most recent interactions
        interactions: {
          take: 5,
          orderBy: {
            createdAt: "desc",
          },
          // For each interaction, include the title of the content node
          include: {
            contentNode: {
              select: {
                title: true,
              },
            },
          },
        },
      },
    });

    if (!userData) {
      return res.status(404).json({ message: "User not found" });
    }

    // 3. Shape the data into a clean format for the frontend.
    const dashboardData = {
      user: {
        name: userData.name,
        subscriptionTier: userData.subscriptionTier,
        hintCredits: userData.hintCredits,
      },
      learnerProfile: userData.profile,
      recentActivity: userData.interactions.map((interaction) => ({
        title: interaction.contentNode.title,
        completedAt: interaction.createdAt,
      })),
    };

    return res.status(200).json(dashboardData);
  } catch (error) {
    console.error("Failed to fetch dashboard data:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
