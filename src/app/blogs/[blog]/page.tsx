import React from "react";
import BlogWrapper from "@/components/Blogs/BlogWrapper";
import BlogRenderer from "@/components/Blogs/BlogRenderer";

const page = async ({ params }: { params: { blog: string } }) => {
  const { blog } = params;
  return (
    <BlogWrapper>
      <BlogRenderer blogUrl={blog} />
    </BlogWrapper>
  );
};

export default page;
