import React from "react";
import { Chapter } from "@/types";

interface StoryPagesProps {
  storyChapter: Chapter;
}

const StoryPages = ({ storyChapter }: StoryPagesProps) => {
  return (
    <div className="relative h-[500px] md:h-[550px] p-8 bg-old-page">
      <div className="absolute inset-0 opacity-20 pointer-events-none"></div>

      <div className="absolute left-0 top-0 w-2 h-full bg-gradient-to-r from-primary-700/30 to-transparent"></div>

      <div className="relative z-10 max-w-3xl mx-auto">
        <h2 className="sm:text-xl md:text-2xl lg:text-3xl font-serif font-bold text-primary mb-6 border-b-2 border-primary-700 pb-2">
          {storyChapter.chapterTitle}
        </h2>

        <div
          className="sm:text-base md:text-lg lg:text-xl font-serif text-primary leading-loose tracking-wide
            bg-[#fdfaf5] p-8 rounded shadow-page-inner border-2 border-primary-50
            relative before:absolute before:top-2 before:bottom-2 before:left-2 before:w-1 before:bg-gradient-to-b before:from-primary-300 before:to-primary-500"
        >
          <div className="h-[300px] overflow-y-auto scrollbar-thin scrollbar-thumb-primary-700 scrollbar-track-primary-50">
            <span className="float-left sm:text-4xl md:text-5xl lg:text-7xl font-serif font-bold mr-1 mt-1 text-primary">
              {storyChapter.storyText[0]}
            </span>
            {storyChapter.storyText.slice(1)}
          </div>

          <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-primary-600"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-primary-600"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-primary-600"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-primary-600"></div>
        </div>
      </div>
    </div>
  );
};

export default StoryPages;
