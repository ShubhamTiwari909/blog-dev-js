"use client";
import { DocumentData } from "firebase/firestore";
import React from "react";
import { getBlogsFromTags } from "../../../server/dbMethods";
import BlogsFetch from "./BlogsFetch";

const TagBlogs = ({ tagName }: { tagName: string }) => {
  const [lastDoc, setLastDoc] = React.useState<DocumentData | undefined>(
    undefined,
  );

  return (
    <BlogsFetch
      qKey={["tags", tagName]}
      queryFunction={() =>
        getBlogsFromTags(tagName.replaceAll("%20", " "), lastDoc)
      }
      setLastDoc={setLastDoc}
      filter={{
        filterName: "tags",
        operator: "array-contains",
        value: tagName.replaceAll("%20", " "),
      }}
    />
  );
};

export default TagBlogs;
