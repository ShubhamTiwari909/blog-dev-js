"use client";
import React, { useEffect } from "react";
import { getBlogsCountFromServer } from "../../../server/dbMethods";
import BlogCard from "../Blogs/BlogCard";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import BlogCardSkeleton from "../Blogs/BlogCardSkeleton";
import { DocumentData, WhereFilterOp } from "firebase/firestore";
import { usePathname } from "next/navigation";
import { BlogSchema } from "@/types/blog";
import { FileHeart } from "lucide-react";
import Link from "next/link";

const BlogsFetch = ({
  userId,
  className,
  qKey,
  queryFunction,
  filter,
  setLastDoc,
}: {
  userId?: string | null;
  className?: string;
  qKey: (string | null)[];
  queryFunction: any;
  filter?: {
    filterName: string;
    operator: WhereFilterOp;
    value: string;
  };
  setLastDoc: React.Dispatch<React.SetStateAction<DocumentData | undefined>>;
}) => {
  const [totalCount, setTotalCount] = React.useState<number | undefined>(
    undefined,
  );
  const queryClient = useQueryClient();
  const router = usePathname();

  // Reseting the state of the the blogs array
  useEffect(() => {
    return () => {
      queryClient.setQueryData(
        [qKey],
        queryClient.getQueryState([qKey])
          ? {
              pages: [],
              pageParams: [],
            }
          : undefined,
      );
    };
  }, [queryClient, router]);

  const queryInfinite = useInfiniteQuery({
    queryKey: [qKey],
    queryFn: () => queryFunction(),
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
      getBlogsCountFromServer(filter).then((total) => {
        setTotalCount(total);
      });
    }
  }, [queryInfinite.data?.pages]);
  return (
    <div className="flex-1">
      <ul
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 justify-center lg:justify-start ${className}`}
      >
        {queryInfinite?.isPending
          ? [...Array(4)].map((_, i) => <BlogCardSkeleton key={i} />)
          : queryInfinite?.data?.pages?.map((page) => {
              return page.results?.map((blog: BlogSchema) => {
                return <BlogCard userId={userId} key={blog.id} blog={blog} />;
              });
            })}
      </ul>
      {queryInfinite?.data?.pages[0]?.results.length ? (
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
      ) : (
        <div className="grid w-full place-items-center min-h-96">
          <div>
            <h1 className="text-center text-yellow-500 text-3xl lg:text-5xl mb-10">
              NO BLOGS FOUND
            </h1>
            {router !== "/profile" ? (
              <div className="flex flex-wrap justify-center gap-6 items-center">
                <FileHeart size="5rem" className="text-yellow-500" />
                <Link
                  href="/"
                  className="text-yellow-500 bg-slate-900 rounded-2xl px-5 py-2.5"
                >
                  Back to Homepage
                </Link>
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogsFetch;
