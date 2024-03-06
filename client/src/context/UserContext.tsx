import React, {
  PropsWithChildren,
  createContext,
  useEffect,
  useState,
} from "react";

import { getCookie, removeCookie } from "../libs/cookie";
import { instance } from "../api/apiconfig";

export const UserContext = createContext({});

export const UserContextProvider = ({ children }: PropsWithChildren) => {
  const [auth, setAuth] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    instance
      .post("/auth/token/access")
      .then((res) => {
        setAuth(true);
      })
      .catch((err) => {
        console.log(err.response);
        // toast.error("토큰이 만료되었습니다 다시 로그인을 하시기 바랍니다.");
        setAuth(false);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const onSignin = () => {
    setAuth(true);

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
