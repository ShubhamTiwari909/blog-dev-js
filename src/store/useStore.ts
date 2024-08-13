import { IdTokenResult } from "firebase/auth";
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
        updateUser: (user: User) => set({ user }),
        markdown: "",
        updateMarkdown: (markdown) => set({ markdown }),
        blogTitle: "",
        updateBlogTitle: (blogTitle) => set({ blogTitle }),
        blogUrl: "",
        updateBlogUrl: (blogUrl) => set({ blogUrl }),
      }),
      {
        name: "markdown",
      },
    ),
  ),
);
