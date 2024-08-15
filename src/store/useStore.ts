import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";


type User = {
  uid: string | null;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
};

type Store =  {
  user: User;
  updateUser: (user: User) => void;
  markdown: string;
  updateMarkdown: (markdown: string) => void;
  blogTitle: string;
  updateBlogTitle: (blogTitle: string) => void;
  blogUrl: string;
  updateBlogUrl: (blogUrl: string) => void;
  tags: string[];
  updateTags: (tags: string[]) => void;
}

export const useMarkdownStore = create<Store>()(
  devtools(
    persist(
      (set) => ({
        user: {
          uid: null,
          displayName: null,
          email: null,
          photoURL: null,
        },
        updateUser: (user: User) => set(() => ({ user })), // Change to using a callback to avoid resetting the store
        markdown: "",
        updateMarkdown: (markdown) => set(() => ({ markdown })), // Change to using a callback to avoid resetting the store
        blogTitle: "",
        updateBlogTitle: (blogTitle) => set(() => ({ blogTitle })), // Change to using a callback to avoid resetting the store
        blogUrl: "",
        updateBlogUrl: (blogUrl) => set(() => ({ blogUrl })), // Change to using a callback to avoid resetting the store
        tags: [""],
        updateTags: (tags) => set(() => ({ tags })), // Change to using a callback to avoid resetting the store
      }),
      {
        name: "markdown",
      },
    ),
  ),
);
