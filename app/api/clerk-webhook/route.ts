import type { WebhookEvent } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { Users } from "@/config/schema";
import { db } from "@/config/db";

export async function POST(req: Request) {
  try {
    const evt = (await req.json()) as WebhookEvent;
    console.log({ evt });

    const { id: clerkUserId } = evt.data;

    if (!clerkUserId)
      return NextResponse.json(
        { error: "No user ID provided" },
        { status: 400 }
      );

    let user = null;

    switch (evt.type) {
      case "user.created": {
        console.log("coming here", evt);
        const { email_addresses, image_url, first_name, last_name } = evt.data;
        user = await db
          .insert(Users)
          .values({
            userName: `${first_name} ${last_name}`.trim(),
            userEmail: email_addresses?.[0]?.email_address || null,
            userImage: image_url || null,
          })
          .returning({
            userEmail: Users?.userEmail,
            userName: Users?.userName,
            userImage: Users?.userImage,
            credits: Users?.credit,
          });

        break;
      }

      default:
        return NextResponse.json(
          { error: "Unhandled event type" },
          { status: 400 }
        );
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Clerk Webhook Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
