import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { razorpay } from "../../../lib/razorpay";

const PREMIUM_PLAN_AMOUNT_INR = 99;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  // 1. Ensure the user is authenticated.
  const session = await getSession({ req });
  if (!session?.user?.id) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const options = {
      amount: PREMIUM_PLAN_AMOUNT_INR * 100, // Amount in paise
      currency: "INR",
      receipt: `receipt_user_${session.user.id}_${Date.now()}`,
      notes: {
        userId: session.user.id, // IMPORTANT: Tag the order with our user ID
        plan: "Premium Annual",
      },
    };

    // 2. Create the order with Razorpay.
    const order = await razorpay.orders.create(options);

    if (!order) {
      return res.status(500).json({ message: "Failed to create order" });
    }

    // 3. Return the order details to the frontend.
    return res.status(200).json(order);
  } catch (error) {
    console.error("Razorpay order creation failed:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
