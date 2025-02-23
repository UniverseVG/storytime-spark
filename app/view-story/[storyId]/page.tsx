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
import { Select, SelectItem } from "@heroui/select";
import BookCoverPage from "@/app/_components/storDetail/BookCoverPage";
import LastPage from "@/app/_components/storDetail/LastPage";
import StoryPages from "@/app/_components/storDetail/StoryPages";
import { db } from "@/config/db";
import { StoryData } from "@/config/schema";
import { eq } from "drizzle-orm";
import { use } from "react";
import Image from "next/image";
import { Chapter, Story } from "@/types";
import { MdRecordVoiceOver } from "react-icons/md";
import { toast } from "react-toastify";
import { Button } from "@heroui/button";

const ViewStory = ({ params }: { params: Promise<{ storyId: string }> }) => {
  const resolvedParams = use(params);
  const bookRef = useRef<any>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const narratingRef = useRef(false);
  const [story, setStory] = useState<Story | null>(null);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [narrating, setNarrating] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState("en-US");
  const [selectedVoiceType, setSelectedVoiceType] = useState("Neural2");
  const [selectedVoice, setSelectedVoice] = useState("");

  const [playbackBlocked, setPlaybackBlocked] = useState(false);

  const audioContextRef = useRef(
    new (window.AudioContext || (window as any).webkitAudioContext)()
  );

  const notifyError = (msg: string) => {
    toast.error(msg);
  };

  // Define available languages and voice types.
  const languageOptions = ["en-US", "en-AU", "en-IN", "en-GB"];
  const voiceTypeOptions = [
    "Neural2",
    "Studio",
    "Chirp HD",
    "Polyglot",
    "News",
    "Basic",
    "WaveNet",
  ];
  const voiceTypeMapping: { [key: string]: string[] } = {
    Neural2: ["Neural2-A", "Neural2-C", "Neural2-D", "Neural2-E"],
    Studio: ["Studio-O", "Studio-Q"],
    "Chirp HD": ["Chirp-HD-D", "Chirp-HD-F", "Chirp-HD-Q"],
    Polyglot: ["Polyglot-1"],
    News: ["News-K", "News-L", "News-N"],
    Basic: [
      "Standard-A",
      "Standard-B",
      "Standard-C",
      "Standard-D",
      "Standard-E",
      "Standard-F",
      "Standard-G",
      "Standard-H",
      "Standard-I",
      "Standard-J",
    ],
    WaveNet: [
      "Wavenet-A",
      "Wavenet-B",
      "Wavenet-C",
      "Wavenet-D",
      "Wavenet-E",
      "Wavenet-F",
      "Wavenet-G",
      "Wavenet-H",
      "Wavenet-I",
      "Wavenet-J",
    ],
  };

  // Compute available voice names.
  const availableVoiceNames = voiceTypeMapping[selectedVoiceType].map(
    (suffix) => `${selectedLanguage}-${suffix}`
  );

  useEffect(() => {
    setSelectedVoice(availableVoiceNames[0]);
  }, [selectedLanguage, selectedVoiceType]);

  useEffect(() => {
    setIsSmallScreen(window.innerWidth < 768);
    const handleResize = () => setIsSmallScreen(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (narrating && (e.key === "ArrowLeft" || e.key === "ArrowRight")) {
        e.preventDefault();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [narrating]);

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

  // Recursively narrate chapters.
  const narrateChapter = async (chapterIndex: number) => {
    if (!narratingRef.current) return;
    if (!story || !story.output?.chapters) return;
    if (chapterIndex >= story.output.chapters.length) {
      setNarrating(false);
      narratingRef.current = false;
      return;
    }

    // Flip to the correct page.
    const targetPage = chapterIndex + 1;
    if (count !== targetPage) {
      bookRef.current?.pageFlip().flip(targetPage);
      setCount(targetPage);
    }

    const chapter = story.output.chapters[chapterIndex];
    try {
      const response = await fetch("/api/google-tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: chapter.storyText,
          voice: {
            languageCode: selectedLanguage,
            name: selectedVoice,
          },
        }),
      });
      const data: any = await response.json();

      if (!data.audioContent) {
        notifyError(
          "An error occurred: " +
            data.error.message +
            ". Please try a different voice."
        );
        return;
      }

      // Create the audio and attach the onended callback first.
      const audio = new Audio(`data:audio/wav;base64,${data.audioContent}`);
      audioRef.current = audio;
      audio.onended = () => {
        if (!narratingRef.current) return;
        timeoutRef.current = setTimeout(() => {
          if (narratingRef.current) narrateChapter(chapterIndex + 1);
        }, 500);
      };

      // Try playing the audio.
      audio
        .play()
        .then(() => {
          setPlaybackBlocked(false);
        })
        .catch((error) => {
          console.warn("Playback prevented:", error);
          setPlaybackBlocked(true);
          notifyError("Audio playback blocked. Please tap to allow playback.");
          // Attach a one-time click listener to retry.
          document.addEventListener(
            "click",
            () => {
              audio
                .play()
                .then(() => setPlaybackBlocked(false))
                .catch((err) => console.error("Playback retry failed:", err));
            },
            { once: true }
          );
        });
    } catch (error: any) {
      console.error("Error narrating chapter:", error);
    }
  };

  const handlePlayNarration = () => {
    if (!story || !story.output?.chapters) {
      toast.error("No story available to narrate.");
      return;
    }
    const startChapter = count === 0 ? 0 : count - 1;
    setNarrating(true);
    narratingRef.current = true;

    const audioCtx = audioContextRef.current;
    if (audioCtx.state === "suspended") {
      audioCtx
        .resume()
        .then(() => {
          const buffer = audioCtx.createBuffer(1, 1, 22050);
          const source = audioCtx.createBufferSource();
          source.buffer = buffer;
          source.connect(audioCtx.destination);
          source.start();
          narrateChapter(startChapter);
        })
        .catch((err) => {
          console.error("AudioContext resume failed:", err);
          notifyError("Audio permission denied. Please tap to allow audio.");
        });
    } else {
      narrateChapter(startChapter);
    }
  };

  // Stop narration and clear timeouts.
  const handleStopNarration = () => {
    setNarrating(false);
    narratingRef.current = false;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  const handleManualPlay = async () => {
    if (audioRef.current) {
      try {
        await audioRef.current.play();
        setPlaybackBlocked(false);
      } catch (error) {
        console.error("Manual playback failed:", error);
      }
    }
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

      {!loading && (
        <div className="flex flex-col items-center justify-center gap-4 my-4">
          <div className="flex flex-col justify-center lg:flex-row items-center gap-4 w-full">
            <div className="flex flex-col w-full lg:w-auto">
              <label htmlFor="languageSelect" className="text-sm font-medium">
                Language:
              </label>
              <Select
                id="languageSelect"
                value={selectedLanguage}
                placeholder="Select a language"
                size="lg"
                startContent={
                  <MdRecordVoiceOver className="text-xl text-[#5253A3]/80 mr-2" />
                }
                classNames={{
                  trigger:
                    "bg-gray-50 border-gray-200 hover:bg-gray-100 data-[focus=true]:bg-gray-100 w-full md:min-w-[300px]",
                  value: "text-gray-900 text-sm",
                  label: "text-gray-700 font-medium",
                  popoverContent: "bg-white border-gray-200",
                }}
                onChange={(e) => {
                  const newLang = e.target.value;
                  setSelectedLanguage(newLang);
                  setSelectedVoice(
                    `${newLang}-${voiceTypeMapping[selectedVoiceType][0]}`
                  );
                }}
                disabled={narrating}
              >
                {languageOptions.map((lang) => (
                  <SelectItem key={lang} value={lang} textValue={lang}>
                    {lang}
                  </SelectItem>
                ))}
              </Select>
            </div>

            <div className="flex flex-col w-full lg:w-auto">
              <label htmlFor="voiceTypeSelect" className="text-sm font-medium">
                Voice Type:
              </label>
              <Select
                id="voiceTypeSelect"
                value={selectedVoiceType}
                placeholder="Select a voice type"
                size="lg"
                classNames={{
                  trigger:
                    "bg-gray-50 border-gray-200 hover:bg-gray-100 data-[focus=true]:bg-gray-100 w-full md:min-w-[300px]",
                  value: "text-gray-900 text-sm",
                  label: "text-gray-700 font-medium",
                  popoverContent: "bg-white border-gray-200",
                }}
                onChange={(e) => {
                  const newType = e.target.value;
                  setSelectedVoiceType(newType);
                  setSelectedVoice(
                    `${selectedLanguage}-${voiceTypeMapping[newType][0]}`
                  );
                }}
                disabled={narrating}
              >
                {voiceTypeOptions.map((type) => (
                  <SelectItem key={type} value={type} textValue={type}>
                    {type}
                  </SelectItem>
                ))}
              </Select>
            </div>

            <div className="flex flex-col w-full lg:w-auto">
              <label htmlFor="voiceNameSelect" className="text-sm font-medium">
                Voice Name:
              </label>
              <Select
                id="voiceNameSelect"
                value={selectedVoice}
                placeholder="Select a voice"
                size="lg"
                classNames={{
                  trigger:
                    "bg-gray-50 border-gray-200 hover:bg-gray-100 data-[focus=true]:bg-gray-100 w-full md:min-w-[300px]",
                  value: "text-gray-900 text-sm",
                  label: "text-gray-700 font-medium",
                  popoverContent: "bg-white border-gray-200",
                }}
                onChange={(e) => setSelectedVoice(e.target.value)}
                disabled={narrating}
              >
                {availableVoiceNames.map((voiceName) => (
                  <SelectItem
                    key={voiceName}
                    value={voiceName}
                    textValue={voiceName}
                  >
                    {voiceName}
                  </SelectItem>
                ))}
              </Select>
            </div>
          </div>

          {narrating ? (
            <Button
              onPress={handleStopNarration}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            >
              Stop Narration
            </Button>
          ) : (
            <Button
              onPress={handlePlayNarration}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
            >
              Play Narration
            </Button>
          )}

          {playbackBlocked && (
            <Button
              onPress={handleManualPlay}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded mt-4"
            >
              Tap to Allow Audio Playback
            </Button>
          )}
        </div>
      )}

      {loading ? (
        <Skeleton className="rounded-xl md:rounded-2xl mt-6 md:mt-10">
          <div className="h-[300px] md:h-[500px] rounded-lg bg-secondary" />
        </Skeleton>
      ) : (
        <div
          className="relative flex flex-col items-center mt-6 md:mt-10"
          style={narrating ? { pointerEvents: "none" } : {}}
        >
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
