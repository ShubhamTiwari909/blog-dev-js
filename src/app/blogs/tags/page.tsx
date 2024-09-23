import { Card, CardBody } from "@nextui-org/card";
import Link from "next/link";
import React from "react";
import Spotlight, { SpotlightCard } from "@/components/SpotLight";

const page = () => {
  const tags = [
    "HTML",
    "CSS",
    "JS",
    "REACT",
    "NEXT JS",
    "TAILWIND",
    "WEB DEV",
    "FRONTEND",
    "BACKEND",
    "FULLSTACK",
  ];
  return (
    <section className="min-h-screen py-10 px-6 lg:px-16">
      <h1 className="text-center text-2xl lg:text-5xl mb-6">
        Welcome to BlogDev.js
      </h1>
      <div className="flex flex-wrap gap-10">
        {tags.map((tag) => {
          return (
            <Spotlight>
              <SpotlightCard>
                <Card>
                  <CardBody className="min-w-40 min-h-20 text-center grid place-items-center">
                    <Link href={`/blogs/tags/${tag}`}>{tag}</Link>
                  </CardBody>
                </Card>
              </SpotlightCard>
            </Spotlight>
          );
        })}
      </div>
    </section>
  );
};

export default page;
