import BlogRenderer from "@/components/Blogs/BlogRenderer";

const page = async ({ params }: { params: { blog: string } }) => {
  const { blog } = params;

  return (
      <BlogRenderer blogUrl={blog} />
  );
};

export default page;
