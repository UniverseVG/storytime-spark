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
import { Skeleton } from "@heroui/skeleton";

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

  return (
    <div className="p-4 md:p-10 md:px-12 lg:px-20">
      <h2 className="font-bold text-2xl md:text-4xl text-center p-4 md:p-6 lg:p-10 bg-primary text-white rounded-xl md:rounded-2xl">
        {loading ? (
          <Skeleton className="h-8 md:h-10 w-full rounded-lg" />
        ) : (
          story?.output?.bookTitle
        )}
      </h2>

      {loading ? (
        <Skeleton className="rounded-xl md:rounded-2xl mt-6 md:mt-10">
          <div className="h-[300px] md:h-[500px] rounded-lg bg-secondary" />
        </Skeleton>
      ) : (
        <div className="relative flex flex-col items-center mt-6 md:mt-10">
          {/* @ts-expect-error */}
          <HTMLFlipBook
            width={Math.min(window.innerWidth * 0.8, 500)}
            height={500}
            className="w-full"
            showCover
            useMouseEvents={false}
            ref={bookRef}
            maxShadowOpacity={0}
          >
            <div>
              <BookCoverPage imageUrl={story?.coverImage || ""} />
            </div>
            {[...Array(story?.output?.chapters?.length)].map((item, index) => (
              <div key={index} className="bg-white p-6 md:p-10 border">
                <StoryPages
                  storyChapter={story?.output?.chapters[index] as Chapter}
                />
              </div>
            ))}
            <div>
              <LastPage />
            </div>
          </HTMLFlipBook>

          <div className="flex gap-4 md:gap-8 mt-6 md:mt-0 md:absolute md:top-1/2 md:-translate-y-1/2 w-full justify-between px-4">
            {count !== 0 && (
              <button
                className="md:absolute md:-left-6 md:top-1/2 md:-translate-y-1/2"
                onClick={() => {
                  bookRef.current?.pageFlip().flipPrev();
                  setCount(count - 1);
                }}
              >
                <IoIosArrowDropleftCircle className="text-[40px] md:text-[50px] text-primary cursor-pointer" />
              </button>
            )}

            {count !== (story?.output?.chapters?.length || 0) && (
              <button
                className="md:absolute md:-right-6 md:top-1/2 md:-translate-y-1/2"
                onClick={() => {
                  bookRef.current?.pageFlip().flipNext();
                  setCount(count + 1);
                }}
              >
                <IoIosArrowDroprightCircle className="text-[40px] md:text-[50px] text-primary cursor-pointer" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewStory;
