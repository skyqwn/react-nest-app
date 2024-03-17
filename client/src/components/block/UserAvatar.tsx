import React from "react";
import { useAuthState } from "../../context/AuthContext";
import { cls } from "../../libs/util";

interface UserAvatarProps {
  big?: boolean;
}

const UserAvatar = ({ big }: UserAvatarProps) => {
  const { user, loading } = useAuthState();
  if (!user) return <h3>Loding...</h3>;
  return (
    <img
      className={cls(
        "rounded-full  relative flex items-center justify-center ",
        big ? "size-40" : "size-8"
      )}
      src={user.avatar ? user.avatar : "imgs/user.png"}
    />
  );
};

export default UserAvatar;
