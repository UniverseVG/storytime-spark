import { Button } from "@heroui/button";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Hero = () => {
  return (
    <div className="px-10 md:px-28 lg:px-44 mt-10 min-h-screen">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2 className="text-[70px] text-primary font-extrabold py-10">
            Craft Magical Stories for kids in Minutes
          </h2>
          <p className="text-2xl text-primary font-light">
            Create fun and exciting stories that will captivate your
            child&apos;s imagination and spark their curiosity for new ideas. It
            only takes a few simple steps to get started.
          </p>
          <Link href={"create"}>
            <Button
              size="lg"
              color="primary"
              className="mt-5 font-bold text-2xl p-8"
            >
              Create Story
            </Button>
          </Link>
        </div>
        <div>
          <Image src={"/hero.png"} alt="Hero" width={700} height={400} />
        </div>
      </div>
    </div>
  )
}

export default Hero;
