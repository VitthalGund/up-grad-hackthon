import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import prisma from "../../../../lib/prisma";
import axios from "axios";

const MASTERY_THRESHOLD = 0.8; // 80%

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const session = await getSession({ req });
  if (!session?.user?.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { attemptId, userAnswers } = req.body;
  if (!attemptId || !userAnswers) {
    return res
      .status(400)
      .json({ message: "attemptId and userAnswers are required." });
  }

  try {
    const quizAttempt = await prisma.quizAttempt.findUnique({
      where: { id: attemptId },
    });

    if (!quizAttempt || quizAttempt.userId !== session.user.id) {
      return res.status(403).json({ message: "Forbidden." });
    }

    // Call the Python service to evaluate the answers
    const evalResponse = await axios.post(
      `${process.env.PERSONALIZATION_ENGINE_URL}/quiz/evaluate`,
      {
        questions: quizAttempt.questions,
        userAnswers: userAnswers,
      },
      { headers: { "X-Internal-API-Key": process.env.INTERNAL_API_KEY } }
    );

    const { score, results } = evalResponse.data;

    const finalStatus = score >= MASTERY_THRESHOLD ? "PASSED" : "FAILED";

    // Update the QuizAttempt in our database with the score and final status
    const updatedAttempt = await prisma.quizAttempt.update({
      where: { id: attemptId },
      data: {
        score,
        status: finalStatus,
        userAnswers: { answers: userAnswers, results: results }, // Store answers and correctness
      },
    });

    res.status(200).json({
      score: updatedAttempt.score,
      status: updatedAttempt.status,
      results: (updatedAttempt.userAnswers as any).results,
    });
  } catch (error) {
    console.error("Failed to submit quiz:", error);
    res.status(500).json({ message: "An internal error occurred." });
  }
}
