import { useMutation, useQuery } from "@tanstack/react-query";
import { useFollowerModal, useFollowingModal } from "../../store/FollowStore";
import Modal from "./Modal";
import { instance } from "../../api/apiconfig";
import { queryClient } from "../..";
import { IoMdClose } from "react-icons/io";
import { modalContainerVariants, modalItemVariants } from "../../libs/framer";
import { AnimatePresence, motion } from "framer-motion";
import { useAuthState } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { IFollowUser } from "../../hooks/useFollowers";
interface IFollower {
  email: string;
  id: number;
  isConfirmed: boolean;
  nickname: string;
  avatar: string;
  status: "PENDING" | "CONFIRMED";
  follower: IFollowUser;
}

const FollowingModal = ({ profileId }: { profileId: string }) => {
  const { isOpen, onClose } = useFollowingModal();
  const { user } = useAuthState();

  const followerFetch = async (profileId: string) => {
    const res = await instance.get(`/users/followee/me/${profileId}`);
    return res.data;
  };

  //나를 팔로잉고 있는 사람들
  const { data: myFollowees } = useQuery({
    queryKey: ["my", "following"],
    queryFn: () => followerFetch(profileId),
  });

  const myFollowerDelete = async (followerId: number) => {
    if (window.confirm("정말 팔로워를 삭제하시겠습니까?")) {
      return await instance.delete(`/users/following/me/${followerId}`);
    }
  };

  const { mutate: myFollowerDeleteMutation } = useMutation({
    mutationFn: myFollowerDelete,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["my", "following"],
      });
    },
  });

  if (!myFollowees) return null;

  const body = (
    <div className="space-y-5 px-20 flex flex-col">
      {myFollowees.length > 0
        ? myFollowees.map((f: IFollower) => (
            <div key={f.id}>
              <div className="flex gap-2 items-center justify-between ">
                <div className=" flex items-center justify-center gap-4">
                  <Link to={`/profile/${f.follower.id}`}>
                    <img
                      className="size-10 rounded-full"
                      src={
                        f.follower?.avatar
                          ? f.follower?.avatar
                          : "/client/public/imgs/user.png"
                      }
                    />
                  </Link>
                  <div>{f.follower?.nickname}</div>
                </div>
                {user?.id === +profileId && (
                  <div
                    className="bg-neutral-300  p-2 rounded-2xl justify-end cursor-pointer hover:bg-neutral-400 transition"
                    onClick={() => {
                      myFollowerDeleteMutation(f.id);
                    }}
                  >
                    팔로잉
                  </div>
                )}
              </div>
            </div>
          ))
        : "아직 팔로잉이 없습니다. 많은 친구들을 팔로잉해보세요!"}
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
              <div className="text-center">팔로잉</div>
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

export default FollowingModal;
