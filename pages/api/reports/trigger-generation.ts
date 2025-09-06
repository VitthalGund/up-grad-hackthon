import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import axios from "axios";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const session = await getSession({ req });
  if (!session?.user?.id) {
    return res.status(401).end();
  }

  try {
    // Make the secure, internal call to our Python service
    await axios.post(
      `${process.env.PERSONALIZATION_ENGINE_URL}/reports/generate`,
      { userId: session.user.id },
      {
        headers: { "X-Internal-API-Key": process.env.INTERNAL_API_KEY },
      }
    );
    res.status(202).json({ message: "Report generation started." });
  } catch (error) {
    console.error("Failed to trigger report generation:", error);
    res.status(500).end();
  }
}
