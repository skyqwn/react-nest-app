import { Navigate, useLocation } from "react-router-dom";
import { useAuthState } from "../context/AuthContext";

const ProtectRouter = ({ children }: React.PropsWithChildren) => {
  const location = useLocation();

  const { loading, authenticated } = useAuthState();

  if (loading) {
    return <>Loading...</>;
  }

  if (!authenticated) {
    return <Navigate to={`/unauthorize?redirect=${location.pathname}`} />;
  }
  return <div>{children}</div>;
};

export default ProtectRouter;
