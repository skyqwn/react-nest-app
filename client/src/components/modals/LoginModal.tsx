import toast from "react-hot-toast";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { AiOutlineClose } from "react-icons/ai";
import { AnimatePresence, motion } from "framer-motion";
import { Buffer } from "buffer";

import { Input } from "../Input";
import { instance } from "../../api/apiconfig";
import { authStore, useSignupModal } from "../../store/AuthStore";
import { modalContainerVariants, modalItemVariants } from "../../libs/framer";
import Button from "../Button";
import { useContext, useState } from "react";
import { UserContext } from "../../context/UserContext";
import { useLocation, useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const location = useLocation();
  const [loggedIn, setLoggedIn] = useState(true);
  const { auth, onSignin } = useContext(UserContext) as any;
  const { isOpen, onClose } = authStore();

  let from = (location.state?.from as string) || "/";

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
        instance
          .post("/auth/login/email", encodedData, axiosConfig)
          .then((res) => {
            const {
              data: { ok, token, error },
            } = res;
            if (ok) {
              onSignin();
              toast.success("로그인 성공");
              navigate(from);
              onClose();
              reset();
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
            console.log(res);
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
          className="absolute top-0 left-0 w-screen h-screen z-10 bg-black/50 flex items-center justify-center overflow-hidden "
        >
          {/* modal body */}
          <motion.div
            variants={modalItemVariants}
            initial={modalItemVariants.start}
            animate={modalItemVariants.end}
            exit={modalItemVariants.exit}
            className="max-w-xl h-full  sm:h-3/4 bg-white rounded flex flex-col   "
            // className="h-full  w-full sm:h-2/3 sm:w-1/3 md:w-2/3 lg:w-1/3 bg-white rounded flex flex-col "
          >
            {/* modal head */}
            <div className="relative h-16 font-bold text-xl flex justify-end items-center px-4">
              <div
                className="bg-slate-200 p-2 rounded-full absolute items-center justify-center  hover:opacity-50 cursor-pointer"
                onClick={onClose}
              >
                <AiOutlineClose />
              </div>
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
