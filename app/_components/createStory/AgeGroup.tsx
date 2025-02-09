/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "next/image";
import React, { useState } from "react";
import { OptionField } from "./StoryType";

const AgeGroup = ({ userSelection }: any) => {
  const OptionsList = [
    {
      label: "0-2 Years",
      imageUrl: "/02Years.png",
      isFree: true,
    },
    {
      label: "3-5 Years",
      imageUrl: "/35Years.png",
      isFree: true,
    },
    {
      label: "6-8 Years",
      imageUrl: "/58Years.png",
      isFree: true,
    },
  ];
  const [selectedOption, setSelectedOption] = useState<string>("");
  const onUserSelect = (data: OptionField) => {
    setSelectedOption(data.label);
    userSelection({
      fieldValue: data.label,
      fieldName: "ageGroup",
    });
  };
  return (
    <div>
      <label className="text-primary text-4xl font-bold">3. Age Group</label>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mt-3">
        {OptionsList.map((item, index) => (
          <div
            key={index}
            className={`relative grayscale hover:grayscale-0 cursor-pointer transition-all duration-1000 ease-in-out w-fit inline-block rounded-3xl ${
              selectedOption === item.label
                ? "grayscale-0 border-2 border-primary"
                : "grayscale"
            }`}
            onClick={() => onUserSelect(item)}
          >
            {/* Responsive text overlay */}
            <h2 className="absolute bottom-2 sm:bottom-3 md:bottom-5 text-center text-lg sm:text-xl md:text-2xl lg:text-3xl text-white w-full">
              {item.label}
            </h2>
            <Image
              src={item.imageUrl}
              alt={item.label}
              width={300}
              height={500}
              className="object-cover h-[260px] w-[300px] rounded-3xl"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AgeGroup;
