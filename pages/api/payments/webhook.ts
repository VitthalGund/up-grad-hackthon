import { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import prisma from "../../../lib/prisma";
import { buffer } from "micro";

// IMPORTANT: Disable Next.js's default body parser for this route
// as we need the raw body to verify the webhook signature.
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const rawBody = await buffer(req);
  const signature = req.headers["x-razorpay-signature"] as string;
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET!;

  try {
    // 1. Verify the webhook signature to ensure the request is from Razorpay.
    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody.toString())
      .digest("hex");

    if (expectedSignature !== signature) {
      return res.status(400).json({ message: "Invalid signature" });
    }

    // 2. If the signature is valid, process the event.
    const event = JSON.parse(rawBody.toString());

    // We are interested in the 'payment.captured' event.
    if (event.event === "payment.captured") {
      const { userId } = event.payload.payment.entity.notes;

      // 3. Update the user's subscription in the database.
      await prisma.user.update({
        where: { id: userId },
        data: {
          subscriptionTier: "PREMIUM",
          // Grant a generous amount of hint credits upon upgrade
          hintCredits: {
            increment: 100,
          },
        },
      });
    }

    // 4. Acknowledge receipt of the event.
    return res.status(200).json({ status: "ok" });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
