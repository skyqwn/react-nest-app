import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { AiOutlineClose } from "react-icons/ai";
import { AnimatePresence, motion } from "framer-motion";
import { Buffer } from "buffer";
import { FcGoogle } from "react-icons/fc";

import { Input } from "../Input";
import { instance } from "../../api/apiconfig";
import { authStore } from "../../store/AuthStore";
import { modalContainerVariants, modalItemVariants } from "../../libs/framer";
import Button from "../buttons/Button";
import {
  Link,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useAuthDispatch } from "../../context/AuthContext";

const LoginModal = () => {
  const {
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const location = useLocation();
  const navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(true);
  const { isOpen, onClose } = authStore();
  const dispatch = useAuthDispatch();
  const [searchParams] = useSearchParams();

  const [scrollPosition, setScrollPosition] = useState(0);
  const fixPage = useMemo(() => {
    if (location.pathname === "/unauthorize") {
      return { ok: true, redirect: searchParams.get("redirect") || "/" };
    }
    return { ok: false, redirect: "/" };
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // 모달의 위치 계산
  // const top = `calc( ${scrollPosition}px)`;
  const top = scrollPosition + "px";

  const onValid: SubmitHandler<FieldValues> = async (data) => {
    if (loggedIn) {
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
        await instance
          .post("/auth/login/email", encodedData, axiosConfig)
          .then((res) => {
            const {
              data: { ok, user, error },
            } = res;
            if (ok) {
              // onSignin();
              dispatch("LOGIN", user);
              toast.success("로그인 성공");
              onClose();
              reset();
              navigate(fixPage.redirect);
            } else if (!ok) {
              toast.error(error);
            }
          })
          .catch((error) => {
            console.log(error);
          });
      } catch (error) {
        console.log(error);
        toast.error("알수없는 에러가 발생하였습니다 다시 시도해주세요.");
      }
    } else {
      try {
        instance
          .post("/auth/register/email", data)
          .then((res) => {
            const { data } = res;
            if (data.ok) {
              toast.success("회원가입 성공!!");
              setLoggedIn(true);
              reset();
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
    }
  };

  const loginBody = (
    <div className="space-y-5 px-20 flex flex-col">
      <div className="font-bold text-2xl">로그인</div>
      <span className="text-sm">
        귀하는 계속 진행함으로써 당사의 사용자 계약에{" "}
        <span className="text-blue-400">동의</span>하고 귀하가{" "}
        <span className="text-blue-400">개인 정보 보호</span>
        정책을 이해했음을 인정합니다.
      </span>

      <Link to={`${process.env.REACT_APP_GOOGEL_URL}`}>
        <div className="w-full h-10 flex items-center justify-center border-2 rounded-2xl gap-2">
          <FcGoogle className="text-3xl" />
          <span className="font-semibold">구글로그인</span>
        </div>
      </Link>

      <div className="relative">
        <div className="absolute w-full border-t border-gray-300" />
        <div className="relative -top-3 text-center ">
          <span className="bg-white px-2 text-sm text-gray-500">OR</span>
        </div>
      </div>
      <Input name="email" control={control} label="이메일" />
      <Input
        name="password"
        type="password"
        control={control}
        label="비밀번호"
      />
      <span className="text-sm">
        아이디가 없으신가요?{" "}
        <span
          className="text-blue-400 cursor-pointer"
          onClick={() => setLoggedIn(false)}
        >
          회원가입
        </span>{" "}
        하러 가기
      </span>
      <Button
        actionText="로그인"
        onAction={handleSubmit(onValid)}
        canClick={true}
      />
    </div>
  );

  const signupBody = (
    <div className="space-y-5 px-20 flex flex-col">
      <div className="font-bold text-2xl">회원가입</div>
      <span className="text-sm">
        귀하는 계속 진행함으로써 당사의 사용자 계약에{" "}
        <span className="text-blue-400">동의</span>하고 귀하가{" "}
        <span className="text-blue-400">개인 정보 보호</span>
        정책을 이해했음을 인정합니다.
      </span>
      <div className="relative">
        <div className="absolute w-full border-t border-gray-300" />
        <div className="relative -top-3 text-center ">
          <span className="bg-white px-2 text-sm text-gray-500">OR</span>
        </div>
      </div>
      <Input name="email" label="이메일" type="email" control={control} />
      <Input name="nickname" label="닉네임" type="text" control={control} />
      <Input
        name="password"
        label="비밀번호"
        type="password"
        control={control}
      />
      <Input
        name="verifyPassword"
        label="비밀번호 확인"
        type="password"
        control={control}
      />
      <Button
        onAction={handleSubmit(onValid)}
        canClick={true}
        loading={false}
        actionText={"회원가입"}
      />

      <span className="text-sm">
        이미 아이디가 있으신가요?{" "}
        <span
          className="text-blue-400 cursor-pointer"
          onClick={() => setLoggedIn(true)}
        >
          로그인
        </span>{" "}
        하러 가기
      </span>
    </div>
  );

  return (
    <AnimatePresence>
      {isOpen ? ( // modal continaer
        <motion.div
          variants={modalContainerVariants}
          initial={modalContainerVariants.start}
          animate={modalContainerVariants.end}
          exit={modalContainerVariants.exit}
          style={{ top }}
          // onClick={onClose}
          className="absolute top-0 left-0 w-screen h-screen z-50 bg-black/50 flex items-center justify-center overflow-hidden"
        >
          {/* modal body */}
          <motion.div
            variants={modalItemVariants}
            initial={modalItemVariants.start}
            animate={modalItemVariants.end}
            exit={modalItemVariants.exit}
            className="max-w-xl h-full  sm:h-3/4 bg-white rounded flex flex-col"
            onClick={(event) => event.stopPropagation()}
            // className="h-full  w-full sm:h-2/3 sm:w-1/3 md:w-2/3 lg:w-1/3 bg-white rounded flex flex-col "
          >
            {/* modal head */}
            <div className="relative h-16 font-bold text-xl flex justify-end items-center px-4">
              {!fixPage.ok && (
                <div
                  className="bg-slate-200 p-2 rounded-full absolute items-center justify-center  hover:opacity-50 cursor-pointer"
                  onClick={onClose}
                >
                  <AiOutlineClose />
                </div>
              )}
            </div>
            {/* modal body */}
            {/* <div className="flex-1 px-6">{body}</div> */}
            <div className="flex-1 px-6">
              {loggedIn ? loginBody : signupBody}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
};

export default LoginModal;
