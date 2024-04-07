import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";

import { instance } from "../api/apiconfig";
import PostBlock from "../components/block/PostBlock";
import { useInView } from "react-intersection-observer";
import { Fragment, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IPost } from "../types/PostsTypes";
import PostActionBlock from "../components/block/PostActionBlock";
import React from "react";

type Props = { pageParam?: number };
const fetchPosts = async ({ pageParam }: Props) => {
  const res = await instance.get(
    `/posts?order__createdAt=ASC&take=10&where__id__more_than=${pageParam}`
  );
  return res.data;
};

const Posts = () => {
  const {
    data: posts,
    hasNextPage,
    fetchNextPage,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
  } = useInfiniteQuery<
    any,
    Object,
    InfiniteData<any>,
    [_1: string],
    number
    //@ts-ignore
  >({
    queryKey: ["posts"],
    queryFn: fetchPosts,
    initialPageParam: 0,
    staleTime: 60 * 1000,
    gcTime: 300 * 1000,
    getNextPageParam: (lastPage) => {
      return lastPage.cursor.after || undefined;
    },
  });
  const { ref, inView } = useInView({
    threshold: 0,
    delay: 0,
  });

  useEffect(() => {
    if (inView) {
      !isFetching && hasNextPage && fetchNextPage();
    }
  }, [inView, isFetching, hasNextPage, fetchNextPage]);
  const navigate = useNavigate();

  const handlePostClick = (postId: number) => {
    navigate(`/posts/${postId}`);
  };

  if (!posts) return null;

  return (
    <>
      {posts?.pages.map((page, i) => (
        <Fragment key={i}>
          {page?.data.map((p: IPost) => (
            // <Link to={`/posts/${p.id}`}>
            <div
              key={p.id}
              onClick={() => handlePostClick(p.id)}
              className="cursor-pointer"
            >
              <PostBlock key={p.id} post={p} refetch={refetch} />
            </div>
            // </Link>
          ))}
        </Fragment>
      ))}
      <div ref={ref} style={{ height: 50 }} />
    </>
  );
};

export default React.memo(Posts);
