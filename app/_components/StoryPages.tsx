import { Chapter } from "@/types";
import React from "react";
import { MdPlayCircleFilled } from "react-icons/md";

const StoryPages = ({ storyChapter }: { storyChapter: Chapter }) => {
  const playSpeech = (text: string) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    synth.speak(utterance);
  };
  return (
    <div>
      <h2 className="text-2xl font-bold text-primary flex justify-between">
        {storyChapter?.chapterTitle}
        <span
          className="text-3xl cursor-pointer"
          onClick={() => playSpeech(storyChapter?.storyText)}
        >
          <MdPlayCircleFilled />
        </span>
      </h2>
      <p className="text-xl p-10 mt-3 rounded-lg bg-slate-100">
        {storyChapter?.storyText}
      </p>
    </div>
  );
};

export default StoryPages;
