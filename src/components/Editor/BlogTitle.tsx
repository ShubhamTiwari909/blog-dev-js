import { useMarkdownStore } from "@/store/useStore";
import { Input } from "@nextui-org/input";
import React from "react";

const BlogTitle = ({
  titleError,
  setTitleError,
}: {
  titleError: boolean;
  setTitleError: (titleError: boolean) => void;
}) => {
  const blogTitle = useMarkdownStore((state) => state.blogTitle);
  const updateBlogTitle = useMarkdownStore((state) => state.updateBlogTitle);
  return (
    <Input
      value={blogTitle}
      color="primary"
      onChange={(e) => {
        updateBlogTitle(e.target.value);
        if (titleError || !e.target.value) setTitleError(false);
      }}
      onBlur={() => {
        if (blogTitle === "") setTitleError(true);
        else setTitleError(false);
      }}
      isRequired
      size="md"
      variant="underlined"
      label="Title"
      labelPlacement="inside"
      isClearable
      onClear={() => updateBlogTitle("")}
      isInvalid={titleError}
      errorMessage="Please enter title"
      type="text"
    />
  );
};

export default BlogTitle;
