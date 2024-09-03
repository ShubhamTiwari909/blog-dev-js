import { Progress } from "@nextui-org/progress";
import React from "react";

const Loading = () => {
  return (
    <div className="z-50 grid place-items-center">
      <div className="text-3xl lg:text-6xl absolute inset-0 bg-slate-900 z-10 opacity-30"></div>
      <Progress
        size="sm"
        isIndeterminate
        aria-label="Loading..."
        className="max-w-md absolute z-20 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
      />
    </div>
  );
};

export default Loading;
