"use client";
import Image from "next/image";
import React from "react";
import MarkdownRenderer from "../MarkdownRenderer";
import { useQuery } from "@tanstack/react-query";
import { getBlogPageData } from "../../../server/dbMethods";
import { Skeleton } from "@nextui-org/skeleton";

const BlogRenderer = ({ blogUrl }: { blogUrl: string }) => {
  // Queries
  const query = useQuery({
    queryKey: ["blog"],
    queryFn: () => getBlogPageData(blogUrl.replace("/blogs/", "")),
  });

  return (
    <div className="container lg:max-w-[1200px] mx-auto py-10 lg:py-16">
      {query.isPending ? (
        <>
          <Skeleton className="h-12 w-48 rounded-lg bg-default-300 mb-3 lg:mb-6"></Skeleton>
          <ul className="flex items-center gap-4 lg:gap-5 flex-wrap mb-5 lg:mb-10">
            {[1, 2, 3, 4].map((i) => {
              return (
                <Skeleton
                  className="h-12 w-20 px-4 py-1.5 rounded-full"
                  key={i}
                ></Skeleton>
              );
            })}
          </ul>
          <Skeleton className="w-full lg:w-2/3 h-auto lg:h-96 rounded-xl mb-10"></Skeleton>
          <Skeleton className="w-full lg:w-2/3 h-auto lg:h-96 rounded-xl mb-10"></Skeleton>
        </>
      ) : (
        <>
          <div className="px-8 lg:px-0">
            <h1 className="text-2xl lg:text-5xl mb-3 lg:mb-6">
              {query?.data?.[0].blogTitle}
            </h1>
            <ul className="flex items-center gap-4 lg:gap-5 flex-wrap mb-5 lg:mb-10">
              {query?.data?.[0].tags.map((tag) => {
                return (
                  <li
                    key={tag}
                    className="text-xs bg-blue-300 text-blue-700 px-4 py-1.5 rounded-full"
                  >
                    #{tag}
                  </li>
                );
              })}
            </ul>
            <Image
              src={query?.data?.[0].image.url || ""}
              alt={query?.data?.[0].image.name || ""}
              width={800}
              height={500}
              className="w-full lg:w-2/3 h-auto lg:h-96 rounded-xl border border-white object-cover mb-10"
            />
          </div>

          <MarkdownRenderer markdown={query?.data?.[0].markdown} />
        </>
      )}
    </div>
  );
};

export default BlogRenderer;
