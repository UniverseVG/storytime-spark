/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-ts-comment */
"use client";

import React, { useEffect, useRef, useState } from "react";
import HTMLFlipBook from "react-pageflip";
import {
  IoIosArrowDropleftCircle,
  IoIosArrowDroprightCircle,
} from "react-icons/io";
import { Skeleton } from "@heroui/skeleton";
import BookCoverPage from "@/app/_components/storDetail/BookCoverPage";
import LastPage from "@/app/_components/storDetail/LastPage";
import StoryPages from "@/app/_components/storDetail/StoryPages";
import { db } from "@/config/db";
import { StoryData } from "@/config/schema";
import { eq } from "drizzle-orm";
import { use } from "react";
import { Select, SelectItem } from "@heroui/react";
import { MdRecordVoiceOver } from "react-icons/md";
import { Chapter, Story } from "@/types";
import Image from "next/image";

const ViewStory = ({ params }: { params: Promise<{ storyId: string }> }) => {
  const resolvedParams = use(params);
  const bookRef = useRef<any>(null);
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);

  const [narrating, setNarrating] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>("");
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    setIsSmallScreen(window.innerWidth < 768);

    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Load voices when the component mounts
  useEffect(() => {
    const synth = window.speechSynthesis;

    // Function to load voices
    const loadVoices = () => {
      const availableVoices = synth.getVoices();
      setVoices(availableVoices);

      // Set the default voice if not already set
      if (availableVoices.length > 0 && !selectedVoice) {
        const defaultVoice = availableVoices.find(
          (voice) => voice.name === "Google UK English Male"
        );
        setSelectedVoice(
          defaultVoice ? defaultVoice.name : availableVoices[0].name
        );
      }
    };

    loadVoices();
    synth.addEventListener("voiceschanged", loadVoices);

    return () => {
      synth.removeEventListener("voiceschanged", loadVoices);
      synth.cancel(); // Stop narration on unmount
    };
  }, [selectedVoice]);

  // Stop narration on page refresh or navigation
  useEffect(() => {
    const handleBeforeUnload = () => {
      window.speechSynthesis.cancel();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // Fetch story data
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
      }
    } catch (error) {
      console.error("Error fetching story:", error);
    } finally {
      setLoading(false);
    }
  };

  // Narrate a chapter
  const narrateChapter = (chapterIndex: number) => {
    if (!story || !story.output?.chapters) return;
    if (chapterIndex >= story.output.chapters.length) {
      setNarrating(false);
      return;
    }

    const targetPage = chapterIndex + 1;
    if (count !== targetPage) {
      bookRef.current?.pageFlip().flip(targetPage);
      setCount(targetPage);
    }

    const chapter = story.output.chapters[chapterIndex];
    const utterance = new SpeechSynthesisUtterance(chapter.storyText);
    const voice = voices.find((v) => v.name === selectedVoice);
    if (voice) {
      utterance.voice = voice;
    }
    utterance.rate = 1;
    utterance.onend = () => {
      setTimeout(() => {
        narrateChapter(chapterIndex + 1);
      }, 500);
    };

    window.speechSynthesis.speak(utterance);
  };
  // Play narration
  const handlePlayNarration = () => {
    const startChapter = count === 0 ? 0 : count - 1;
    setNarrating(true);
    narrateChapter(startChapter);
  };

  // Stop narration
  const handleStopNarration = () => {
    window.speechSynthesis.cancel();
    setNarrating(false);
  };

  return (
    <div className="p-4 md:p-10 md:px-12 lg:px-20">
      <h2 className="font-bold text-2xl md:text-4xl text-center p-4 md:p-6 lg:p-10 bg-primary text-white rounded-xl md:rounded-2xl flex justify-center items-center">
        {loading ? (
          <Image src="/loading.gif" alt="loading" width={40} height={40} />
        ) : (
          story?.output?.bookTitle
        )}
      </h2>

      {/* Narration Controls */}
      {!loading && (
        <div className="flex flex-col md:flex-row items-center justify-center gap-4 my-4">
          <div className="w-full md:w-1/2">
            <Select
              aria-label="Select a voice"
              placeholder="Select a voice"
              classNames={{
                trigger:
                  "bg-gray-50 border-gray-200 hover:bg-gray-100 data-[focus=true]:bg-gray-100 min-w-[300px]",
                value: "text-gray-900 text-sm",
                label: "text-gray-700 font-medium",
                popoverContent: "bg-white border-gray-200",
              }}
              size="lg"
              startContent={
                <MdRecordVoiceOver className="text-xl text-[#5253A3]/80 mr-2" />
              }
              itemHeight={60}
              value={selectedVoice}
              onChange={(e) => setSelectedVoice(e.target.value)}
            >
              {voices.map((voice, index) => (
                <SelectItem
                  key={index}
                  className="text-gray-900 hover:bg-gray-100"
                  textValue={voice.name}
                >
                  {voice.name} ({voice.lang})
                </SelectItem>
              ))}
            </Select>
          </div>
          <div>
            {narrating ? (
              <button
                onClick={handleStopNarration}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
              >
                Stop Narration
              </button>
            ) : (
              <button
                onClick={handlePlayNarration}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
              >
                Play Narration
              </button>
            )}
          </div>
        </div>
      )}

      {/* Flipbook */}
      {loading ? (
        <Skeleton className="rounded-xl md:rounded-2xl mt-6 md:mt-10">
          <div className="h-[300px] md:h-[500px] rounded-lg bg-secondary" />
        </Skeleton>
      ) : (
        <div className="relative flex flex-col items-center mt-6 md:mt-10">
          {/* @ts-expect-error */}
          <HTMLFlipBook
            width={Math.min(window.innerWidth * 0.8, 500)}
            height={600}
            className="w-full"
            showCover
            useMouseEvents={false}
            ref={bookRef}
            maxShadowOpacity={0}
            onFlip={(e) => setCount(e.data)}
          >
            <div>
              <BookCoverPage
                imageUrl={story?.coverImage || ""}
                title={story?.output?.bookTitle || ""}
              />
            </div>
            {story?.output?.chapters?.map((chapter: Chapter, index: number) => (
              <div
                key={index}
                className="relative bg-primary-50 p-8 md:p-12 border-4 border-primary-900 
               transform perspective-1000 rotate-y-0
               before:absolute before:inset-0
               before:opacity-20 before:pointer-events-none
               after:absolute after:inset-0 after:border-2 after:border-primary-700 after:opacity-30
               shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:shadow-[0_25px_60px_rgba(0,0,0,0.4)] transition-shadow
               scrollbar-thin scrollbar-thumb-primary-800 scrollbar-track-primary-100
               group/codex"
              >
                <div className="absolute -top-2 -left-2 w-8 h-8 border-t-4 border-l-4 border-primary-800" />
                <div className="absolute -top-2 -right-2 w-8 h-8 border-t-4 border-r-4 border-primary-800" />
                <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-4 border-l-4 border-primary-800" />
                <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-4 border-r-4 border-primary-800" />

                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-[90%] bg-gradient-to-r from-primary-800 to-primary-900
               shadow-[4px_0_8px_rgba(0,0,0,0.3)] rounded-r-lg"
                />

                <div
                  className="absolute right-0 top-0 h-full w-2 bg-gradient-to-r from-primary-400/30 to-transparent
               shadow-[-4px_0_8px_rgba(0,0,0,0.2)]"
                />

                <div className="absolute bottom-4 right-4 opacity-10 w-16 h-16" />

                <StoryPages storyChapter={chapter} />
              </div>
            ))}
            <div>
              <LastPage />
            </div>
          </HTMLFlipBook>

          {/* Navigation Buttons */}
          <div className="flex gap-4 md:gap-8 mt-6 md:mt-0 md:absolute md:top-1/2 md:-translate-y-1/2 w-full justify-between px-4">
            {count !== 0 && (
              <button
                className={`md:absolute md:-left-6 md:top-1/2 md:-translate-y-1/2 ${
                  narrating ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={() => {
                  if (narrating) return;
                  bookRef.current?.pageFlip().flipPrev();
                  setCount(count - 1);
                }}
              >
                <IoIosArrowDropleftCircle className="text-[40px] md:text-[50px] text-primary cursor-pointer" />
              </button>
            )}

            {isSmallScreen
              ? count < (story?.output?.chapters?.length || 0) + 1 && (
                  <button
                    className={`md:absolute md:-right-6 md:top-1/2 md:-translate-y-1/2 ${
                      narrating ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    onClick={() => {
                      if (narrating) return;
                      bookRef.current?.pageFlip().flipNext();
                      setCount(count + 1);
                    }}
                  >
                    <IoIosArrowDroprightCircle className="text-[40px] md:text-[50px] text-primary cursor-pointer" />
                  </button>
                )
              : count !== (story?.output?.chapters?.length || 0) && (
                  <button
                    className={`md:absolute md:-right-6 md:top-1/2 md:-translate-y-1/2 ${
                      narrating ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    onClick={() => {
                      if (narrating) return;
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
