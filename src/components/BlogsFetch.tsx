"use client";
import React from "react";
import { getBlogsFromDb, getUserBlogsFromDb } from "../../server/dbMethods";
import BlogCard from "./Blogs/BlogCard";
import { useQuery } from "@tanstack/react-query";
import BlogCardSkeleton from "./Blogs/BlogCardSkeleton";

const BlogsFetch = ({
  userId,
  className,
}: {
  userId?: string | null;
  className?: string;
}) => {
  const query = useQuery({
    queryKey: userId ? ["blogs", userId] : ["blogs"],
    queryFn: () =>
      userId ? getUserBlogsFromDb(userId) : getBlogsFromDb([] as any),
  });
  return (
    <>
      <ul
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 justify-center lg:justify-start ${className}`}
      >
        {query.isPending ? (
          [...Array(4)].map((_, i) => <BlogCardSkeleton key={i} />)
        ) : (
          query?.data?.map((blog) => {
            return <BlogCard userId={userId} key={blog.id} blog={blog} />;
          })
        )}
      </ul>
    </>
  );
};

export default BlogsFetch;
