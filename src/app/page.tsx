"use client";
import React, { useEffect, useState } from "react";
import MDEditor, { commands, ICommand } from "@uiw/react-md-editor";
import rehypeSanitize from "rehype-sanitize";
import { useMarkdownStore } from "@/store/useStore";
import { Input } from "@nextui-org/input";
import { Button } from "@nextui-org/button";
import { useRouter } from "next/navigation";


export default function App() {
  const markdown = useMarkdownStore((state) => state.markdown);
  const updateMarkdown = useMarkdownStore((state) => state.updateMarkdown);
  const blogTitle = useMarkdownStore((state) => state.blogTitle);
  const updateBlogTitle = useMarkdownStore((state) => state.updateBlogTitle);
  const blogUrl = useMarkdownStore((state) => state.blogUrl);
  const updateBlogUrl = useMarkdownStore((state) => state.updateBlogUrl);

  const [titleError, setTitleError] = useState(false);
  const geneteBlogUrl = () => {
    updateBlogUrl(`${blogTitle.toLocaleLowerCase().replaceAll(" ", "-").trim().slice(0, 20)}-${Math.floor(Math.random() * 1000000000)}`);
  }
  const router = useRouter()
  return (
    <section className="min-h-screen py-20 px-6 lg:px-16">
      <div className="container mx-auto mb-10 flex flex-col lg:flex-row gap-5">
        <Input
          value={blogTitle}
          onChange={(e) => {
            updateBlogTitle(e.target.value);
            if(titleError || !e.target.value) setTitleError(false);
          }}
          onBlur={() => {
            if(blogTitle === "") setTitleError(true);
            else setTitleError(false);
          }}
          isRequired
          size="md"
          variant="bordered"
          label="Title"
          labelPlacement="inside"
          isClearable
          onClear={() => updateBlogTitle("")}
          isInvalid={titleError}
          errorMessage="Please enter title"
          className="lg:w-1/3"
        />
        <div className="space-x-5 mt-2">
        <Button
          variant="bordered"
          color="primary"
          onClick={() => {
            if(blogTitle !== "") {
              geneteBlogUrl();
              console.log(blogTitle, markdown, blogUrl);
              setTitleError(false);
            }
            else {
              setTitleError(true);
            }
          }}
        >
          Publish
        </Button>
        <Button
          variant="bordered"
          color="danger"
          onClick={() => {
            updateMarkdown("");
            updateBlogTitle("");
            updateBlogUrl("");
            setTitleError(true);
            router.push("/");
          }}
        >
          Cancel
        </Button>
        </div>
      </div>
      <div className="container mb-10 mx-auto [&_.w-md-editor-toolbar]:p-3 [&_.w-md-editor-toolbar_ul]:flex [&_.w-md-editor-toolbar_ul]:flex-wrap [&_.w-md-editor-toolbar_ul:first-child]:mb-4 [&_.w-md-editor-toolbar_ul]:gap-2 [&_.w-md-editor-toolbar-divider]:!mt-1 [&_.w-md-editor-toolbar-divider]:h-5 [&_.w-md-editor-toolbar_button_svg]:w-5 [&_.w-md-editor-toolbar_button_svg]:h-5">
        <MDEditor
          className="mdx-editor border focus-within:border-sky-600 transition-all duration-200 ease-in rounded-3xl [&_ul]:list-disc [&_ol]:list-decimal"
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
  );
}
