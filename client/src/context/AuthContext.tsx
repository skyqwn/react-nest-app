import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { instance } from "../api/apiconfig";
import { getCookie } from "../libs/cookie";

export interface User {
  id: number;
  createdAt: string;
  updatedAt: string;
  nickname: string;
  email: string;
  role: string;
  provider: string;
  avatar: string;
}

interface State {
  authenticated: boolean;
  user: User | undefined;
  loading: boolean;
}

interface Action {
  type: string;
  payload: any;
}

const initialState = {
  authenticated: false,
  user: undefined,
  loading: true,
};

const StateContext = createContext<State>(initialState);

const DispatchContext = createContext<any>(null);
const reducer = (state: State, { type, payload }: Action) => {
  switch (type) {
    case "LOGIN":
      return {
        ...state,
        authenticated: true,
        user: payload,
      };
    case "LOGOUT":
      return {
        ...state,
        authenticated: false,
        user: null,
      };
    case "STOP_LOADING":
      return {
        ...state,
        loading: false,
      };
    case "INIT":
      return {
        ...initialState,
        loading: false,
      };
    default:
      throw new Error(`Unknown action type: ${type}`);
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [accessToken, setAccessToken] = useState(getCookie("accessToken"));
  const [state, defaultDispatch] = useReducer(reducer, {
    user: null,
    authenticated: false,
    loading: true,
  });

  const dispatch = (type: string, payload?: any) => {
    defaultDispatch({ type, payload });
  };

  //access토큰이 만료되거나 없을때 refresh토큰이 존재하면 최초로 실행되는곳에서 AuthState에 User정보 저장
  useEffect(() => {
    async function loadRefresh() {
      try {
        const res = await instance.post("/auth/token/access");
        setAccessToken(res.data.accessToken);
        return;
      } catch (error) {
        console.log(error);
      }
    }
    if (getCookie("refreshToken")) {
      loadRefresh();
    }
  }, []);

  useEffect(() => {
    async function loadUser() {
      try {
        if (getCookie("accessToken")) {
          const res = await instance.get("/auth/me");
          dispatch("LOGIN", res.data);
          return;
        }
        return dispatch("INIT");
      } catch (error) {
        console.log(error);
      } finally {
        dispatch("STOP_LOADING");
      }
    }
    loadUser();
  }, [accessToken]);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  );
};

export const useAuthState = () => useContext(StateContext);
export const useAuthDispatch = () => useContext(DispatchContext);
