"use client";
import { UserDetailContext } from "@/app/_context/UserDetailContext";
import { Button } from "@heroui/button";
import { Skeleton } from "@heroui/skeleton";
import Image from "next/image";
import Link from "next/link";
import React, { useContext } from "react";

const DashboardHeader = () => {
  const context = useContext(UserDetailContext);
  const userDetail = context?.userDetail;

  return (
    <div className="p-5 md:p-7 bg-primary text-white flex flex-col md:flex-row gap-4 md:gap-0 justify-between items-start md:items-center rounded-xl md:rounded-2xl">
      {/* Title - Left-aligned on all screens */}
      <h2 className="hidden md:block text-2xl md:text-3xl font-bold">
        My Stories
      </h2>

      {/* Credits Section - Stack vertically on mobile */}
      <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
        <div className="flex items-center gap-2 w-full justify-between md:justify-start">
          <div>
            <h2 className="block md:hidden text-2xl font-bold">My Stories</h2>
          </div>
          <div className="flex items-center gap-2">
            <Image
              src={"/coin.png"}
              alt="coin"
              width={48}
              height={48}
              className="w-10 h-10 md:w-12 md:h-12"
            />
            {/* Credits Text */}
            <span className="text-lg md:text-xl flex items-center gap-2">
              {!userDetail?.credit ? (
                <Skeleton className="h-8 w-8 md:h-10 md:w-10 rounded-full" />
              ) : (
                userDetail?.credit
              )}
              <span className="hidden md:inline">Credits Left</span>
              <span className="md:hidden">Credits</span>
            </span>
          </div>
          {/* Coin Image */}
        </div>

        {/* Buy Credits Button - Full width on mobile */}
        <Link href={"/buy-credits"} className="w-full md:w-auto">
          <Button
            className="text-base md:text-lg w-full md:w-auto bg-blue-400 hover:bg-blue-500 transition-colors"
            color="secondary"
          >
            Buy Credits
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default DashboardHeader;
