import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import { Input } from "../components/Input";
import Button from "../components/Button";
import { instance } from "../api/apiconfig";
import { authStore } from "../store/AuthStore";
import { getCookie, setCookie } from "../libs/cookie";
import { Buffer } from "buffer";
import { useContext } from "react";
import { UserContext } from "../context/UserContext";
const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { onLogin, isLogged } = authStore();
  const { auth, onSignin } = useContext(UserContext) as any;

  const isAccessed = getCookie("accessToken");
  let from = (location.state?.from as string) || "/";

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onValid: SubmitHandler<FieldValues> = (data) => {
    const encodedData = Buffer.from(
      data.email + ":" + data.password,
      "utf-8"
    ).toString("base64");

    const axiosConfig = {
      headers: {
        Authorization: `Basic ${encodedData}`,
      },
    };

    try {
      instance
        .post("/auth/login/email", encodedData, axiosConfig)
        .then((res) => {
          const {
            data: { ok, token, error },
          } = res;
          if (ok) {
            const { accessToken, refreshToken } = token;
            onSignin({ accessToken, refreshToken });
            toast.success("로그인 성공");
            navigate(from);
          } else if (!ok) {
            toast.error(error);
          }
        })
        .catch((error) => {
          console.log(error);
        });

      // instance
      //    .post("/auth/login/email", encodedData,axiosConfig)
      //    .then((res) => {
      //      const {
      //       data: { ok, token, error },
      //      } = res;
      //      if (ok) {
      //     onLogin();
      //     toast.success("로그인 성공");
      //     setCookie("accessToken", token.accessToken, {
      //       maxAge: 300,
      //     });
      //     setCookie("refreshToken", token.refreshToken, {
      //       maxAge: 3000,
      //     });
      //   } else if (!ok) {
      //     toast.error(error);
      //   }
      // });
      /////
    } catch (error) {
      console.log(error);
      toast.error("알수없는 에러가 발생하였습니다 다시 시도해주세요.");
    }
  };
  if (auth) {
    return <Navigate to={"/"} />;
  }

  return (
    <div className="mt-20 mx-auto max-w-md space-y-5 flex flex-col">
      <Input name="email" label="이메일" type="email" control={control} />

      <Input
        name="password"
        label="비밀번호"
        type="password"
        control={control}
      />

      <Button
        onAction={handleSubmit(onValid)}
        canClick={true}
        loading={false}
        actionText={"로그인"}
      />
      <Button
        actionText={"아이디가 없으신가요? 회원가입 하러 가기"}
        canClick={true}
        loading={false}
        onAction={() => {
          navigate("/register");
        }}
      />
      {/* <Link to={getGoogleUrl(from)}>
        <Button label="구글로 로그인" theme="tertiary" onAction={() => {}} />
      </Link>
      <Link to={getKakaoUrl(from)}>
        <img src="imgs/kakao_login_medium_narrow.png" />
      </Link>
      <button>카카오톡로그인</button> */}
    </div>
  );
};

export default Login;
