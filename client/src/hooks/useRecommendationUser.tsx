import React from "react";
import { instance } from "../api/apiconfig";
import { useQuery } from "@tanstack/react-query";

interface IRecommendationUser {
  id: number;
  nickname: string;
  avatar: string;
}

const useRecommendationUser = () => {
  const getRecommendationUser = async () => {
    const res = await instance.get("users/recommendation");
    return res.data;
  };

  const { data: recommendationUsers, isLoading: isRecommendationLoading } =
    useQuery<IRecommendationUser[]>({
      queryKey: ["recommendation", "user"],
      queryFn: getRecommendationUser,
    });

  return { recommendationUsers, isRecommendationLoading };
};

export default useRecommendationUser;
