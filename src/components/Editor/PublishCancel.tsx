import { geneteBlogUrl } from "@/lib/utils";
import { useMarkdownStore } from "@/store/useStore";
import { Button } from "@nextui-org/button";
import { useRouter } from "next/navigation";
import React from "react";

const PublishCancel = ({
  titleError,
  tagError,
  setTitleError,
  setTagError,
  file,
  fileError,
  setFileError,
  formReset
}: {
  titleError: boolean;
  tagError: boolean;
  setTitleError: (titleError: boolean) => void;
  setTagError: (tagError: boolean) => void;
  file: File | null;
  fileError: boolean;
  setFileError: (fileError: boolean) => void;
  formReset: () => void
}) => {
  const blogTitle = useMarkdownStore((state) => state.blogTitle);
  const tags = useMarkdownStore((state) => state.tags);
  const updateBlogUrl = useMarkdownStore((state) => state.updateBlogUrl);

  const router = useRouter();

  return (
    <div className="flex gap-x-5 lg:mt-2">
      <Button
        type="submit"
        variant="bordered"
        color="primary"
        onClick={() => {
          setTitleError(!blogTitle);
          setTagError(!tags || tags.includes("") || tags.length === 0);
          setFileError(!file);
          if (!titleError && !tagError && !fileError) {
            geneteBlogUrl(updateBlogUrl, blogTitle);
          }
        }}
      >
        Publish
      </Button>
      <Button
        variant="bordered"
        color="danger"
        onClick={() => {
          formReset()
          router.push("/");
        }}
      >
        Cancel
      </Button>
    </div>
  );
};

export default PublishCancel;
