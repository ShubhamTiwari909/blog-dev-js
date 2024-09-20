import BlogsFetch from "@/components/BlogsFetch";
import HomePageBlogs from "@/components/HomePageBlogs";
import { DocumentData } from "firebase/firestore";
import React from "react";

export default function App() {

  return (
    <section className="min-h-screen py-10 px-6 lg:px-16">
      <h1 className="text-center text-2xl lg:text-5xl mb-6">
        Welcome to BlogDev.js
      </h1>
      <HomePageBlogs />
    </section>
  );
}
