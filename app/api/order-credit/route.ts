import Razorpay from "razorpay";
import { NextRequest, NextResponse } from "next/server";

const razorpay = new Razorpay({
  key_id: process.env.NEXT_PUBLIC_KEY_ID!,
  key_secret: process.env.NEXT_PUBLIC_KEY_SECRET,
});

export async function POST(request: NextRequest) {
  const { amount, currency } = (await request.json()) as {
    amount: string;
    currency: string;
  };

  const options = {
    amount: amount,
    currency: currency,
    receipt: "rcp1",
  };
  const order = await razorpay.orders.create(options);
  return NextResponse.json({ orderId: order.id }, { status: 200 });
}
