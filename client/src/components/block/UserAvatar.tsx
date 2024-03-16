import React from "react";
import { useAuthState } from "../../context/AuthContext";
import { cls } from "../../libs/util";

interface UserAvatarProps {
  big?: boolean;
}

const UserAvatar = ({ big }: UserAvatarProps) => {
  const { user } = useAuthState();
  if (!user) return <h3>유저가 존재하지 않음</h3>;
  return (
    <img
      className={cls(
        "rounded-full  relative flex items-center justify-center ",
        big ? "w-40 h-40" : "w-8 h-8"
      )}
      src={user.avatar ? user.avatar : "imgs/user.png"}
    />
  );
};

export default UserAvatar;
