import Image from "next/image";
import React from "react";

const DashboardHeader = () => {
  return (
    <div className="p-7 bg-primary text-white flex justify-between items-center rounded-2xl">
      <h2 className="text-3xl font-bold">My Stories</h2>
      <div className="flex items-center gap-3">
        <Image src={"/coin.png"} alt="coin" width={50} height={50} />
        <span className="text-2xl">3 Credits Left</span>
      </div>
    </div>
  );
};

export default DashboardHeader;
