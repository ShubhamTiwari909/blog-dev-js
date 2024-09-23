"use client";
import clsx from "clsx";
import { motion } from "framer-motion";

export function LetterPullUp({
  words,
  className,
}: {
  words: string;
  className?: string;
}) {
  const letters = words.split("");
  const pullupVariant = {
    initial: { y: 100, opacity: 0 },
    animate: (i: any) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: i * 0.05, // Delay each letter's animation by 0.05 seconds
        duration: 0.5, // Adjust duration for smoothness
      },
    }),
  };

  return (
    <div className="flex flex-wrap justify-center">
      {letters.map((letter, i) => (
        <motion.h1
          key={i}
          variants={pullupVariant}
          initial="initial"
          animate="animate"
          custom={i}
          className={clsx(
            "text-center font-display font-bold drop-shadow-sm",
            "text-2xl md:text-5xl lg:text-6xl xl:text-7xl",
            "tracking-[-0.02em]",
            "md:leading-[4rem] lg:leading-[4.5rem] xl:leading-[5rem]",
            className
          )}
        >
          {letter === " " ? <span>&nbsp;</span> : letter}
        </motion.h1>
      ))}
    </div>
  );
}
