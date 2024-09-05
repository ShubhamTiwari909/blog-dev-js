"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import React from "react";
import BlogRenderer from "./BlogRenderer";

// Create a client
const queryClient = new QueryClient();

const BlogWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

export default BlogWrapper;
