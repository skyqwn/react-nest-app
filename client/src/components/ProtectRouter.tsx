import React, { useContext } from "react";
import { authStore } from "../store/AuthStore";
import { useLocation } from "react-router-dom";
import { getCookie } from "../libs/cookie";
import { useAuthState } from "../context/AuthContext";

const ProtectRouter = ({ children }: React.PropsWithChildren) => {
  const location = useLocation();
  let from = (location.state?.from as string) || "/";
  // const { auth, loading } = useContext(UserContext) as any;
  const { loading, authenticated } = useAuthState();
  const refreshToken = getCookie("refreshToken");

  console.log(authenticated);
  const { onOpen } = authStore();

  if (loading) {
    return <>Loading...</>;
  }

  if (!authenticated) {
    onOpen();
    <h1>error</h1>;
  }
  return <div>{children}</div>;
};

export default ProtectRouter;
