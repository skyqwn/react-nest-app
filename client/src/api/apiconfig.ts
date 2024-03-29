import axios from "axios";
import { getCookie } from "../libs/cookie";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const instance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  withCredentials: true,
});

instance.interceptors.request.use(
  function (config) {
    const token = getCookie("accessToken");

    // if (config.url === "/auth/token/access") {
    //   token = getCookie("refreshToken");
    // } else {
    //   token = ;
    // }

    // 토큰이 있으면 요청 헤더에 추가한다.
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    // if (accessToken) {
    //   config.headers["Authorization"] = `Bearer ${accessToken}`;
    // }
    // Refresh 토큰을 보낼 경우 사용하고자 하는 커스텀 인증 헤더를 사용하면 된다.
    // if (refreshToken) {
    //   config.headers["Authorization"] = `Bearer ${refreshToken}`;
    // }

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

    if (status === 401 && data.message === "토큰이 없습니다.") {
      // 모든 토큰이 없을경우

      instance.post("/auth/token/access");
      // console.log(result);
      // toast.error("토큰이 만료되었습니다 다시 로그인해주세요.");
      // removeCookie("accessToken");
      console.log(error);
      return Promise.reject(error);
    }
    if (status === 401 && data.message === "리프레시 토큰이 만료되었습니다.") {
      // window.location.href = "/login";
      // 모든 토큰이 없을경우
      // const refreshToken = getCookie("refreshToken");
      // const result = await instance.post("/auth/token/access");
      // console.log(result);
      // toast.error("토큰이 만료되었습니다 다시 로그인해주세요.");
      // removeCookie("accessToken");
      return Promise.reject(error);
      console.log(error);
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
