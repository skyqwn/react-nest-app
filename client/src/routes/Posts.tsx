import { InfiniteData, useInfiniteQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroller";

import { instance } from "../api/apiconfig";
import PostBlock from "../components/block/PostBlock";
import Layout from "../components/Layout";

export interface IAuhor {
  id: number;
  createdAt: string;
  updatedAt: string;
  nickname: string;
  email: string;
  role: string;
}

export interface IPost {
  id: number;
  createdAt: string;
  updatedAt: string;
  title: string;
  content: string;
  likeCount: string;
  commentCount: string;
  author: IAuhor;
}

type Props = { pageParam?: number };
const fetchPosts = async ({ pageParam }: Props) => {
  console.log(pageParam);
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

  return (
    <>
      {isFetching && <div className="loading">Loading...</div>}
      <InfiniteScroll
        hasMore={hasNextPage}
        loadMore={() => {
          if (!isFetching) {
            fetchNextPage();
          }
        }}
      >
        {posts?.pages.map((page) => {
          return page.data.map((p: IPost) => {
            return <PostBlock key={p.id} post={p} />;
          });
        })}
      </InfiniteScroll>
    </>
  );
};

export default Posts;
