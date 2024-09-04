import React from "react";
import { getBlogPageData } from "../../../../server/dbMethods";
import Image from "next/image";
import MDEditor from "@uiw/react-md-editor";
import MarkdownRenderer from "@/components/MarkdownRendered";

const blogData = async (blogUrl: string) => {
  const result = getBlogPageData(blogUrl.replace("/blogs/", "")).then(
    (data) => data,
  );
  return result;
};

const page = async ({ params }: { params: { blog: string } }) => {
  const { blog } = params;
  const data = await blogData(blog);
  return (
    <div className="container lg:max-w-[1200px] mx-auto py-10 lg:py-16 px-8 lg:px-0">
      <h1 className="text-2xl lg:text-5xl mb-3 lg:mb-6">{data[0].blogTitle}</h1>
      <ul className="flex items-center gap-4 lg:gap-5 flex-wrap mb-5 lg:mb-10">
        {data[0].tags.map((tag) => {
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
        src={data[0].image.url}
        alt={data[0].image.name}
        width={800}
        height={500}
        className="w-full lg:w-2/3 h-auto lg:h-96 rounded-xl border border-white object-cover mb-10"
      />
      <MarkdownRenderer markdown={data[0].markdown} />
    </div>
  );
};

export default page;
