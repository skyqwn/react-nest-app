import React from "react";
import Layout from "../components/Layout";
import { instance } from "../api/apiconfig";
import { useMutation, useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { queryClient } from "..";
import useFollowers from "../hooks/useFollowers";

const Alter = () => {
  const { refetch, requsetFollower } = useFollowers();

  const confirmFollower = async (id: number) => {
    await instance.patch(`/users/follow/${id}`);
  };

  const { mutate } = useMutation({
    mutationFn: confirmFollower,
    onSuccess: () => {
      toast.success("팔로우 승낙");
      refetch();
    },
  });

  const deleteFollowHandler = async (id: number) => {
    await instance.delete(`/users/follow/${id}`);
  };

  const { mutate: deleteFollowMutate } = useMutation({
    mutationFn: deleteFollowHandler,
    onSuccess: () => {
      refetch();
      toast.success("팔로우 거절");
      queryClient.invalidateQueries({
        queryKey: ["followee", "me"],
      });
    },
  });

  return (
    <Layout>
      <div className="flex flex-col gap-6 p-3">
        <h2>팔로우 요청</h2>
        {requsetFollower?.map((follow, i: number) => (
          <div key={i} className="flex gap-4 mt-2 justify-between">
            <>
              <div className="flex items-center gap-2">
                <img
                  className="size-10 rounded-full"
                  src={follow.followee?.avatar}
                />
                <span>{follow.followee?.nickname}</span>
              </div>
              <div className="flex gap-2">
                {follow.status === "PENDING" ? (
                  <>
                    <button
                      onClick={() => {
                        mutate(follow.id);
                      }}
                      className="bg-orange-500 w-14 h-10 rounded-2xl text-white hover:bg-orange-600 transition"
                    >
                      확인
                    </button>
                    <button
                      onClick={() => {
                        deleteFollowMutate(follow.followee.id);
                      }}
                      className="bg-neutral-200 w-14 h-10 rounded-2xl hover:bg-neutral-300 transition"
                    >
                      삭제
                    </button>
                  </>
                ) : (
                  "취소"
                )}
              </div>
            </>
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default Alter;
