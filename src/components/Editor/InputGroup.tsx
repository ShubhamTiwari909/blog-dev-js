"use client";
import { useMarkdownStore } from "@/store/useStore";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import BlogTitle from "./BlogTitle";
import PublishCancel from "./PublishCancel";
import Tags from "./Tags";
import FileUpload from "./FileUpload";
import { deleteImage, uploadImage } from "../../../server/storage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editBlogToDb, writeBlogsToDb } from "../../../server/dbMethods";

type Blog = {
  userId: string | null;
  blogTitle: string;
  blogUrl: string;
  image: {
    name: string;
    url: string;
  };
  tags: string[];
  markdown: string;
};

const InputGroup = ({
  markdownError,
  setMarkdownError,
  setLoading,
}: {
  markdownError: boolean;
  setMarkdownError: (markdownError: boolean) => void;
  setLoading: (loading: boolean) => void;
}) => {
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
  const blogId = useMarkdownStore((state) => state.blogId);
  const updateBlogId = useMarkdownStore((state) => state.updateBlogId);
  const image = useMarkdownStore((state) => state.image);
  const updateImage = useMarkdownStore((state) => state.updateImage);
  const user = useMarkdownStore((state) => state.user);
  const router = useRouter();

  const formReset = () => {
    updateMarkdown("");
    updateBlogTitle("");
    updateBlogUrl("");
    updateImage({ name: "", url: "" });
    updateTags([]);
    updateBlogId("");
    setTitleError(false);
    setTagError(false);
    setFileError(false);
    setMarkdownError(false);
    setFile(null);
  };

  const blogHandler = async ({ name, url }: { name: string; url: string }) => {
    const { editBlogToDb } = await import("../../../server/dbMethods");
    const blog = {
      userId: user.uid,
      blogTitle,
      blogUrl,
      image: {
        name,
        url,
      },
      tags,
      markdown,
    };
    editBlogToDb(blog, blogId).then(() => {
      formReset();
      router.push(`/blogs/${blogUrl}`);
    });
  };

  // Access the client
  const queryClient = useQueryClient();

  const mutationCreateBlog = useMutation({
    mutationFn: (blog: Blog) => writeBlogsToDb(blog),
    onSuccess: () => {
      formReset();
      setTimeout(() => {
        router.push(`/blogs/${blogUrl}`);
      }, 100);
    },
  });

  const mutationUpdateBlog = useMutation({
    mutationFn: (blog: Blog) => editBlogToDb(blog, blogId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["blogs", user.uid] });
    },
  });

  const mutationUploadImage = useMutation({
    mutationFn: () => uploadImage(file),
    onSuccess: async (url) => {
      const blog = {
        userId: user.uid,
        blogTitle,
        blogUrl,
        image: {
          name: file?.name,
          url: url || "",
        },
        tags,
        markdown,
      };
      if (blogId) {
        mutationUpdateBlog.mutate(blog as Blog);
        queryClient.invalidateQueries({ queryKey: ["blogs", user.uid] });
        deleteImage(image.name);
        blogHandler({
          name: file?.name || "",
          url: url || "",
        });
      } else {
        mutationCreateBlog.mutate(blog as Blog);
      }
    },
  });

  const mutation = useMutation({
    mutationFn: async () => {
      if (!titleError && !tagError && !markdownError) {
        if (blogId) {
          if (!file) {
            setFileError(false);
            setMarkdownError(false);
            blogHandler(image);
          } else {
            mutationUploadImage.mutate();
          }
        } else {
          if (!fileError) {
            mutationUploadImage.mutate();
          }
        }
      }
    },
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    mutation.mutate();
  };

  return (
    <div className="container mx-auto mb-10">
      <form
        className="flex items-stretch justify-between flex-wrap gap-5 mb-5"
        onSubmit={onSubmit}
      >
        <div className="mb-3 flex flex-col lg:flex-row gap-5">
          <BlogTitle titleError={titleError} setTitleError={setTitleError} />
          <PublishCancel
            titleError={titleError}
            tagError={tagError}
            setTitleError={setTitleError}
            setTagError={setTagError}
            setMarkdownError={setMarkdownError}
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
