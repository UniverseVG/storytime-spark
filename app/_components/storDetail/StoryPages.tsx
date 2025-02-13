import React from "react";
import { Chapter } from "@/types";

interface StoryPagesProps {
  storyChapter: Chapter;
}

const StoryPages = ({ storyChapter }: StoryPagesProps) => {
  return (
    <div className="relative h-[400px] md:h-[450px] overflow-y-scroll scrollbar-thin scrollbar-thumb-amber-700 scrollbar-track-amber-50 p-8 bg-old-page">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiNmZmYiLz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2cpIi8+PGRlZnM+PHJhZGlhbEdyYWRpZW50IGlkPSJnIiBjeD0iNTAwJSIgY3k9IjUwMCUiIHI9IjYwMCUiIGdyYWRpZW50VHJhbnNmb3JtPSJ0cmFuc2xhdGUoMC41LDAuNSkgcm90YXRlKDApIHNjYWxlKDAuNSwxKSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiPjxzdG9wIG9mZnNldD0iMCIgc3RvcC1jb2xvcj0icmdiYSgyNTUsMjU1LDI1NSwwLjgpIi8+PHN0b3Agb2Zmc2V0PSIxIiBzdG9wLWNvbG9yPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMikiLz48L3JhZGlhbEdyYWRpZW50PjwvZGVmcz48L3N2Zz4=')] opacity-20 pointer-events-none"></div>

      <div className="absolute left-0 top-0 w-2 h-full bg-gradient-to-r from-amber-700/30 to-transparent"></div>

      <div className="relative z-10 max-w-3xl mx-auto">
        <h2 className="text-3xl font-serif font-bold text-vintage mb-6 border-b-2 border-amber-700 pb-2">
          {storyChapter.chapterTitle}
        </h2>

        <div
          className="text-xl font-serif text-vintage leading-loose tracking-wide z
            bg-[#fdfaf5] p-8 rounded shadow-page-inner border-2 border-amber-50
            relative before:absolute before:top-2 before:bottom-2 before:left-2 before:w-1 before:bg-gradient-to-b before:from-amber-300 before:to-amber-500"
        >
          <span className="float-left text-7xl font-serif font-bold mr-2 mt-2 text-amber-800">
            {storyChapter.storyText[0]}
          </span>
          {storyChapter.storyText.slice(1)}

          <div className="absolute top-0 left-0 w-8 h-8 border-l-2 border-t-2 border-amber-600"></div>
          <div className="absolute top-0 right-0 w-8 h-8 border-r-2 border-t-2 border-amber-600"></div>
          <div className="absolute bottom-0 left-0 w-8 h-8 border-l-2 border-b-2 border-amber-600"></div>
          <div className="absolute bottom-0 right-0 w-8 h-8 border-r-2 border-b-2 border-amber-600"></div>
        </div>
      </div>
    </div>
  );
};

export default StoryPages;
