import React from "react";
import { Skeleton } from "@heroui/skeleton";
import { Card } from "@heroui/card";

const UserStorySkeleton = () => {
  return (
    <div className="w-full lg:w-[250px]">
      <Card
        className="w-full lg:w-[250px] h-[300px] space-y-5 p-4 mx-auto"
        radius="lg"
      >
        <Skeleton className="rounded-lg">
          <div className="h-24 rounded-lg bg-default-300" />
        </Skeleton>
        <div className="space-y-3">
          <Skeleton className="w-3/5 rounded-lg">
            <div className="h-3 w-3/5 rounded-lg bg-default-200" />
          </Skeleton>
          <Skeleton className="w-4/5 rounded-lg">
            <div className="h-3 w-4/5 rounded-lg bg-default-200" />
          </Skeleton>
          <Skeleton className="w-2/5 rounded-lg">
            <div className="h-3 w-2/5 rounded-lg bg-default-300" />
          </Skeleton>
        </div>
      </Card>
    </div>
  );
};

export default UserStorySkeleton;
