import React, { useContext, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

import axios from "axios";
import { Input } from "../components/Input";
import Button from "../components/Button";
import { instance } from "../api/apiconfig";

const Auth = () => {
  // const errorHandler = userErrorHandler();
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(true);
  // const { auth, onSignin } = useContext(UserContext) as UserContextTypes;
  const navigate = useNavigate();

  let from = (location.state?.from as string) || "/";
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      email: "",
      nickname: "",
      password: "",
      verifyPassword: "",
    },
  });

  const onValid: SubmitHandler<FieldValues> = (data) => {
    if (isLogin) {
      console.log(data);
      // axios
      //   .post("/api/user/signin", data)
      //   .then((res) => {
      //     const { data } = res;
      //     toast.success("로그인 성공!!");
      //     navigate(from);
      //   })
      //   .catch((error) => {
      //     console.log(error);
      //   });
    } else {
      console.log(data);
      try {
        instance
          .post("/auth/register/email", data)
          .then((res) => {
            console.log(res);
            const { data } = res;
            if (data.ok) {
              toast.success("로그인 성공!!");
              setIsLogin(true);
            }
            if (!data.ok) {
              toast.error(data.error);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (error) {
        console.log(error);
      }
      // axios.post("/api/user/signup", data);
      // toast.success("회원가입 성공");
    }
  };

  return (
    <div className="mt-20 mx-auto max-w-md space-y-5 flex flex-col">
      <Input name="email" label="이메일" type="email" control={control} />
      {!isLogin && (
        <Input name="nickname" label="닉네임" type="text" control={control} />
      )}
      <Input
        name="password"
        label="비밀번호"
        type="password"
        control={control}
      />
      {!isLogin && (
        <Input
          name="verifyPassword"
          label="비밀번호 확인"
          type="password"
          control={control}
        />
      )}
      <Button
        onAction={handleSubmit(onValid)}
        canClick={true}
        loading={false}
        actionText={!isLogin ? "회원가입" : "로그인"}
      />
      <Button
        onAction={() => {
          setIsLogin((prev) => !prev);
        }}
        actionText={
          !isLogin
            ? "아이디가 있으신가요? 로그인 하러 가기"
            : "아이디가 없으신가요? 회원가입 하러 가기  "
        }
        canClick={true}
        loading={false}
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

export default Auth;
