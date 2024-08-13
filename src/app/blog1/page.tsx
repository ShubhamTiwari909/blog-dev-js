"use client";
import React from "react";
import MDEditor from "@uiw/react-md-editor";
import { useMarkdownStore } from "@/store/useStore";

const page = () => {
  const markdown = useMarkdownStore((state) => state.markdown);
  const blogTitle = useMarkdownStore((state) => state.blogTitle);

  return (
    <div className="container mx-auto min-h-screen">
      <h1 className="text-5xl empty:mb-0 mb-10">{blogTitle}</h1>
      <MDEditor.Markdown className="max-w-[800px] border border-slate-300 p-10 [&_img]:max-h-[400px] [&_ul]:list-[unset] [&_img]:w-full [&_img]:object-contain" source={markdown} />
    </div>
  );
};

export default page;
