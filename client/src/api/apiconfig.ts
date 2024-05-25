import axios from "axios";
import { getCookie } from "../libs/cookie";
import toast from "react-hot-toast";

export const instance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  withCredentials: true,
});

instance.interceptors.request.use(
  function (config) {
    const token = getCookie("accessToken");

    // 토큰이 있으면 요청 헤더에 추가한다.
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  function (error) {
    // 요청 오류 처리
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  async function (response) {
    return response;
  },
  async function (error) {
    const {
      config,
      response: { status, data },
    } = error;
    if (config.send) {
      return Promise.reject(error);
    }

    if (status === 401 && data.message === "토큰이 없습니다!") {
      // 모든 토큰이 없을경우
      const refreshToken = getCookie("refreshToken");
      if (refreshToken) {
        await instance.post("/auth/token/access");
      }

      config.send = true;
      const originalRequest = config;
      return instance.request(originalRequest);
    }

    if (status === 401 && data.message === "Refresh Token이 아닙니다.") {
      // Refresh토큰은 만료되고 AccessToken만 존재할경우
      toast.error("토큰이 유효하지않습니다 다시로그인해주세요");
      // removeCookie("accessToken");
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);
