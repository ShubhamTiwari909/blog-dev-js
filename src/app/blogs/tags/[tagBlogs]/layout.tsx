import { Card, CardBody } from "@nextui-org/card";
import Link from "next/link";
import React from "react";

const page = ({ children }: { children: React.ReactNode }) => {
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
    "WEB DEV",
    "FRONTEND",
    "BACKEND",
    "FULLSTACK",
  ];
  return (
    <section className="min-h-screen py-10 px-6 lg:px-16">
      <div className="flex gap-10 relative">
        <div className="space-y-6 h-[600px] min-w-40 overflow-y-auto sticky top-20">
          {tags.map((tag) => {
            return (
              <Card>
                <CardBody className="min-w-40 text-center">
                  <Link href={`/blogs/tags/${tag}`}>#{tag}</Link>
                </CardBody>
              </Card>
            );
          })}
        </div>
        {children}
      </div>
    </section>
  );
};

export default page;
