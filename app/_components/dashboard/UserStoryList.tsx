/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import { db } from "@/config/db";
import { StoryData } from "@/config/schema";
import { Story } from "@/types";
import { useUser } from "@clerk/nextjs";
import { desc, eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import StoryItemCard from "./StoryItemCard";
import UserStorySkeleton from "./UserStorySkeleton";
import { NoStoriesIllustration } from "./NoStoriesIllustration"; // Import NextUI Button
import { TiPlus } from "react-icons/ti";
import { Button } from "@heroui/button";
import { useRouter } from "next/navigation";

const UserStoryList = () => {
  const { user } = useUser();
  const router = useRouter();
  const [storyList, setStoryList] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    getUserStory();
  }, [user]);

  const getUserStory = async () => {
    try {
      setLoading(true);
      const response = await db
        .select()
        .from(StoryData)
        .where(
          eq(
            StoryData.userEmail,
            user?.primaryEmailAddress?.emailAddress as string
          )
        )
        .orderBy(desc(StoryData?.id));
      setStoryList(response as Story[]);
    } catch (error) {
      console.error("Error fetching story:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStory = () => {
    router.push("/create");
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 mt-10">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
          <UserStorySkeleton key={item} />
        ))}
      </div>
    );
  }

  if (storyList.length === 0 && !loading) {
    return <NoStoriesIllustration />;
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 mt-10">
        {storyList.map((story: Story) => (
          <div key={story.id}>
            <StoryItemCard story={story} />
          </div>
        ))}
      </div>

      {storyList.length > 0 && (
        <div className="fixed bottom-10 right-10 z-50">
          <Button
            isIconOnly
            color="primary"
            aria-label="Create Story"
            className="shadow-lg hover:scale-105 transition-transform"
            onPress={handleCreateStory}
          >
            <TiPlus className="h-5 w-5" />
          </Button>
        </div>
      )}
    </>
  );
};

export default UserStoryList;
