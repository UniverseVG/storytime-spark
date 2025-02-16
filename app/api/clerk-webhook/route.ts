import type { WebhookEvent } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { Users } from "@/config/schema";
import { db } from "@/config/db";
import { headers } from "next/headers";
import { Webhook } from "svix";

export async function POST(req: Request) {
  try {
    const WEBHOOK_SECRET =
      process.env.SIGNING_SECRET || "whsec_tO06Y6yQ/Zx+5j+ymokunl7XZsx+esdi";

    if (!WEBHOOK_SECRET) {
      console.error("Webhook secret is missing in environment variables.");
      return NextResponse.json(
        { error: "Server misconfiguration" },
        { status: 500 }
      );
    }

    const headerPayload = await headers();
    const svixId = headerPayload.get("svix-id");
    const svixTimestamp = headerPayload.get("svix-timestamp");
    const svixSignature = headerPayload.get("svix-signature");

    if (!svixId || !svixTimestamp || !svixSignature) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payload = await req.text();

    try {
      const wh = new Webhook(WEBHOOK_SECRET);
      wh.verify(payload, {
        "svix-id": svixId,
        "svix-timestamp": svixTimestamp,
        "svix-signature": svixSignature,
      });
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
    }

    const evt = JSON.parse(payload) as WebhookEvent;
    const { id: clerkUserId } = evt.data;

    if (!clerkUserId) {
      return NextResponse.json(
        { error: "No user ID provided" },
        { status: 400 }
      );
    }

    let user = null;

    switch (evt.type) {
      case "user.created": {
        const { email_addresses, image_url, first_name, last_name } = evt.data;
        user = await db
          .insert(Users)
          .values({
            userName: `${first_name} ${last_name}`.trim(),
            userEmail: email_addresses?.[0]?.email_address || null,
            userImage: image_url || null,
          })
          .returning({
            userEmail: Users.userEmail,
            userName: Users.userName,
            userImage: Users.userImage,
            credits: Users.credit,
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
