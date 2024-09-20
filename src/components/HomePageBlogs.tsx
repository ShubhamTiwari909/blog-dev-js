"use client";
import React from "react";
import { getBlogsFromDb } from "../../server/dbMethods";
import { DocumentData } from "firebase/firestore";
import BlogsFetch from "./BlogsFetch";

const HomePageBlogs = () => {
  const [lastDoc, setLastDoc] = React.useState<DocumentData | undefined>(
    undefined,
  );
  return (
    <BlogsFetch
      qKey={["blogs"]}
      queryFunction={() => getBlogsFromDb([] as any, lastDoc)}
      className="lg:grid-cols-4"
      setLastDoc={setLastDoc}
    />
  );
};

export default HomePageBlogs;
