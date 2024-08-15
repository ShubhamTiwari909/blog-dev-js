"use client";
import { useMarkdownStore } from "@/store/useStore";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { uploadImage } from "../../../server/storage";
import { writeBlogsToDb } from "../../../server/dbMethods";
import BlogTitle from "./BlogTitle";
import PublishCancel from "./PublishCancel";
import Tags from "./Tags";
import FileUpload from "./FileUpload";

const InputGroup = () => {
  const [titleError, setTitleError] = useState(false);
  const [tagError, setTagError] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState(false);

  const markdown = useMarkdownStore((state) => state.markdown);
  const updateMarkdown = useMarkdownStore((state) => state.updateMarkdown);
  const blogTitle = useMarkdownStore((state) => state.blogTitle);
  const updateBlogTitle = useMarkdownStore((state) => state.updateBlogTitle);
  const blogUrl = useMarkdownStore((state) => state.blogUrl);
  const updateBlogUrl = useMarkdownStore((state) => state.updateBlogUrl);
  const tags = useMarkdownStore((state) => state.tags);
  const updateTags = useMarkdownStore((state) => state.updateTags);
  const router = useRouter();

  const formReset = () => {
    updateMarkdown("");
    updateBlogTitle("");
    updateBlogUrl("");
    updateTags([]);
    setTitleError(true);
    setTagError(true);
    setFileError(true);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!titleError && !tagError && !fileError) {
      uploadImage(file).then((url) => {
        const blog = {
          blogTitle,
          blogUrl,
          imageUrl: url,
          tags,
          markdown,
        };
        writeBlogsToDb(blog, () => {
          formReset();
          router.push(`/blog/${blogUrl}`);
        });
      });
    }
  };

  return (
    <div className="container mx-auto mb-10">
      <form
        className="flex items-stretch justify-between flex-wrap gap-5 mb-5"
        onSubmit={handleSubmit}
      >
        <div className="mb-3 flex flex-col lg:flex-row gap-5">
          <BlogTitle titleError={titleError} setTitleError={setTitleError} />
          <PublishCancel
            titleError={titleError}
            tagError={tagError}
            setTitleError={setTitleError}
            setTagError={setTagError}
            file={file}
            fileError={fileError}
            setFileError={setFileError}
            formReset={formReset}
          />
        </div>
        <Tags tagError={tagError} setTagError={setTagError} />

        <FileUpload
          setFile={setFile}
          file={file}
          fileError={fileError}
          setFileError={setFileError}
        />
      </form>
    </div>
  );
};

export default InputGroup;
