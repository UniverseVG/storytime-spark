import { Story } from "@/types";
import React from "react";
import { Card, CardFooter } from "@heroui/card";
import Image from "next/image";
import { Button } from "@heroui/button";
import Link from "next/link";

const StoryItemCard = ({ story }: { story: Story }) => {
  return (
    <Link href={`/view-story/${story?.storyId}`} key={story?.id}>
      <Card
        isFooterBlurred
        className="w-full h-[300px] col-span-12 sm:col-span-5 hover:scale-105 transition-all cursor-pointer"
      >
        <Image
          alt="story_cover_image"
          className="z-0 w-full h-full scale-125 -translate-y-6 object-cover"
          src={story?.coverImage}
          width={500}
          height={500}
        />
        <CardFooter className="absolute bg-white/30 bottom-0 border-t-1 border-zinc-100/50 z-10 justify-between">
          <p className="text-black text-xl">{story?.output?.bookTitle}</p>
          <Button
            className="text-tiny p-2"
            color="primary"
            radius="full"
            size="sm"
          >
            Read Now
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
};

export default StoryItemCard;
