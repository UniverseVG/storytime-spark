import { NextResponse } from "next/server";
import { Users } from "@/config/schema";
import { db } from "@/config/db";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { email, name, image } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Check if user already exists
    const existingUser = await db
      .select()
      .from(Users)
      .where(eq(Users.userEmail, email));

    if (existingUser.length > 0) {
      return NextResponse.json({ user: existingUser[0] });
    }

    // Insert new user
    const [newUser] = await db
      .insert(Users)
      .values({
        userName: name,
        userEmail: email,
        userImage: image,
      })
      .returning({
        userEmail: Users.userEmail,
        userName: Users.userName,
        userImage: Users.userImage,
        credits: Users.credit,
      });

    return NextResponse.json({ user: newUser });
  } catch (error) {
    console.error("User API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
