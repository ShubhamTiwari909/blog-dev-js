"use client";
import { useMarkdownStore } from "@/store/useStore";
import { Button } from "@nextui-org/button";
import { FilePenLine, RectangleEllipsis, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { deleteImage } from "../../../server/storage";
import { deleteBlogFromDb } from "../../../server/dbMethods";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { BlogSchema } from "@/types/blog";
import { convertSecondsToDate } from "@/lib/utils";

const BlogCard = ({
  blog,
  userId,
}: {
  blog: BlogSchema;
  userId?: string | null;
}) => {
  // Destructured blog properties
  const { blogTitle, blogUrl, image, tags, createdAt } = blog;

  return (
    <li className="group/blogcard relative flex flex-col items-start justify-between overflow-hidden bg-zinc-900 hover:scale-105  hover:bg-slate-100 transition-all duration-200 ease-in-out min-w-56 flex-1 lg:flex-auto rounded-xl shadow-sm shadow-blue-100">
      <div className="w-full">
        <Image
          width="400"
          height="224"
          className="object-center object-cover h-56 w-full"
          src={image.url}
          alt={blogTitle}
        />
        <div className="px-4 py-6">
          <div className="flex justify-between items-center mb-4 ">
            <h2 className="text-2xl text-slate-100 group-hover/blogcard:text-slate-900 font-bold">
              {blogTitle}
            </h2>
            <p className="text-xs font-bold text-blue-900 group-hover/blogcard:text-blue-100 group-hover/blogcard:bg-blue-700 px-2 py-1 rounded-full bg-blue-200">
              {convertSecondsToDate(createdAt?.seconds as number)}
            </p>
          </div>
          <p className="flex gap-x-2 gap-y-3 items-center flex-wrap text-xs">
            {tags.map((tag) => (
              <span
                className="inline-block bg-slate-100 text-slate-700 text-[10px] group-hover/blogcard:text-slate-100 group-hover/blogcard:bg-slate-700 text-center px-2 py-1 rounded-full"
                key={tag}
              >
                #{tag}
              </span>
            ))}
          </p>
        </div>
      </div>
      <Link
        className="text-sm ml-4 mb-6 inline-block px-6 py-2 rounded-full bg-blue-400 text-white group-hover/blogcard:bg-blue-700 transition-all duration-200 ease-in-out"
        href={`/blogs/${blogUrl}`}
      >
        Read Blog
      </Link>
      <FormSettings blog={blog} userId={userId} />
    </li>
  );
};

export default BlogCard;

const FormSettings = ({
  blog,
  userId,
}: {
  blog: BlogSchema;
  userId?: string | null;
}) => {
  const { blogTitle, blogUrl, image, markdown, tags, id } = blog;
  // Local state to toggle the settings of a blog card
  const [open, setOpen] = React.useState(false);

  // Global states
  const updateMarkdown = useMarkdownStore((state) => state.updateMarkdown);
  const updateBlogTitle = useMarkdownStore((state) => state.updateBlogTitle);
  const updateBlogUrl = useMarkdownStore((state) => state.updateBlogUrl);
  const updateImage = useMarkdownStore((state) => state.updateImage);
  const updateTags = useMarkdownStore((state) => state.updateTags);
  const updateBlogId = useMarkdownStore((state) => state.updateBlogId);
  // Updating form fields with the blog current data
  const updateBlogFormValues = () => {
    updateMarkdown(markdown);
    updateBlogTitle(blogTitle);
    updateBlogUrl(blogUrl);
    updateImage(image);
    updateTags(tags);
    updateBlogId(id as string);
  };

  // Accessing the query client
  const queryClient = useQueryClient();

  // Mutation for deleting a blog and updating the blogs list
  const mutation = useMutation({
    mutationFn: () => deleteBlogFromDb(id as string),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["blogs"] });

      // Deleting thumbnail image from DB
      deleteImage(image.name);
    },
  });
  return (
    <>
      {userId && (
        <div
          className="absolute top-1 right-1 text-right"
          onMouseLeave={() => setOpen(false)}
        >
          <Button
            size="sm"
            variant="solid"
            className="text-base mb-1"
            onClick={() => setOpen(!open)}
          >
            <RectangleEllipsis />
          </Button>
          {open ? (
            <div className="flex gap-3 flex-col p-2.5 bg-white rounded-xl">
              <Button size="sm" color="primary" className="w-fit">
                <Link href="/create-blog" onClick={updateBlogFormValues}>
                  <FilePenLine size="1rem" />
                </Link>
              </Button>
              <Button
                size="sm"
                color="danger"
                className="w-fit"
                onClick={() => {
                  mutation.mutate();
                }}
              >
                <Trash2 size="1rem" />
              </Button>
            </div>
          ) : null}
        </div>
      )}
    </>
  );
};
