import React, { useContext } from "react";
import { authStore } from "../store/AuthStore";
import { Navigate, useLocation } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import { getCookie } from "../libs/cookie";

const ProtectRouter = ({ children }: React.PropsWithChildren) => {
  const location = useLocation();
  let from = (location.state?.from as string) || "/";
  const { auth } = useContext(UserContext) as any;
  const refreshToken = getCookie("refreshToken");

  if (!auth || !refreshToken) {
    return <Navigate to={"/login"} state={{ from }} />;
  }
  return <div>{children}</div>;
};

export default ProtectRouter;
