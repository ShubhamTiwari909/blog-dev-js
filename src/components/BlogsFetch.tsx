"use client";
import React, { useEffect } from "react";
import {
  getBlogsFromDb,
  getUserBlogsFromDb,
  getBlogsCountFromServer,
} from "../../server/dbMethods";
import BlogCard from "./Blogs/BlogCard";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import BlogCardSkeleton from "./Blogs/BlogCardSkeleton";
import { DocumentData } from "firebase/firestore";
import { usePathname } from "next/navigation";

const BlogsFetch = ({
  userId,
  className,
}: {
  userId?: string | null;
  className?: string;
}) => {
  const [lastDoc, setLastDoc] = React.useState<DocumentData | undefined>(
    undefined,
  );
  const [totalCount, setTotalCount] = React.useState<number | undefined>(
    undefined,
  );
  const queryClient = useQueryClient();
  const router = usePathname();

  // Reseting the state of the the blogs array
  useEffect(() => {
    return () => {
      queryClient.setQueryData(
        userId ? ["blogs", userId] : ["blogs"],
        queryClient.getQueryState(userId ? ["blogs", userId] : ["blogs"])
          ? {
              pages: [],
              pageParams: [],
            }
          : undefined,
      );
    };
  }, [queryClient, router]);

  const queryInfinite = useInfiniteQuery({
    queryKey: userId ? ["blogs", userId] : ["blogs"],
    queryFn: () =>
      userId
        ? getUserBlogsFromDb(userId, lastDoc)
        : getBlogsFromDb([] as any, lastDoc),
    initialPageParam: undefined,
    getPreviousPageParam: (firstPage) => firstPage.firstVisibleDoc,
    getNextPageParam: (lastPage) => lastPage.lastVisibleDoc,
  });

  useEffect(() => {
    if (queryInfinite.isFetchedAfterMount && queryInfinite.data) {
      setLastDoc(
        queryInfinite?.data.pages[queryInfinite?.data.pages.length - 1 || 0]
          .lastVisibleDoc,
      );
      getBlogsCountFromServer().then((total) => {
        setTotalCount(total);
      });
    }
  }, [queryInfinite.data?.pages]);
  return (
    <div>
      <ul
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 justify-center lg:justify-start ${className}`}
      >
        {queryInfinite?.isPending
          ? [...Array(4)].map((_, i) => <BlogCardSkeleton key={i} />)
          : queryInfinite?.data?.pages?.map((page) => {
              return page.results?.map((blog) => {
                return <BlogCard userId={userId} key={blog.id} blog={blog} />;
              });
            })}
      </ul>
      <div className="text-center">
        <button
          onClick={() => {
            if (totalCount === queryInfinite?.data?.pages[0]?.results?.length)
              return;
            queryInfinite.fetchNextPage();
          }}
          disabled={totalCount === queryInfinite?.data?.pages?.length}
          className={`mt-5 px-5 py-2 rounded-full ${totalCount === queryInfinite?.data?.pages?.length ? "bg-gray-400 text-slate-600" : "bg-indigo-500 text-white"}`}
        >
          {queryInfinite.isFetchingNextPage ? "Loading more..." : "Load More"}
        </button>
      </div>
    </div>
  );
};

export default BlogsFetch;
