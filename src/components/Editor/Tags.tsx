import React from "react";
import { Select, SelectItem } from "@nextui-org/select";
import { useMarkdownStore } from "../../store/useStore";
import { TagsData } from "./TagsData";

const Tags = ({
  tagError,
  setTagError,
}: {
  tagError: boolean;
  setTagError: (tagError: boolean) => void;
}) => {
  const tags = useMarkdownStore((state) => state.tags);
  const updateTags = useMarkdownStore((state) => state.updateTags);

  return (
    <Select
      value={tags}
      label={<>Select a tag<span className='text-red-500'>*</span></>}
      size="md"
      variant="underlined"
      color="primary"
      className="max-w-xs"
      selectionMode="multiple"
      selectedKeys={tags}
      isInvalid={tagError}
      errorMessage="Please select tags"
      onClick={() => {
        setTagError(false);
      }}
      onChange={(e) => {
        updateTags(e.target.value.split(",").filter((item) => item !== ""));
        if (tagError || !e.target.value) setTagError(false);
      }}
      onBlur={() => {
        if (tags.includes("") || !tags || tags.length === 0) setTagError(true);
        else setTagError(false);
      }}
    >
      {TagsData.map((tag) => (
        <SelectItem key={tag} value={tag}>
          {tag}
        </SelectItem>
      ))}
    </Select>
  );
};

export default Tags;
