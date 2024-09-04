"use client";
import { useMarkdownStore } from "@/store/useStore";
import { Button } from "@nextui-org/button";
import { FilePenLine, RectangleEllipsis, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { deleteImage } from "../../../server/storage";
import { deleteBlogFromDb } from "../../../server/dbMethods";

const BlogCard = ({
  blog,
  userId,
}: {
  blog: {
    blogTitle: string;
    blogUrl: string;
    image: {
      name: string;
      url: string;
    };
    markdown: string;
    tags: string[];
    id: string;
  };
  userId?: string | null;
}) => {
  const { blogTitle, blogUrl, image, markdown, tags, id } = blog;
  const [open, setOpen] = React.useState(false);

  const updateMarkdown = useMarkdownStore((state) => state.updateMarkdown);
  const updateBlogTitle = useMarkdownStore((state) => state.updateBlogTitle);
  const updateBlogUrl = useMarkdownStore((state) => state.updateBlogUrl);
  const updateImage = useMarkdownStore((state) => state.updateImage);
  const updateTags = useMarkdownStore((state) => state.updateTags);
  const updateBlogId = useMarkdownStore((state) => state.updateBlogId);
  const updateBlogList = useMarkdownStore((state) => state.updateBlogList);

  return (
    <li className="group/blogcard relative flex flex-col items-start justify-between overflow-hidden hover:bg-slate-100 transition-all duration-200 ease-in-out min-w-56 flex-1 lg:flex-auto  rounded-xl border border-blue-400">
      <div className="w-full">
        <Image
          width="400"
          height="224"
          className="object-center object-cover h-56"
          src={image.url}
          alt={blogTitle}
        />
        <div className="px-4 py-6">
          <h2 className="mb-4 text-2xl text-slate-100 group-hover/blogcard:text-slate-900 font-bold">
            {blogTitle}
          </h2>
          <p className="flex gap-x-2 gap-y-3 items-center flex-wrap text-xs">
            {tags.map((tag) => (
              <span
                className="inline-block bg-slate-100 text-slate-700 group-hover/blogcard:text-slate-100 group-hover/blogcard:bg-slate-700 min-w-16 text-center px-3 py-2 rounded-full"
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
                <Link
                  href="/create-blog"
                  onClick={() => {
                    updateMarkdown(markdown);
                    updateBlogTitle(blogTitle);
                    updateBlogUrl(blogUrl);
                    updateImage(image);
                    updateTags(tags);
                    updateBlogId(id);
                  }}
                >
                  <FilePenLine size="1rem" />
                </Link>
              </Button>
              <Button
                size="sm"
                color="danger"
                className="w-fit"
                onClick={() => {
                  deleteBlogFromDb(id).then(() => {
                    deleteImage(image.name, updateBlogList);
                  });
                }}
              >
                <Trash2 size="1rem" />
              </Button>
            </div>
          ) : null}
        </div>
      )}
    </li>
  );
};

export default BlogCard;
