import { Button } from "@heroui/button";
import React from "react";

const LastPage = () => {
  return (
    <div className="bg-primary p-10 h-full flex flex-col items-center justify-center">
      <h2 className="text-2xl font-bold text-white text-center">The End</h2>
      <div className="flex items-center justify-center mt-5">
        <Button>Please Share</Button>
      </div>
    </div>
  );
};

export default LastPage;
