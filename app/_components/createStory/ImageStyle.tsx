/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "next/image";
import React, { useState } from "react";
import { OptionField } from "./StoryType";

const ImageStyle = ({ userSelection }: any) => {
  const OptionsList = [
    {
      label: "3D Cartoon",
      imageUrl: "/3D.png",
      isFree: true,
    },
    {
      label: "Paper Cut",
      imageUrl: "/paperCut.png",
      isFree: true,
    },
    {
      label: "Water Color",
      imageUrl: "/watercolor.png",
      isFree: true,
    },
    {
      label: "Pixel Style",
      imageUrl: "/pixel.png",
      isFree: true,
    },
  ];
  const [selectedOption, setSelectedOption] = useState<string>("");

  const onUserSelect = (data: OptionField) => {
    setSelectedOption(data.label);
    userSelection({
      fieldValue: data.label,
      fieldName: "imageStyle",
    });
  };
  return (
    <div>
      <label className="text-primary text-4xl font-bold">4. Image Style</label>
      <div className="grid grid-cols-3 gap-5 mt-3">
        {OptionsList.map((item, index) => (
          <div
            key={index}
            className={`relative grayscale hover:grayscale-0 p-1 ${selectedOption === item.label ? "grayscale-0 border-2 rounded-3xl border-primary" : "grayscale"} cursor-pointer transition-all duration-1000 ease-in-out`}
            onClick={() => onUserSelect(item)}
          >
            <h2 className="absolute bottom-5 text-center text-2xl text-white w-full">
              {item.label}
            </h2>
            <Image
              src={item.imageUrl}
              alt={item.label}
              width={300}
              height={500}
              className="object-cover h-[120px] rounded-3xl"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageStyle;
