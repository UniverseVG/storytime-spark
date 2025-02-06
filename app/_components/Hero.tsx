import { Button } from "@heroui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Hero = () => {
  return (
    <div className="px-6 md:px-28 lg:px-44 mt-10 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-primary font-extrabold py-6 md:py-10">
            Craft Magical Stories for Kids in Minutes
          </h2>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-primary font-light">
            Create fun and exciting stories that will captivate your
            child&apos;s imagination and spark their curiosity for new ideas. It
            only takes a few simple steps to get started.
          </p>
          <Link href={"/create"}>
            <Button
              size="lg"
              color="primary"
              className="mt-4 sm:mt-5 font-bold text-base sm:text-lg md:text-xl lg:text-2xl p-4 sm:p-6 md:p-8"
            >
              Create Story
            </Button>
          </Link>
        </div>
        <div className="flex justify-center">
          <Image
            src={"/hero.png"}
            alt="Hero"
            width={500}
            height={300}
            className="w-full max-w-[500px] md:max-w-[700px]"
          />
        </div>
      </div>
    </div>
  );
};

export default Hero;
