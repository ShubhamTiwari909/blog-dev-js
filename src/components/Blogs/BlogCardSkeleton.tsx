import React from "react";
import { Card, Skeleton } from "@nextui-org/react";

export default function BlogCardSkeleton() {
  return (
    <Card
      className="relative min-w-56 flex-1 lg:flex-auto rounded-xl px"
      radius="lg"
    >
      <Skeleton className="rounded-lg h-56"></Skeleton>
      <div className="px-4 py-6">
        <Skeleton className="mb-4 h-10 w-40 rounded-lg"></Skeleton>
        <ul className="flex gap-x-2 gap-y-3 items-center flex-wrap mb-5">
          {[1, 2, 3, 4].map((i) => {
            return (
              <Skeleton
                className="inline-block min-w-16 px-3 py-2 rounded-full"
                key={i}
              ></Skeleton>
            );
          })}
        </ul>
        <Skeleton className="h-10 w-40 rounded-lg"></Skeleton>
      </div>
    </Card>
  );
}
