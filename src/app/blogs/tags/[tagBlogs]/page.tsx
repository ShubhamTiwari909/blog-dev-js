import TagBlogs from "@/components/Blogs/TagBlogs";
import React from "react";

const page = ({ params }: { params: { tagBlogs: string } }) => {
  return (
    <section className="min-h-screen py-10 px-6 lg:px-16">
      <TagBlogs tagName={params.tagBlogs} />
    </section>
  );
};

export default page;
