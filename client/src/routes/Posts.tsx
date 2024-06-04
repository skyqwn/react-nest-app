import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import qs from "query-string";
import React, { Fragment, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useLocation, useNavigate } from "react-router-dom";

import { instance } from "../api/apiconfig";
import PostBlock from "../components/block/PostBlock";
import { IPost } from "../hooks/usePostDetail";
import { Helmet } from "react-helmet-async";

const Posts = () => {
  const navigate = useNavigate();

  type Props = { pageParam?: number };

  const { search } = useLocation();
  const { term } = qs.parse(search);

  const fetchPosts = async ({ pageParam }: Props) => {
    const parseSerch = qs.parse(search);
    const query = {
      ...parseSerch,
      order__createdAt: "DESC",
      take: 10,
      where__id__more_than: pageParam,
    };
    const url = qs.stringifyUrl({ url: "/posts", query }, { skipNull: true });
    const res = await instance.get(url);
    return res.data;
  };

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
    [_1: string, _2: any],
    number
    //@ts-ignore
  >({
    queryKey: ["posts", term],

    queryFn: fetchPosts,
    initialPageParam: 0,
    staleTime: 60 * 1000,
    gcTime: 300 * 1000,
    getNextPageParam: (lastPage) => {
      return lastPage?.cursor?.after || undefined;
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

  const handlePostClick = (postId: number) => {
    navigate(`/posts/${postId}`);
  };

  if (!posts) return null;

  return (
    <>
      <Helmet>
        <title>Post</title>
      </Helmet>
      {posts?.pages?.map((page, i) => (
        <Fragment key={i}>
          {page?.data?.map((p: IPost) => (
            // <Link to={`/posts/${p.id}`}>
            <div
              key={p.id}
              onClick={() => handlePostClick(p.id)}
              className="cursor-pointer border-b-2  last:border-b-0 py-4 "
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
