import React from "react";
import { instance } from "../api/apiconfig";
import { useQuery } from "@tanstack/react-query";

interface IFetchFollow {
  avatar: string | null;
  createdAt: string;
  id: number;
  isConfirmed: boolean;
  status: string;
  updatedAt: string;
}

const useFetchFollow = ({ id }: { id: string | undefined }) => {
  const fetchFollowee = async () => {
    const res = await instance.get(`/users/followee/${id}`);
    return res.data;
  };

  const { data: fetchFollow, refetch } = useQuery<IFetchFollow>({
    queryKey: ["user", "followee"],
    queryFn: fetchFollowee,
  });

  return { fetchFollow, refetch };
};

export default useFetchFollow;
