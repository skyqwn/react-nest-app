import React from "react";
import { useAuthState } from "../../context/AuthContext";
import { cls } from "../../libs/util";

interface UserAvatarProps {
  big?: boolean;
}

const UserAvatar = ({ big }: UserAvatarProps) => {
  const { user } = useAuthState();

  console.log(user);
  if (!user) return null;
  return (
    <img
      className={cls(
        "rounded-full  relative flex items-center justify-center ",
        big ? "size-40" : "size-10"
      )}
      src={user?.avatar ? user?.avatar : "imgs/user.png"}
    />
  );
};

export default UserAvatar;
