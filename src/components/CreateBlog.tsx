"use client";
import React from "react";
import MDEditor, { commands } from "@uiw/react-md-editor";
import rehypeSanitize from "rehype-sanitize";
import { useMarkdownStore } from "@/store/useStore";
import InputGroup from "@/components/Editor/InputGroup";
import ProtectedRoute from "./ProtectedRoute";

export default function CreateBlog() {
  const markdown = useMarkdownStore((state) => state.markdown);
  const updateMarkdown = useMarkdownStore((state) => state.updateMarkdown);
  return (
    <ProtectedRoute>
      <section className="min-h-screen py-20 px-6 lg:px-16">
        <InputGroup />
        <div className="container mb-10 mx-auto [&_.w-md-editor-toolbar]:p-3 [&_.w-md-editor-toolbar_ul]:flex [&_.w-md-editor-toolbar_ul]:flex-wrap [&_.w-md-editor-toolbar_ul:first-child]:mb-4 [&_.w-md-editor-toolbar_ul]:gap-2 [&_.w-md-editor-toolbar-divider]:!mt-1 [&_.w-md-editor-toolbar-divider]:h-5 [&_.w-md-editor-toolbar_button_svg]:w-5 [&_.w-md-editor-toolbar_button_svg]:h-5">
          <MDEditor
            className={`mdx-editor border transition-all duration-200 ease-in rounded-3xl [&_ul]:list-disc [&_ol]:list-decimal ${markdown === "" ? "focus-within:border-red-600" : "focus-within:border-sky-600"}`}
            height={550}
            value={markdown}
            onChange={(value) => updateMarkdown(value as string)}
            previewOptions={{
              rehypePlugins: [[rehypeSanitize]],
            }}
            extraCommands={[
              commands.fullscreen,
              commands.codePreview,
              commands.codeEdit,
              commands.codeLive,
              commands.checkedListCommand,
            ]}
          />
        </div>
      </section>
    </ProtectedRoute>
  );
}
