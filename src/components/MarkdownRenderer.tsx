"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import MDEditor from "@uiw/react-md-editor";
import React from "react";

// Button classes to render in markdown preview
const customBtnClasses =
  "[&_div#custom-link-container>a]:my-2 [&_div#custom-link-container>a]:no-underline [&_div#custom-link-container>a]:inline-block [&_div#custom-link-container>a]:px-4 [&_div#custom-link-container>a]:py-2 [&_div#custom-link-container>a]:rounded-xl [&_div#custom-link-container>a#custom-link-red]:bg-red-500 [&_div#custom-link-container>a#custom-link-green]:bg-green-500 [&_div#custom-link-container>a#custom-link-yellow]:bg-yellow-500 [&_div#custom-link-container>a#custom-link-pink]:bg-pink-500 [&_div#custom-link-container>a#custom-link-purple]:bg-purple-500 [&_div#custom-link-container>a#custom-link-blue]:bg-blue-500 [&_div#custom-link-container>a]:text-white";

const queryClient = new QueryClient();

const MarkdownRenderer = ({ markdown }: { markdown: string | undefined }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <MDEditor.Markdown
        className={`max-w-[800px] lg:border lg:rounded-xl lg:border-slate-300 p-3 lg:p-10 [&_img]:max-h-[400px] [&_ul]:list-[unset] [&_p]:mb-4 [&_img]:w-full [&_img]:object-cover [&_img]:border-2 [&_img]:border-white [&_img]:!border-solid [&_img]:rounded-xl [&_div#custom-flex-container]:flex [&_div#custom-flex-container]:gap-3 [&_div#custom-flex-container]:flex-wrap ${customBtnClasses}`}
        source={markdown}
      />
    </QueryClientProvider>
  );
};

export default MarkdownRenderer;
