import HomePageBlogs from "@/components/HomePageBlogs";
import { LetterPullUp } from "@/components/LetterPullUp";
import React from "react";

export default function App() {
  return (
    <section className="min-h-screen py-10 px-6 lg:px-16">
      <LetterPullUp words="Welcome to BlogDev.js" className="mb-6" />
      <HomePageBlogs />
    </section>
  );
}
