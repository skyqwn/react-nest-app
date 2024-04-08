import React, { useEffect } from "react";
import { useAuthState } from "../context/AuthContext";
import { authStore } from "../store/AuthStore";

const UnAuth = () => {
  const { onOpen } = authStore();
  useEffect(() => {
    onOpen();
  }, []);
  return <div className="fixed w-screen h-screen bg-slate-400 z-40"></div>;
};

export default UnAuth;
