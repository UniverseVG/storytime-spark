import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
import { storage } from "@/config/firebaseConfig";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { url } = body;

  const base64Image = "data:image/png;base64," + (await convertImage(url));
  console.log({ base64Image });

  const fileName = `/storytime-ai/${Date.now()}.png`;
  const imageRef = ref(storage, fileName);

  await uploadString(imageRef, base64Image, "data_url").then((snapshot) => {
    console.log("Uploaded a blob or file!", snapshot);
  });

  const downloadURL = await getDownloadURL(imageRef);
  console.log(downloadURL);

  return NextResponse.json({ imageUrl: downloadURL });
}

const convertImage = async (imageUrl: string) => {
  try {
    console.log("Converting image:", imageUrl);

    const response = await axios.get(imageUrl, {
      responseType: "arraybuffer",
    });

    const base64Image = Buffer.from(response.data).toString("base64");
    return base64Image;
  } catch (error) {
    console.log("Error converting image:", { error });
  }
};
