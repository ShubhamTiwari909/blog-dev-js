"use client";
import React, { useEffect } from "react";
import { getBlogsFromDb, getUserBlogsFromDb } from "../../server/dbMethods";
import BlogCard from "./Blogs/BlogCard";
import { useMarkdownStore } from "@/store/useStore";

const BlogsFetch = ({
  userId,
  className,
}: {
  userId?: string | null;
  className?: string;
}) => {
  const blogsList = useMarkdownStore((state) => state.blogList);
  const updateBlogList = useMarkdownStore((state) => state.updateBlogList);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const blogs = await (userId
          ? getUserBlogsFromDb(userId)
          : getBlogsFromDb([] as any));
        updateBlogList(blogs);
      } catch {
        console.log("Error fetching blogs");
      }
    };
    fetchBlogs();
  }, [userId]);
  return (
    <>
      <ul
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 justify-center lg:justify-start ${className}`}
      >
        {blogsList.map((blog) => {
          return <BlogCard userId={userId} key={blog.id} blog={blog} />;
        })}
      </ul>
    </>
  );
};

export default BlogsFetch;
