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
    <div className="p-7 bg-primary text-white flex justify-between items-center rounded-2xl">
      <h2 className="text-3xl font-bold">My Stories</h2>
      <div className="flex items-center gap-3">
        <Image src={"/coin.png"} alt="coin" width={50} height={50} />

        <span className="text-2xl flex items-center justify-center gap-2">
          {!userDetail?.credit ? (
            <Skeleton className="h-10 w-10 rounded-full" />
          ) : (
            userDetail?.credit
          )}{" "}
          Credits Left
        </span>

        <Link href={"/buy-credits"}>
          <Button className="text-lg bg-blue-400" color="secondary">
            Buy Credits
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default DashboardHeader;
