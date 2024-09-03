import { useMarkdownStore } from "@/store/useStore";
import { Button } from "@nextui-org/button";
import { useRouter } from "next/navigation";
import React from "react";
import { geneteBlogUrl } from "@/lib/utils";

const PublishCancel = ({
  titleError,
  tagError,
  setTitleError,
  setTagError,
  setMarkdownError,
  file,
  fileError,
  setFileError,
  formReset,
  setLoading,
}: {
  titleError: boolean;
  tagError: boolean;
  setTitleError: (titleError: boolean) => void;
  setTagError: (tagError: boolean) => void;
  setMarkdownError: (markdownError: boolean) => void;
  file: File | null;
  fileError: boolean;
  setFileError: (fileError: boolean) => void;
  formReset: () => void;
  setLoading: (loading: boolean) => void;
}) => {
  const blogTitle = useMarkdownStore((state) => state.blogTitle);
  const tags = useMarkdownStore((state) => state.tags);
  const updateBlogUrl = useMarkdownStore((state) => state.updateBlogUrl);
  const markdown = useMarkdownStore((state) => state.markdown);
  const blogId = useMarkdownStore((state) => state.blogId);

  const router = useRouter();

  return (
    <div className="flex gap-x-5 lg:mt-2">
      <Button
        type="submit"
        variant="bordered"
        color="primary"
        onClick={async () => {
          setTitleError(!blogTitle);
          setTagError(!tags || tags.includes("") || tags.length === 0);
          setFileError(!file);
          setMarkdownError(markdown === "");
          if (!titleError && !tagError && !fileError) {
            geneteBlogUrl(updateBlogUrl, blogTitle);
            setLoading(true);
          }
        }}
      >
        {
          blogId ? "Update" : "Publish"
        }
      </Button>
      <Button
        variant="bordered"
        color="danger"
        onClick={() => {
          formReset();
          router.push("/");
        }}
      >
        Cancel
      </Button>
    </div>
  );
};

export default PublishCancel;
