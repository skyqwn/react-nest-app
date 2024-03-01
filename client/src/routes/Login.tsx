import React, { useContext, useState } from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useQuery } from "@tanstack/react-query";

import { Input } from "../components/Input";
import Button from "../components/Button";
import { instance } from "../api/apiconfig";

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();

  let from = (location.state?.from as string) || "/";
  const {
    handleSubmit,
    control,
    formState: { errors },
    getValues,
  } = useForm<FieldValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginTest = () => {};

  // const {
  //   data: loginData,
  //   isPending,
  //   isError,
  //   error,
  // } = useQuery({
  //   queryKey: ["products"],
  //   queryFn: () => {
  //     const { email, password } = getValues();
  //     instance.post("/auth/login/email", { email, password });
  //   },
  // });
  // console.log(loginData);

  const onValid: SubmitHandler<FieldValues> = (data) => {
    try {
      console.log(data);

      instance
        .post("/auth/login/email", data)
        .then((res) => {
          console.log(res);
          const { data } = res;
          const token = res.data.token;
          instance.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${token.accessToken}`;
          if (data.ok) {
            console.log(data);
            console.log(data.token);
            toast.success("로그인 성공!!");
          }
          if (data.ok === false) {
            console.log(data.error);
            toast.error(data.error);
          }
        })
        .catch((error) => {
          console.log(error);
          toast.error("아이디와 비밀번호를 확인해주세요");
        });
    } catch (error) {
      console.log(error);
    }
    // axios.post("/api/user/signup", data);
    // toast.success("회원가입 성공");
  };

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
