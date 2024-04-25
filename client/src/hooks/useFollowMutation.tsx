import { useMutation } from "@tanstack/react-query";
import { instance } from "../api/apiconfig";
import toast from "react-hot-toast";

interface FollowMutationProps {
  id: string | undefined;
  refetch: () => void;
}

const useFollowMutation = ({ id, refetch }: FollowMutationProps) => {
  const handleFollowing = async (id: string) => {
    const res = await instance.post(`/users/follow/${id}`);
    return res.data;
  };

  const { mutate: followMutation } = useMutation({
    mutationFn: handleFollowing,
    onSuccess: () => {
      toast.success("팔로우 요청을 하였습니다.");
      refetch();
    },
  });

  return { followMutation };
};

export default useFollowMutation;
