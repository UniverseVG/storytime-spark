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
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    GetAllStories(0);
  }, []);
  const GetAllStories = async (offset: number) => {
    setLoading(true);
    setOffset(offset);
    try {
      const response = await db
        .select()
        .from(StoryData)
        .orderBy(desc(StoryData.id))
        .limit(4)
        .offset(offset);
      if (!response) return;
      setStories((prev) =>
        offset === 0
          ? (response as Story[])
          : [...prev, ...(response as Story[])]
      );
    } catch (error) {
      console.error("Error fetching stories:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen p-10 md:px-20 lg:px-40">
      <h2 className="font-bold text-4xl text-center text-primary">
        Explore More Stories
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10 mt-10">
        {stories.map((story: Story, index) => (
          <div key={index}>
            <StoryItemCard story={story} />
          </div>
        ))}
        {loading &&
          [1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
            <UserStorySkeleton key={item} />
          ))}
      </div>

      <div className="flex items-center justify-center mt-10">
        {!loading && (
          <Button
            color="primary"
            size="lg"
            onClick={() => GetAllStories(offset + 4)}
          >
            Load More
          </Button>
        )}
      </div>
    </div>
  );
};

export default ExploreStories;
