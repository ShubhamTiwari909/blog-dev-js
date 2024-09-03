import BlogsFetch from "@/components/BlogsFetch";
import React from "react";
import Loading from "./loading";

export default function App() {
  return (
    <section className="min-h-screen py-20 px-6 lg:px-16">
      <h1>Welcome to BlogDev.js</h1>
      <BlogsFetch className="lg:grid-cols-4" />
    </section>
  );
}
