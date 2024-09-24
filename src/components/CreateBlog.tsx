"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import * as commands from "@uiw/react-md-editor/commands";
import rehypeSanitize from "rehype-sanitize";
import { getCodeString } from "rehype-rewrite";
import katex from "katex";
import "katex/dist/katex.css";
import { useMarkdownStore } from "@/store/useStore";
import MarkDownEditor from "@/components/Editor/MarkDownEditor";
import ProtectedRoute from "./ProtectedRoute";
import Loading from "@/app/loading";
import { TextState } from "@uiw/react-md-editor";
import { TextAreaTextApi } from "@uiw/react-md-editor";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

export default function CreateBlog() {
  // Local states
  const [markdownError, setMarkdownError] = useState(false);
  const [loading, setLoading] = useState(false);

  // Global state and its setter method
  const markdown = useMarkdownStore((state) => state.markdown);
  const updateMarkdown = useMarkdownStore((state) => state.updateMarkdown);

  return (
    <ProtectedRoute>
      <section className="min-h-screen py-20 px-6 lg:px-16">
        <MarkDownEditor
          markdownError={markdownError}
          setMarkdownError={setMarkdownError}
          setLoading={setLoading}
        />
        <div className="container mb-10 mx-auto [&_.w-md-editor-toolbar]:p-3 [&_.w-md-editor-toolbar_li>button]:p-1 [&_.w-md-editor-toolbar_ul]:flex [&_.w-md-editor-toolbar_ul]:flex-wrap [&_.w-md-editor-toolbar_ul:first-child]:mb-4 [&_.w-md-editor-toolbar_ul]:gap-2 [&_.w-md-editor-toolbar-divider]:!mt-1 [&_.w-md-editor-toolbar-divider]:h-5 [&_.w-md-editor-toolbar_button_svg]:w-5 [&_.w-md-editor-toolbar_button_svg]:h-5">
          <MDEditor
            className={`border transition-all duration-200 ease-in rounded-3xl [&_ul]:list-disc [&_p>span#user-content-hello]:text-red-500 [&_ol]:list-decimal [&_div#user-content-custom-flex-container]:flex [&_div#user-content-custom-flex-container]:gap-3 [&_div#user-content-custom-flex-container]:flex-wrap customBtnClasses ${markdownError ? "focus-within:border-red-600 border-red-600" : "focus-within:border-sky-600 border-sky-600"}`}
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
                /**
                 * A custom component for rendering code blocks with KaTeX.
                 * If the code block starts and ends with "$$", it will be rendered as a KaTeX equation.
                 * If the code block has a language specified as "katex", it will also be rendered as a KaTeX equation.
                 * Otherwise, it will be rendered as a regular code block.
                 * @param {{ children: string | React.ReactNode[] }} props The props for the code component.
                 * @returns {React.ReactElement} The rendered code component.
                 */
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
                ["blue", "red", "green", "purple", "pink", "yellow"].map(
                  (color) => CustomButton(color),
                ),
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

/**
 * Custom button component for inserting a button link in the markdown editor.
 * @param {strin g} btnColor - The color of the button.
 * @returns {Object} - An object with the name, keyCommand, buttonProps, and execute properties.
 * The execute function takes in the current state of the markdown editor and the TextAreaTextApi,
 * and replaces the selected text with a button link.
 */
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

/**
 * Custom component for inserting an inline container in the markdown editor.
 * @returns {Object} - An object with the name, keyCommand, buttonProps, and execute properties.
 * The execute function takes in the current state of the markdown editor and the TextAreaTextApi,
 * and replaces the selected text with an inline container.
 */
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
};
