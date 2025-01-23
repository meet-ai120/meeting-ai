import React from "react";
import { Skeleton } from "./ui/skeleton";

export function MeetingItemsSkeleton() {
  return (
    <div className="flex w-full items-center space-x-4">
      <div className="w-full space-y-2">
        <Skeleton className="h-4 w-1/2" />
        <Skeleton className="h-8 w-full" />
      </div>
    </div>
  );
}
