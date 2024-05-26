import React from "react";
import { useAuthState } from "../../context/AuthContext";
import { cls } from "../../libs/util";

interface UserAvatarProps {
  big?: boolean;
  small?: boolean;
}

const UserAvatar = ({ big, small }: UserAvatarProps) => {
  const { user } = useAuthState();

  if (!user) return null;
  return (
    <img
      className={cls(
        "rounded-full  relative flex items-center justify-center size-6 md:size-10",
        big ? "size-40" : "size-10"
      )}
      src={user?.avatar ? user?.avatar : "imgs/user.png"}
    />
  );
};

export default UserAvatar;
