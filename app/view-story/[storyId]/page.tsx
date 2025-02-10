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

const ViewStory = ({ params }: { params: Promise<{ storyId: string }> }) => {
  const resolvedParams = use(params);
  const bookRef = useRef<any>(null);
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);

  const [narrating, setNarrating] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>("");
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 768); // Detect small screens (less than 768px)

  // Update screen size state on window resize
  useEffect(() => {
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

  // Predefined list of high-quality voices
  const bestVoices = [
    "Google UK English Male",
    "Google US English Female",
    "Microsoft Zira",
    "Microsoft David",
    "Google UK English Female",
  ];

  return (
    <div className="p-4 md:p-10 md:px-12 lg:px-20">
      <h2 className="font-bold text-2xl md:text-4xl text-center p-4 md:p-6 lg:p-10 bg-primary text-white rounded-xl md:rounded-2xl">
        {loading ? (
          <Skeleton className="h-8 md:h-10 w-full rounded-lg" />
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
              {voices
                .filter((voice) => bestVoices.includes(voice.name))
                .map((voice) => (
                  <SelectItem
                    key={voice.voiceURI}
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
            height={500}
            className="w-full"
            showCover
            useMouseEvents={!narrating}
            ref={bookRef}
            maxShadowOpacity={0}
            onFlip={(e) => setCount(e.data)}
          >
            <div>
              <BookCoverPage imageUrl={story?.coverImage || ""} />
            </div>
            {story?.output?.chapters?.map((chapter: Chapter, index: number) => (
              <div key={index} className="bg-white p-6 md:p-10 border">
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
