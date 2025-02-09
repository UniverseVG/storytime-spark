/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Image from "next/image";
import React, { useState } from "react";

export interface OptionField {
  label: string;
  imageUrl: string;
  isFree: boolean;
}

const StoryType = ({ userSelection }: any) => {
  const OptionsList = [
    {
      label: "Story Book",
      imageUrl: "/story.png",
      isFree: true,
    },
    {
      label: "Bed Story",
      imageUrl: "/bedstory.png",
      isFree: true,
    },
    {
      label: "Educational",
      imageUrl: "/educational.png",
      isFree: true,
    },
  ];

  const [selectedOption, setSelectedOption] = useState<string>("");

  const onUserSelect = (data: OptionField) => {
    setSelectedOption(data.label);
    userSelection({
      fieldValue: data.label,
      fieldName: "storyType",
    });
  };

  return (
    <div>
      <label className="text-primary text-3xl sm:text-4xl font-bold">
        2. Story Type
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-3">
        {OptionsList.map((item, index) => (
          <div
            key={index}
            onClick={() => onUserSelect(item)}
            className={`relative p-1 cursor-pointer transition-all duration-1000 ease-in-out ${
              selectedOption === item.label
                ? "grayscale-0 border-2 rounded-3xl border-primary"
                : "grayscale hover:grayscale-0"
            }`}
          >
            <h2 className="absolute bottom-2 sm:bottom-3 md:bottom-5 text-center text-base sm:text-xl md:text-2xl lg:text-3xl text-white w-full">
              {item.label}
            </h2>
            <Image
              src={item.imageUrl}
              alt={item.label}
              width={300}
              height={500}
              className="object-cover h-[200px] sm:h-[240px] md:h-[260px] rounded-3xl"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default StoryType;
