import { createContext, useContext, useEffect, useReducer } from "react";
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

const StateContext = createContext<State>({
  authenticated: false,
  user: undefined,
  loading: true,
});
const acceesToken = getCookie("refreshToken");

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
    default:
      throw new Error(`Unknown action type: ${type}`);
  }
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, defaultDispatch] = useReducer(reducer, {
    user: null,
    authenticated: false,
    loading: true,
  });

  const dispatch = (type: string, payload?: any) => {
    defaultDispatch({ type, payload });
  };

  useEffect(() => {
    instance.post("/auth/token/access");
  }, []);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await instance.get("/auth/me");
        dispatch("LOGIN", res.data);
      } catch (error) {
        console.log(error);
      } finally {
        dispatch("STOP_LOADING");
      }
    }
    loadUser();
  }, [acceesToken]);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  );
};

export const useAuthState = () => useContext(StateContext);
export const useAuthDispatch = () => useContext(DispatchContext);
