import React, {
  PropsWithChildren,
  createContext,
  useEffect,
  useState,
} from "react";

import { removeCookie, setCookie } from "../libs/cookie";
import { instance } from "../api/apiconfig";

export const UserContext = createContext({});

export const UserContextProvider = ({ children }: PropsWithChildren) => {
  const [auth, setAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    instance
      .post("/auth/token/access")
      .then((res) => {
        const {
          data: { accessToken },
        } = res;
        setCookie("accessToken", accessToken, { maxAge: 30 });
        setAuth(true);
      })
      .catch((err) => {
        console.log(err);
        setAuth(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const onSignin = ({
    accessToken,
    refreshToken,
  }: {
    accessToken: any;
    refreshToken: any;
  }) => {
    if (accessToken) {
      setCookie("accessToken", accessToken, {
        maxAge: 30,
      });
      setCookie("refreshToken", refreshToken, {
        maxAge: 3000,
      });
      setAuth(true);
    }
    return;
  };

  const onSignout = async () => {
    instance.defaults.headers.common["Authorization"] = "";
    removeCookie("accessToken", { maxAge: 0 });
    removeCookie("refreshToken", { maxAge: 0 });
    setAuth(false);
  };

  const value = React.useMemo(() => {
    return { auth, onSignin, onSignout, loading };
  }, [auth, onSignin, onSignout, loading]);

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
