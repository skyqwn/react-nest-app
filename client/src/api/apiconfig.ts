import axios from "axios";

export const instance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  withCredentials: true,
});

// instance.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   async (error) => {
//     const {
//       config,
//       response: { status, data },
//     } = error;

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
//       config.sent = true;

//       const originalRequest = config;

//       try {
//         const res = await instance.post("/api/user/refresh");

//         instance.defaults.headers.common[
//           "Authorization"
//         ] = `Bearer ${res.data.accessToken}`;

//         originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;

//         return instance.request(originalRequest);
//       } catch (error: any) {
//         return Promise.reject(error);
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default instance;
