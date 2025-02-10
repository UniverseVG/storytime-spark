/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@heroui/button";
import { MdShare } from "react-icons/md";
import React from "react";
import { toast } from "react-toastify";

const LastPage = () => {
  const notify = (msg: string) => {
    toast(msg, {});
  };
  const handleShare = async () => {
    const shareData = {
      title: "Check out this story!",
      text: "I just finished reading this amazing story. Take a look!",
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        console.log("Story shared successfully!");
      } catch (error: any) {
        if (error.name !== "AbortError") {
          console.error("Error sharing:", error);
        }
      }
    } else {
      navigator.clipboard.writeText(shareData.url);
      notify("Link copied to clipboard!");
    }
  };

  return (
    <div className="bg-gradient-to-b from-primary to-[#5253A3] p-12 h-full flex flex-col items-center justify-center shadow-lg text-white">
      <h2 className="text-3xl md:text-4xl font-extrabold text-center mb-6">
        🎉 The End 🎉
      </h2>
      <p className="text-lg md:text-xl text-center mb-6 opacity-90">
        Thanks for reading! If you enjoyed this story, share it with your
        friends.
      </p>
      <Button
        onClick={handleShare}
        className="bg-white text-primary border border-primary px-6 py-3 shadow-lg flex items-center gap-2 hover:bg-primary hover:text-white transition duration-300"
      >
        <MdShare className="text-xl" />
        Share Story
      </Button>
    </div>
  );
};

export default LastPage;
