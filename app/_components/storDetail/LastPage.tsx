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
      // Use Web Share API if available
      try {
        await navigator.share(shareData);
      } catch (error: any) {
        if (error.name !== "AbortError") {
          console.error("Error sharing:", error);
          notify("Failed to share. Please try again.");
        }
      }
    } else {
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(shareData.url);
          notify("Link copied to clipboard!");
        } else {
          const textarea = document.createElement("textarea");
          textarea.value = shareData.url;
          textarea.style.position = "fixed";
          document.body.appendChild(textarea);
          textarea.focus();
          textarea.select();
          const successful = document.execCommand("copy");
          document.body.removeChild(textarea);

          if (successful) {
            notify("Link copied to clipboard!");
          } else {
            notify("Failed to copy link. Please copy it manually.");
          }
        }
      } catch (error) {
        console.error("Failed to copy link: ", error);
        notify("Failed to copy link. Please copy it manually.");
      }
    }
  };

  return (
    <div className="relative bg-primary-50 p-12 h-full flex flex-col items-center justify-center border-4 border-primary-900 shadow-[0_20px_50px_rgba(0,0,0,0.3)] perspective-1000 group/lastpage">
      <div className="absolute -top-2 -left-2 w-8 h-8 border-t-4 border-l-4 border-primary-800" />
      <div className="absolute -top-2 -right-2 w-8 h-8 border-t-4 border-r-4 border-primary-800" />
      <div className="absolute -bottom-2 -left-2 w-8 h-8 border-b-4 border-l-4 border-primary-800" />
      <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-4 border-r-4 border-primary-800" />

      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-[90%] bg-gradient-to-r from-primary-800 to-primary-900 shadow-[4px_0_8px_rgba(0,0,0,0.3)] rounded-r-lg" />

      <div className="absolute inset-0 opacity-20 pointer-events-none" />

      <div className="relative z-10 text-center">
        <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary-900 mb-8 tracking-wider animate-fade-in">
          ✨ The End ✨
        </h2>

        <p className="text-xl md:text-2xl text-primary-800 mb-10 max-w-2xl leading-relaxed">
          Thank you for journeying through this tale. If it moved you, share the
          magic with fellow story lovers.
        </p>

        <Button
          onPress={handleShare}
          color="primary"
          className="hover:bg-primary-700 text-primary-50 px-8 py-4 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
        >
          <MdShare className="inline-block mr-2 text-xl transition-transform group-hover:rotate-12" />
          <span className="font-serif tracking-wider">Share This Story</span>
        </Button>
      </div>

      <div className="absolute bottom-8 right-8 opacity-20 w-12 h-12" />
    </div>
  );
};

export default LastPage;
