/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { prompt } = await req.json();

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_AZURE_OPENAI_ENDPOINT}`,
      {
        method: "POST",
        headers: new Headers({
          "Content-Type": "application/json",
          "api-key": process.env.NEXT_PUBLIC_AZURE_OPENAI_KEY!,
        }),
        body: JSON.stringify({
          prompt,
          n: 1,
          size: "1024x1024",
          quality: "hd",
          style: "vivid",
        }),
      }
    );
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { message: "Error generating image", error: error.message },
      { status: 500 }
    );
  }
}
