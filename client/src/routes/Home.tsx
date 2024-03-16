import { useContext } from "react";
import { useNavigate } from "react-router-dom";

import Container from "../components/Container";
import { UserContext } from "../context/UserContext";
import LoginModal from "../components/modals/LoginModal";

const Home = () => {
  const { onSignout, auth } = useContext(UserContext) as any;
  const navigate = useNavigate();
  return (
    <Container>
      <LoginModal />
    </Container>
  );
};

export default Home;
