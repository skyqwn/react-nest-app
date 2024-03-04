import { Route, Routes } from "react-router-dom";

import NotFound from "./routes/NotFound";
import Home from "./routes/Home";
import Login from "./routes/Login";
import Register from "./routes/Register";
import ProtectRouter from "./components/ProtectRouter";
import Profile from "./routes/Profile";
import Community from "./routes/Community";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route
        path="/profile"
        element={
          <ProtectRouter>
            <Profile />
          </ProtectRouter>
        }
      />
      <Route path="/register" element={<Register />} />
      <Route
        path="/post"
        element={
          <ProtectRouter>
            <Community />
          </ProtectRouter>
        }
      />

      <Route path="/login" element={<Login />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Router;
