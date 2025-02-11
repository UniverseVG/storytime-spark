import React from "react";
import { Chapter } from "@/types";

interface StoryPagesProps {
  storyChapter: Chapter;
}

const StoryPages = ({ storyChapter }: StoryPagesProps) => {
  return (
    <div className="h-[400px] md:h-[450px] overflow-y-scroll scrollbar-thin scrollbar-thumb-blue-500 scrollbar-track-gray-100 p-4">
      <h2 className="text-2xl font-bold text-primary mb-4">
        {storyChapter.chapterTitle}
      </h2>
      <p className="text-xl p-6 rounded-lg bg-slate-100 leading-relaxed">
        {storyChapter.storyText}
      </p>
    </div>
  );
};

export default StoryPages;
