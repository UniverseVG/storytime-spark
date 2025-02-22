import { NextRequest, NextResponse } from "next/server";
import { experimental_generateImage as generateImage } from "ai";
import { createVertex } from "@ai-sdk/google-vertex/edge";

const vertex = createVertex({
  location: process.env.NEXT_PUBLIC_GOOGLE_LOCATION!,
  project: process.env.NEXT_PUBLIC_GOOGLE_PROJECT!,
  googleCredentials: {
    clientEmail: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_EMAIL!,
    privateKey: process.env.NEXT_PUBLIC_GOOGLE_PRIVATE_KEY?.replace(
      /\\n/g,
      "\n"
    ) as string,
  },
});

const MODEL_ID = process.env.NEXT_PUBLIC_GOOGLE_MODEL_NAME!;
const DEFAULT_PROMPT = "A futuristic cityscape at sunset";
const DEFAULT_ASPECT_RATIO = "16:9";

export async function POST(req: NextRequest) {
  try {
    const { prompt = DEFAULT_PROMPT } = await req.json();

    const { image } = await generateImage({
      model: vertex.image(MODEL_ID),
      prompt,
      aspectRatio: DEFAULT_ASPECT_RATIO,
      providerOptions: { vertex: { addWatermark: false } },
    });

    return NextResponse.json({
      image: `data:image/png;base64,${image.base64}`,
    });
  } catch (error) {
    console.error("Error generating image:", error);
    return NextResponse.json(
      { error: "Failed to generate image" },
      { status: 500 }
    );
  }
}
