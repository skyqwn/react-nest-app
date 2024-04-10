import { useMutation, useQuery } from "@tanstack/react-query";
import { useFollowerModal } from "../../store/FollowStore";
import { motion, AnimatePresence } from "framer-motion";
import { instance } from "../../api/apiconfig";
import { IFollowUser } from "../../routes/Alter";
import { IoMdClose } from "react-icons/io";
import { queryClient } from "../..";
import { modalContainerVariants, modalItemVariants } from "../../libs/framer";
import { useAuthState } from "../../context/AuthContext";
import { Link } from "react-router-dom";

interface IFollower {
  email: string;
  id: number;
  isConfirmed: boolean;
  nickname: string;
  avatar: string;
  status: "PENDING" | "CONFIRMED";
  followee: IFollowUser;
}

const FollowerModal = ({ profileId }: { profileId: string }) => {
  const { user } = useAuthState();
  const { isOpen, onClose } = useFollowerModal();

  const followerFetch = async (profileId: string) => {
    const res = await instance.get(`/users/follow/me/${profileId}`);
    return res.data;
  };

  //나를 팔로잉고 있는 사람들
  const { data: myFollowers } = useQuery({
    queryKey: ["my", "follower"],
    queryFn: () => followerFetch(profileId),
  });

  const myFollowerDelete = async (followerId: number) => {
    if (window.confirm("정말 팔로워를 삭제하시겠습니까?")) {
      return await instance.delete(`/users/follow/me/${followerId}`);
    }
  };

  const { mutate: myFollowerDeleteMutation } = useMutation({
    mutationFn: myFollowerDelete,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["my", "follower"],
      });
    },
  });

  if (!myFollowers) return null;

  // 팔로워중리스트를 불러올때도 status 조건이  "CONFIRMED인사라만 리스트로 뿌려줘야함"

  const body = (
    <div className="space-y-5 px-20 flex flex-col">
      {myFollowers.map((f: IFollower) => (
        <div key={f.id}>
          <div className="flex gap-2 items-center justify-between ">
            <div className=" flex items-center justify-center gap-4">
              <Link to={`/profile/${f.followee.id}`}>
                <img
                  className="size-10 rounded-full"
                  src={
                    f.followee?.avatar
                      ? f.followee?.avatar
                      : "/client/public/imgs/user.png"
                  }
                />
              </Link>
              <div>{f.followee?.nickname}</div>
            </div>
            {user?.id === +profileId && (
              <div
                className="bg-neutral-300  p-2 rounded-2xl justify-end cursor-pointer hover:bg-neutral-400 transition"
                onClick={() => {
                  myFollowerDeleteMutation(f.id);
                  ///f.id를 넘겨줘서  팔로워 모델 삭제하고 내 팔로워 카운트 하나 -1  f.follwer .id도 넘겨줘서 상대방 팔로잉 -1
                }}
              >
                삭제
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen ? (
        // modal continaer
        <motion.div
          variants={modalContainerVariants}
          initial={modalContainerVariants.start}
          animate={modalContainerVariants.end}
          exit={modalContainerVariants.exit}
          className="fixed inset-0 flex items-center justify-center z-50 bg-black/50  "
          // className="absolute top-0 left-0 w-screen h-screen z-10 bg-black/50 flex items-center justify-center overflow-hidden "
        >
          {/* modal body */}
          <motion.div
            variants={modalItemVariants}
            initial={modalItemVariants.start}
            animate={modalItemVariants.end}
            exit={modalItemVariants.exit}
            className="h-full  sm:h-2/4 w-full sm:w-2/3 lg:w-1/3 bg-white rounded flex flex-col "
          >
            {/* modal head */}
            <div className="relative h-16 font-bold text-xl flex items-center justify-center">
              <div className="text-center">팔로워</div>
              <div
                className="absolute cursor-pointer  h-full w-16 right-0 flex items-center justify-center hover:opacity-50"
                onClick={onClose}
              >
                <IoMdClose />
              </div>
            </div>
            {/* modal body */}
            <div className="flex-1 px-6">{body}</div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default FollowerModal;
