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
        color="primary" // sets the color codes for the input
        onChange={(e) => {
          updateBlogTitle(e.target.value);
          if (titleError || !e.target.value) setTitleError(false); // If the title is not empty, set the title error to false
        }}
        onBlur={() => {
            blogTitle === "" ? setTitleError(true) : setTitleError(false); // Setting title field error based on blogTitle value
        }}
        isRequired
        size="md"
        variant="underlined"
        label="Title"
        labelPlacement="inside"
        isClearable // Enables the clear button to clear the input field
        onClear={() => updateBlogTitle("")} // Updating the state with an empty string when the clear button is clicked
        isInvalid={titleError} // Trigger the Invalid state when the titleError state is true
        errorMessage="Please enter title" // Error message to be displayed when the titleError state is true
        type="text"
      />
  );
};

export default BlogTitle;
