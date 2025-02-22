import { NextRequest, NextResponse } from "next/server";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { storage } from "@/config/firebaseConfig";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { base64Image } = body;
    if (!base64Image) {
      return NextResponse.json(
        { error: "No image data provided" },
        { status: 400 }
      );
    }

    const fileName = `/storytime-ai/${Date.now()}.png`;
    const imageRef = ref(storage, fileName);

    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");

    await uploadString(imageRef, base64Data, "base64").then((snapshot) => {
      console.log("Uploaded a base64 image!", snapshot);
    });

    const downloadURL = await getDownloadURL(imageRef);

    return NextResponse.json({ imageUrl: downloadURL });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to upload image", details: error },
      { status: 500 }
    );
  }
}
