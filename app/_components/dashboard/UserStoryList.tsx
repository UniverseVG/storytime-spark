"use client";
import { db } from "@/config/db";
import { StoryData } from "@/config/schema";
import { Story } from "@/types";
import { useUser } from "@clerk/nextjs";
import { desc, eq } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import StoryItemCard from "./StoryItemCard";
import UserStorySkeleton from "./UserStorySkeleton";

const UserStoryList = () => {
  const { user } = useUser();
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
      if (response?.length) {
        setStoryList(response as Story[]);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching story:", error);
    } finally {
      setLoading(false);
    }
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
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 mt-10">
        {storyList &&
          storyList.map((story: Story) => (
            <div key={story.id}>
              <StoryItemCard story={story} />
            </div>
          ))}
      </div>
    </div>
  );
};

export default UserStoryList;
