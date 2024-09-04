"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import * as commands from "@uiw/react-md-editor/commands";
import rehypeSanitize from "rehype-sanitize";
import { getCodeString } from "rehype-rewrite";
import katex from "katex";
import "katex/dist/katex.css";
import { useMarkdownStore } from "@/store/useStore";
import InputGroup from "@/components/Editor/InputGroup";
import ProtectedRoute from "./ProtectedRoute";
import Loading from "@/app/loading";
import { TextState } from "@uiw/react-md-editor";
import { TextAreaTextApi } from "@uiw/react-md-editor";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

const customBtnClasses =
  "[&_div#user-content-custom-link-container>a]:my-2 [&_div#user-content-custom-link-container>a]:no-underline [&_div#user-content-custom-link-container>a]:inline-block [&_div#user-content-custom-link-container>a]:px-4 [&_div#user-content-custom-link-container>a]:py-2 [&_div#user-content-custom-link-container>a]:rounded-xl [&_div#user-content-custom-link-container>a#user-content-custom-link-red]:bg-red-500 [&_div#user-content-custom-link-container>a#user-content-custom-link-green]:bg-green-500 [&_div#user-content-custom-link-container>a#user-content-custom-link-yellow]:bg-yellow-500 [&_div#user-content-custom-link-container>a#user-content-custom-link-pink]:bg-pink-500 [&_div#user-content-custom-link-container>a#user-content-custom-link-purple]:bg-purple-500 [&_div#user-content-custom-link-container>a#user-content-custom-link-blue]:bg-blue-500 [&_div#user-content-custom-link-container>a]:text-white";

export default function CreateBlog() {
  const [markdownError, setMarkdownError] = useState(false);
  const [loading, setLoading] = useState(false);

  const markdown = useMarkdownStore((state) => state.markdown);
  const updateMarkdown = useMarkdownStore((state) => state.updateMarkdown);

  const CustomButton = (btnColor: string) => {
    return {
      name: "Custom Button Link",
      keyCommand: "customButtonLink",
      buttonProps: { "aria-label": "Insert Button" },
      icon: <p>{btnColor}</p>,
      execute: (state: TextState, api: TextAreaTextApi) => {
        let modifyText = `\n <div id="custom-link-container"><a target="_blank" id="custom-link-${btnColor}" href="">${state.selectedText}</a></div> \n`;
        if (!state.selectedText) {
          modifyText = `\n <div id="custom-link-container"><a target="_blank" id="custom-link-${btnColor}" href="">Button</a></div>\n `;
        }
        api.replaceSelection(modifyText);
      },
    };
  };

  const InlineElements = () => {
    return {
      name: "Custom Inline Container",
      keyCommand: "customInlineContainer",
      buttonProps: { "aria-label": "Insert Inline Container" },
      icon: <p>Inline</p>,
      execute: (state: TextState, api: TextAreaTextApi) => {
        let modifyText = `\n <div id="custom-flex-container">${state.selectedText}</div> \n`;
        if (!state.selectedText) {
          modifyText = `\n <div id="custom-flex-container">${state.selectedText}</div> \n `;
        }
        api.replaceSelection(modifyText);
      },
    };
  }

  return (
    <ProtectedRoute>
      <section className="min-h-screen py-20 px-6 lg:px-16">
        <InputGroup
          markdownError={markdownError}
          setMarkdownError={setMarkdownError}
          setLoading={setLoading}
        />
        <div className="container mb-10 mx-auto [&_.w-md-editor-toolbar]:p-3 [&_.w-md-editor-toolbar_li>button]:p-1 [&_.w-md-editor-toolbar_ul]:flex [&_.w-md-editor-toolbar_ul]:flex-wrap [&_.w-md-editor-toolbar_ul:first-child]:mb-4 [&_.w-md-editor-toolbar_ul]:gap-2 [&_.w-md-editor-toolbar-divider]:!mt-1 [&_.w-md-editor-toolbar-divider]:h-5 [&_.w-md-editor-toolbar_button_svg]:w-5 [&_.w-md-editor-toolbar_button_svg]:h-5">
          <MDEditor
            className={`mdx-editor border transition-all duration-200 ease-in rounded-3xl [&_ul]:list-disc [&_p>span#user-content-hello]:text-red-500 [&_ol]:list-decimal [&_div#user-content-custom-flex-container]:flex [&_div#user-content-custom-flex-container]:gap-3 ${customBtnClasses} ${markdownError ? "focus-within:border-red-600 border-red-600" : "focus-within:border-sky-600 border-sky-600"}`}
            height={550}
            value={markdown}
            onChange={(value) => {
              updateMarkdown(value as string);
              setMarkdownError(markdown === "");
            }}
            onMouseLeave={() => setMarkdownError(markdown === "")}
            previewOptions={{
              rehypePlugins: [[rehypeSanitize]],
              components: {
                code: ({ children = [], className, ...props }) => {
                  if (
                    typeof children === "string" &&
                    /^\$\$(.*)\$\$/.test(children)
                  ) {
                    const html = katex.renderToString(
                      children.replace(/^\$\$(.*)\$\$/, "$1"),
                      {
                        throwOnError: false,
                      },
                    );
                    return (
                      <code
                        dangerouslySetInnerHTML={{ __html: html }}
                        style={{ background: "transparent" }}
                      />
                    );
                  }
                  const code =
                    props.node && props.node.children
                      ? getCodeString(props.node.children)
                      : children;
                  if (
                    typeof code === "string" &&
                    typeof className === "string" &&
                    /^language-katex/.test(className.toLocaleLowerCase())
                  ) {
                    const html = katex.renderToString(code, {
                      throwOnError: false,
                    });
                    return (
                      <code
                        style={{ fontSize: "150%" }}
                        dangerouslySetInnerHTML={{ __html: html }}
                      />
                    );
                  }
                  return <code className={String(className)}>{children}</code>;
                },
              },
            }}
            extraCommands={[
              commands.group(
                [
                  CustomButton("blue"),
                  CustomButton("red"),
                  CustomButton("green"),
                  CustomButton("purple"),
                  CustomButton("pink"),
                  CustomButton("yellow"),
                ],
                {
                  name: "Custom Button Link",
                  groupName: "customButtonLink",
                  buttonProps: { "aria-label": "Insert Button" },
                  icon: <p>Buttons</p>,
                },
              ),
              InlineElements(),
              commands.fullscreen,
              commands.codePreview,
              commands.codeEdit,
              commands.codeLive,
            ]}
          />
        </div>
      </section>
      <div>{loading ? <Loading /> : null}</div>
    </ProtectedRoute>
  );
}
