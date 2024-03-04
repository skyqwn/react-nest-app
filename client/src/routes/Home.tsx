import React, { useContext } from "react";
import Container from "../components/Container";
import { authStore } from "../store/AuthStore";
import { getCookie, setCookie } from "../libs/cookie";
import { instance } from "../api/apiconfig";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Home = () => {
  const { onSignout, auth } = useContext(UserContext) as any;
  console.log(auth);
  const navigate = useNavigate();
  return (
    <Container>
      <h1>홈입니다</h1>
      <button
        className="m-10"
        onClick={() => {
          onSignout();
          navigate("/");
          toast.success("로그아웃");
        }}
      >
        로그아웃
      </button>
    </Container>
  );
};

export default Home;
