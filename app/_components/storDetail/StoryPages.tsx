import React from "react";
import { Chapter } from "@/types";

interface StoryPagesProps {
  storyChapter: Chapter;
}

const StoryPages = ({ storyChapter }: StoryPagesProps) => {
  return (
    <div>
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
