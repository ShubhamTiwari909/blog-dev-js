import React from "react";
import { Cobe } from "@/components/CobeGlobe";
import { LetterPullUp } from "@/components/LetterPullUp";

const Cobeglobedemo = () => {
  return (
    <section className="py-10">
      <LetterPullUp words="Write your blog from anywhere" className="text-balance" />
      <div className="items-center justify-center md:h-auto dark:bg-black bg-white relative w-full">
        <Cobe />
      </div>
    </section>
  );
};

export default Cobeglobedemo;
