/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Textarea } from "@heroui/react";
import React from "react";

const StorySubjectInput = ({ userSelection }: any) => {
  return (
    <div>
      <label className="text-primary text-3xl sm:text-4xl font-bold">
        1. Story Subject
      </label>
      <Textarea
        placeholder="Write the subject of the story which you want to generate here..."
        size="lg"
        classNames={{
          input:
            "resize-y min-h-[200px] sm:min-h-[230px] text-xl sm:text-2xl p-4 sm:p-5",
        }}
        className="mt-3 max-w-full md:max-w-lg"
        onChange={(e) =>
          userSelection({
            fieldValue: e.target.value,
            fieldName: "storySubject",
          })
        }
      />
    </div>
  );
};

export default StorySubjectInput;
