"use client";
import React, { useContext, useState } from "react";
import StorySubjectInput from "../_components/createStory/StorySubjectInput";
import StoryType from "../_components/createStory/StoryType";
import AgeGroup from "../_components/createStory/AgeGroup";
import ImageStyle from "../_components/createStory/ImageStyle";
import { Button } from "@heroui/button";
import { chatSession } from "@/config/geminiAi";
import CustomLoader from "../_components/CustomLoader";
import axios from "axios";
import { toast } from "react-toastify";
import { useUser } from "@clerk/nextjs";
import { StoryData, Users } from "@/config/schema";
import uuid4 from "uuid4";
import { db } from "@/config/db";
import { useRouter } from "next/navigation";
import { UserDetailContext } from "../_context/UserDetailContext";
import { eq } from "drizzle-orm";

const CREATE_STORY_PROMPT = process.env.NEXT_PUBLIC_CREATE_STORY_PROMPT;

export interface FieldData {
  fieldValue: string;
  fieldName: string;
}

export interface FormData {
  storySubject: string;
  storyType: string;
  ageGroup: string;
  imageStyle: string;
}

const Create = () => {
  const [formData, setFormData] = useState<FormData>({
    storySubject: "",
    storyType: "",
    ageGroup: "",
    imageStyle: "",
  });
  const [loading, setLoading] = useState<boolean>(false);
  const router = useRouter();
  const notify = (msg: string) => {
    toast(msg, {});
  };
  const notifyError = (msg: string) => {
    toast.error(msg);
  };
  const { user } = useUser();
  const context = useContext(UserDetailContext);
  const userDetail = context?.userDetail;

  const onHandleUserSelection = (data: FieldData) => {
    setFormData((prev: FormData) => ({
      ...prev,
      [data.fieldName]: data.fieldValue,
    }));
  };

  const GenerateStory = async () => {
    if ((userDetail?.credit as number) <= 0) {
      notifyError("You don't have enough credits to create a story");
      return;
    }
    setLoading(true);
    if (
      formData.storySubject === "" ||
      formData.storyType === "" ||
      formData.ageGroup === "" ||
      formData.imageStyle === ""
    ) {
      notifyError("Please fill all the fields");
      setLoading(false);
      return;
    }
    const FINAL_PROMPT = CREATE_STORY_PROMPT?.replace(
      "{ageGroup}",
      formData.ageGroup
    )
      .replace("{storyType}", formData.storyType)
      .replace("{imageStyle}", formData.imageStyle)
      .replace("{storySubject}", formData.storySubject);
    try {
      const result = await chatSession.sendMessage(FINAL_PROMPT!);
      if (!result.response.text()) {
        notifyError("Something went wrong, please try again");
        setLoading(false);
        return;
      }
      const storyTitle = JSON.parse(result.response.text());
      const imageResponse = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: `Generate a detailed and vibrant book cover based on "${storyTitle?.cover?.imagePrompt}", reflecting the book's genre. Ensure the title "${storyTitle?.bookTitle}" is overlaid in bold, elegant text at the center or top of the image for a professional look.`,
        }),
      });

      const imageData = await imageResponse.json();

      const imageUrl = imageData?.data?.[0]?.url;
      if (!imageUrl) {
        notifyError("Something went wrong, please try again");
        setLoading(false);
        return;
      }
      const storeImage = await axios.post("/api/save-image", {
        url: imageUrl,
      });

      if (!storeImage?.data?.imageUrl) {
        notifyError("Something went wrong, please try again");
        setLoading(false);
        return;
      }
      const response = await saveInDB(
        result.response.text(),
        storeImage?.data?.imageUrl
      );

      if (response?.[0]?.storyId) {
        const updateUserCredit = await UpdateUserCredit();
        if (updateUserCredit?.[0]?.id) {
          notify("Story generated successfully");
          router.replace(`/view-story/${response?.[0]?.storyId}`);
        }
      }
      setLoading(false);
    } catch (e) {
      console.error(e);
      notifyError("Something went wrong, please try again");
      setLoading(false);
    }
  };

  const saveInDB = async (output: string, imageUrl: string) => {
    const recordId = uuid4();
    try {
      const result = await db
        .insert(StoryData)
        .values({
          storyId: recordId,
          ageGroup: formData.ageGroup,
          imageStyle: formData.imageStyle,
          storySubject: formData.storySubject,
          storyType: formData.storyType,
          output: JSON.parse(output),
          coverImage: imageUrl,
          userEmail: user?.primaryEmailAddress?.emailAddress,
          userName: user?.fullName,
          userImage: user?.imageUrl,
        })
        .returning({ storyId: StoryData?.storyId });
      return result;
    } catch (e) {
      console.error(e);
    }
  };

  const UpdateUserCredit = async () => {
    try {
      const result = await db
        .update(Users)
        .set({
          credit: Number((userDetail?.credit as number) - 1),
        })
        .where(
          eq(Users.userEmail, user?.primaryEmailAddress?.emailAddress as string)
        )
        .returning({ id: Users.id });
      return result;
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="container mx-auto p-6 sm:p-10 md:px-20 lg:px-40">
      {/* Page Heading */}
      <h2 className="font-extrabold text-center text-4xl sm:text-5xl md:text-6xl lg:text-[70px] text-primary">
        Create Story
      </h2>
      <p className="text-center mt-4 text-base sm:text-lg md:text-2xl text-primary">
        Unlock your creativity with AI: Craft stories like never before! Let our
        AI bring your imagination to life, one story at a time.
      </p>

      {/* Form Components */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10">
        <StorySubjectInput userSelection={onHandleUserSelection} />
        <StoryType userSelection={onHandleUserSelection} />
        <AgeGroup userSelection={onHandleUserSelection} />
        <ImageStyle userSelection={onHandleUserSelection} />
      </div>

      {/* Generate Story Button */}
      <div className="flex flex-col items-center gap-4 my-10">
        <Button
          color="primary"
          isDisabled={loading}
          className="px-6 py-4 text-lg sm:text-2xl"
          onClick={GenerateStory}
          isLoading={loading}
        >
          {loading ? "Generating your story..." : "Generate Story"}
        </Button>
        <span className="text-sm text-primary">
          1 Credit per story generation
        </span>
      </div>

      <CustomLoader isLoading={loading} />
    </div>
  );
};

export default Create;
