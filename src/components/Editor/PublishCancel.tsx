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
}) => {
  // Global states and setter methods
  const blogTitle = useMarkdownStore((state) => state.blogTitle);
  const tags = useMarkdownStore((state) => state.tags);
  const updateBlogUrl = useMarkdownStore((state) => state.updateBlogUrl);
  const markdown = useMarkdownStore((state) => state.markdown);
  const blogId = useMarkdownStore((state) => state.blogId);

  // Router for handling route dynamically
  const router = useRouter();

  const publishUpdateEvent = () => {
    // Set the title error if the blog title is empty
    setTitleError(!blogTitle);
    // Set the tag error if there are no tags or if the tags array contains an empty string
    setTagError(!tags || tags.includes("") || tags.length === 0);
    // Set the file error if there is no file selected
    setFileError(!file);
    // Set the markdown error if the markdown text area is empty
    setMarkdownError(markdown === "");
    // If there are no errors, generate a blog url by calling the geneteBlogUrl function
    if (!titleError && !tagError && !fileError) {
      geneteBlogUrl(updateBlogUrl, blogTitle);
    }
  };

  return (
    <div className="flex gap-x-5 lg:mt-2">
      <Button
        type="submit"
        variant="bordered"
        color="primary"
        onClick={publishUpdateEvent}
      >
        {blogId ? "Update" : "Publish"}
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
