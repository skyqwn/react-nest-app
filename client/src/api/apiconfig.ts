import axios from "axios";
import { getCookie, setCookie } from "../libs/cookie";

export const instance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  withCredentials: true,
});

instance.interceptors.request.use(
  function (config) {
    // 스토리지에서 토큰을 가져온다.
    const accessToken = getCookie("accessToken");
    const refreshToken = getCookie("refreshToken");

    // 토큰이 있으면 요청 헤더에 추가한다.
    if (accessToken) {
      config.headers["Authorization"] = `Bearer ${accessToken}`;
    }
    // Refresh 토큰을 보낼 경우 사용하고자 하는 커스텀 인증 헤더를 사용하면 된다.
    if (refreshToken) {
      config.headers["Authorization"] = `Bearer ${refreshToken}`;
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

    if (status === 401 && data.message === "InvalidTokenException") {
      // 토큰이 없거나 잘못되었을 경우
      console.log(error);
    }
    if (status === 401 && data.message === "TokenExpired") {
      try {
        const tokenRefreshResult = await instance.post("/refresh-token");
        if (tokenRefreshResult.status === 200) {
          const { accessToken, refreshToken } = tokenRefreshResult.data;
          // 새로 발급받은 토큰을 스토리지에 저장
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);
          // 토큰 갱신 성공. API 재요청
          return instance(config);
        } else {
          console.log(error);
        }
      } catch (e) {
        console.log(error);
      }
    }

    return Promise.reject(error);
  }
);

// instance.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   async (error) => {
//     const {
//       config,
//       response: { status, data },
//     } = error;
//     console.log(status);

//     if (config.sent) {
//       return Promise.reject(error);
//     }

//     // if (
//     //   data.message === CONSTANT.ERROR_MESSAGE.REFRESH_TOKEN
//     //   // data.message === CONSTANT.ERROR_MESSAGE.NO_EXISTS_USER
//     // ) {
//     //   // error.isRefresh = true;
//     //   return Promise.reject(error);
//     // }

//     if (status === 401 || status === 403) {
//       console.log(1);
//       config.sent = true;

//       const originalRequest = config;

//       try {
//         const res = await instance.post("/auth/token/access");

//         instance.defaults.headers.common[
//           "Authorization"
//         ] = `Bearer ${res.data.accessToken}`;

//         originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;

//         setCookie("accessToken", res.data.accessToken, {
//           maxAge: 30,
//         });

//         return instance.request(originalRequest);
//       } catch (error: any) {
//         return Promise.reject(error);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default instance;
