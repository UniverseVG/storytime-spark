"use client";
import { db } from "@/config/db";
import { StoryData } from "@/config/schema";
import { Story } from "@/types";
import { desc } from "drizzle-orm";
import React, { useEffect, useState } from "react";
import StoryItemCard from "../_components/dashboard/StoryItemCard";
import { Button } from "@heroui/button";
import UserStorySkeleton from "../_components/dashboard/UserStorySkeleton";

const ExploreStories = () => {
  const [stories, setStories] = useState<Story[]>([]);
  const [offset, setOffset] = useState(0);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    GetAllStories(0);
  }, []);
  const GetAllStories = async (offsetValue: number) => {
    try {
      setOffset(offsetValue);
      const response = await db
        .select()
        .from(StoryData)
        .orderBy(desc(StoryData.id))
        .limit(4)
        .offset(offsetValue);
      if (!response) return;

      setStories((prev) => [...prev, ...(response as Story[])]);
    } catch (error) {
      console.error("Error fetching stories:", error);
    } finally {
      setLoading(false);
    }
  };
  console.log(stories);

  return (
    <div className="min-h-screen p-10 md:px-20 lg:px-40">
      <h2 className="font-bold text-4xl text-center text-primary">
        Explore More Stories
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 mt-10">
        {loading
          ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((item) => (
              <UserStorySkeleton key={item} />
            ))
          : stories.map((story: Story) => (
              <div key={story.id}>
                <StoryItemCard story={story} />
              </div>
            ))}
      </div>

      <div className="flex items-center justify-center mt-10">
        <Button
          color="primary"
          size="lg"
          onClick={() => GetAllStories(offset + 4)}
        >
          Load More
        </Button>
      </div>
    </div>
  );
};

export default ExploreStories;
