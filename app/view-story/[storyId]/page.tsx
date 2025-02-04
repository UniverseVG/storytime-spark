/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";
import BookCoverPage from "@/app/_components/storDetail/BookCoverPage";
import LastPage from "@/app/_components/storDetail/LastPage";
import StoryPages from "@/app/_components/storDetail/StoryPages";
import { db } from "@/config/db";
import { StoryData } from "@/config/schema";
import { Chapter, Story } from "@/types";
import { eq } from "drizzle-orm";
import React, { useEffect, useRef, useState } from "react";
import { use } from "react";
import HTMLFlipBook from "react-pageflip";
import {
  IoIosArrowDropleftCircle,
  IoIosArrowDroprightCircle,
} from "react-icons/io";

const ViewStory = ({ params }: { params: Promise<{ storyId: string }> }) => {
  const resolvedParams = use(params);
  const bookRef = useRef<any>(null);
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);

  useEffect(() => {
    getStory();
  }, []);

  const getStory = async () => {
    try {
      setLoading(true);
      const response = await db
        .select()
        .from(StoryData)
        .where(eq(StoryData.storyId, resolvedParams.storyId));
      if (response?.[0]) {
        setStory(response[0] as Story);
        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching story:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="p-10 md:px-20 lg:px-40">Loading...</div>;
  }

  return (
    <div className="p-10 md:px-20 lg:px-40">
      <h2 className="font-bold text-4xl text-center p-10 bg-primary text-white rounded-2xl">
        {story?.output?.bookTitle}
      </h2>
      <div className="relative flex justify-center">
        {/* @ts-expect-error */}
        <HTMLFlipBook
          width={500}
          height={500}
          className="mt-10 w-full"
          showCover
          useMouseEvents={false}
          ref={bookRef}
        >
          <div>
            <BookCoverPage imageUrl={story?.coverImage || ""} />
          </div>
          {[...Array(story?.output?.chapters?.length)].map((item, index) => (
            <div key={index} className="bg-white p-10 border">
              <StoryPages
                storyChapter={story?.output?.chapters[index] as Chapter}
              />
            </div>
          ))}
          <div>
            <LastPage />
          </div>
        </HTMLFlipBook>

        {count !== 0 && (
          <div
            className="absolute -left-6 top-1/2 -translate-y-1/2"
            onClick={() => {
              bookRef.current?.pageFlip().flipPrev();
              setCount(count - 1);
            }}
          >
            <IoIosArrowDropleftCircle className="text-[50px] text-primary cursor-pointer" />
          </div>
        )}

        {count !== (story?.output?.chapters?.length || 0) && (
          <div
            className="absolute -right-6 top-1/2 -translate-y-1/2"
            onClick={() => {
              bookRef.current?.pageFlip().flipNext();
              setCount(count + 1);
            }}
          >
            <IoIosArrowDroprightCircle className="text-[50px] text-primary cursor-pointer" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewStory;
