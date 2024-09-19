"use client";
import { useMarkdownStore } from "@/store/useStore";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import BlogTitle from "./BlogTitle";
import PublishCancel from "./PublishCancel";
import Tags from "./Tags";
import FileUpload from "./FileUpload";
import { deleteImage, uploadImage } from "../../../server/storage";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { editBlogToDb, writeBlogsToDb } from "../../../server/dbMethods";
import { BlogSchema } from "@/types/blog";

const InputGroup = ({
  markdownError,
  setMarkdownError,
  setLoading,
}: {
  markdownError: boolean;
  setMarkdownError: (markdownError: boolean) => void;
  setLoading: (loading: boolean) => void;
}) => {
  // Local states
  const [titleError, setTitleError] = useState(false); // Title field error state
  const [tagError, setTagError] = useState(false); // Tag field error state
  const [file, setFile] = useState<File | null>(null); // File state to handle the file input
  const [fileError, setFileError] = useState(false); // File error state to handle the file input errors

  // Global states and their setter method
  const markdown = useMarkdownStore((state) => state.markdown);
  const updateMarkdown = useMarkdownStore((state) => state.updateMarkdown);
  const blogTitle = useMarkdownStore((state) => state.blogTitle);
  const updateBlogTitle = useMarkdownStore((state) => state.updateBlogTitle);
  const blogUrl = useMarkdownStore((state) => state.blogUrl);
  const updateBlogUrl = useMarkdownStore((state) => state.updateBlogUrl);
  const tags = useMarkdownStore((state) => state.tags);
  const updateTags = useMarkdownStore((state) => state.updateTags);
  const blogId = useMarkdownStore((state) => state.blogId);
  const updateBlogId = useMarkdownStore((state) => state.updateBlogId);
  const image = useMarkdownStore((state) => state.image);
  const updateImage = useMarkdownStore((state) => state.updateImage);
  const user = useMarkdownStore((state) => state.user);

  // router to handle the routing dynamically on events
  const router = useRouter();

  // Form reset on cancel or publish events
  const formReset = () => {
    updateMarkdown("");
    updateBlogTitle("");
    updateBlogUrl("");
    updateImage({ name: "", url: "" });
    updateTags([]);
    updateBlogId("");
    setTitleError(false);
    setTagError(false);
    setFileError(false);
    setMarkdownError(false);
    setFile(null);
  };

  // Handler for editing a blog and redirecting to that updated blog page
  const blogHandler = async ({ name, url }: { name: string; url: string }) => {
    const { editBlogToDb } = await import("../../../server/dbMethods");
    const blog = {
      userId: user.uid,
      blogTitle,
      blogUrl,
      image: {
        name,
        url,
      },
      tags,
      markdown,
    };
    editBlogToDb(blog, blogId).then(() => {
      formReset();
      router.push(`/blogs/${blogUrl}`);
    });
  };

  // Access the client for the entire app
  const queryClient = useQueryClient();

  // Mutation for creating a new blog and redirecting to that newly created blog page
  const mutationCreateBlog = useMutation({
    /**
     * Function that creates a new blog in the database
     * @param blog The blog data to be written to the database
     */
    mutationFn: (blog: BlogSchema) => writeBlogsToDb(blog),
    /**
     * Function that is called when the mutation is successful
     */

    onSuccess: () => {
      formReset();
      // Reset the form values
      setTimeout(() => {
        // After 100ms, redirect to the newly created blog page
        router.push(`/blogs/${blogUrl}`);
      }, 100);
    },
  });

  /**
   * Mutation for updating an existing blog in the database
   * @param blog The blog data to be written to the database
   * @param blogId The id of the blog to be updated
   */
  const mutationUpdateBlog = useMutation({
    /**
     * The function that is called when the mutation is triggered
     * @param blog The blog data to be written to the database
     */
    mutationFn: (blog: BlogSchema) => editBlogToDb(blog, blogId),

    /**
     * The function that is called when the mutation is successful
     */
    onSuccess: () => {
      /**
       * Invalidate the cache for the blogs query with the user's id
       * This will cause the blogs query to be refetched the next time it is called
       */
      queryClient.invalidateQueries({ queryKey: ["blogs", user.uid] });
    },
  });

  // Mutation for uploading images
  const mutationUploadImage = useMutation({
    // The function that is called when the mutation is triggered and call the uploadImage function that uploads the image
    mutationFn: () => uploadImage(file),
    
    /**
     * The function that is called when the mutation is successful
     * @param url The url of the uploaded image
     * If the blogId is present, it will update the existing blog with the new image
     * If the blogId is not present, it will create a new blog
     * In both cases, it will invalidate the cache for the blogs query with the user's id
     * and then redirect to the newly created blog page
     */
    onSuccess: async (url) => {
      const blog = {
        userId: user.uid,
        blogTitle,
        blogUrl,
        image: {
          name: file?.name,
          url: url || "",
        },
        tags,
        markdown,
      };
      if (blogId) {
        mutationUpdateBlog.mutate(blog as BlogSchema);
        queryClient.invalidateQueries({ queryKey: ["blogs", user.uid] });
        deleteImage(image.name);
        blogHandler({
          name: file?.name || "",
          url: url || "",
        });
      } else {
        mutationCreateBlog.mutate(blog as BlogSchema);
        queryClient.invalidateQueries({ queryKey: ["blogs"] });
      }
    },
  });

  // Mutation for submit form event, which will trigger the upload image mutation and then the blog create/update mutations
  const mutation = useMutation({
    /**
     * The function that is called when the mutation is triggered
     * If there are no errors in the title, tags and markdown, it will check if the blog already exists
     * If the blog already exists, it will check if an image is being uploaded
     * If an image is being uploaded, it will trigger the mutationUploadImage function
     * If no image is being uploaded, it will call the blogHandler function with the current image
     * If the blog does not exist, it will trigger the mutationUploadImage function directly which then triggers the create blog mutation
     * If there are errors, it will not trigger any mutation
     */
    mutationFn: async () => {
      if (!titleError && !tagError && !markdownError && !fileError) {
        setLoading(true);
        if (blogId) {
          if (!file) {
            setFileError(false);
            setMarkdownError(false);
            blogHandler(image);
          } else {
            mutationUploadImage.mutate();
          }
        } else {
          if (!fileError) {
            mutationUploadImage.mutate();
          }
        }
      }
    },
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <div className="container mx-auto mb-10">
      <form
        className="flex items-stretch justify-between flex-wrap gap-5 mb-5"
        onSubmit={onSubmit}
      >
        <div className="mb-3 flex flex-col lg:flex-row gap-5">
          <BlogTitle titleError={titleError} setTitleError={setTitleError} />
          <PublishCancel
            titleError={titleError}
            tagError={tagError}
            setTitleError={setTitleError}
            setTagError={setTagError}
            setMarkdownError={setMarkdownError}
            file={file}
            fileError={fileError}
            setFileError={setFileError}
            formReset={formReset}
          />
        </div>
        <Tags tagError={tagError} setTagError={setTagError} />

        <FileUpload
          setFile={setFile}
          file={file}
          fileError={fileError}
          setFileError={setFileError}
        />
      </form>
    </div>
  );
};

export default InputGroup;
