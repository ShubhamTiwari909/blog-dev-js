import React, { Fragment, useEffect } from "react";
import { Select, SelectItem } from "@nextui-org/select";
import { useMarkdownStore } from "../../store/useStore";

const TagsData = ["HTML","CSS","JS","REACT","NEXT JS","TAILWIND","WEB DEV","FRONTEND","BACKEND","FULLSTACK"]

const Tags = ({
  tagError,
  setTagError,
}: {
  tagError: boolean;
  setTagError: (tagError: boolean) => void;
}) => {
  // Global state and its setter method
  const tags = useMarkdownStore((state) => state.tags);
  const updateTags = useMarkdownStore((state) => state.updateTags);
  const selectRef = React.useRef<HTMLSelectElement | null>(null);

  return (
    <div
      className="min-w-80"
      onMouseLeave={() => {
        if (tags.includes("") || !tags || tags.length === 0) {
          setTagError(true);
        } else setTagError(false);
      }}
    >
      <Select
        ref={selectRef}
        value={tags}
        label={
          <>
            Select a tag<span className="text-red-500">*</span>
          </>
        }
        size="md"
        variant="underlined"
        color="primary"
        className="max-w-xs"
        selectionMode="multiple" // Allow for multiple selection
        selectedKeys={tags} // shows the selected keys
        isInvalid={tagError} // Trigger the Invalid state when the tagError state is true
        errorMessage="Please select tags"
        onClick={() => {
          setTagError(false);
        }}
        onChange={(e) => {
          // Update the tags state with the selected values
          // Filter out empty strings and trim the array
          updateTags(
            e.target.value
              .split(",")
              .filter((item) => item.trim() !== "")
              .map((item) => item.trim()),
          );
        }}
      >
        {TagsData.map((tag) => (
          <SelectItem key={tag} value={tag}>
            {tag}
          </SelectItem>
        ))}
      </Select>
    </div>
  );
};

export default Tags;
