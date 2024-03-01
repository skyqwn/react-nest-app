import { Route, Routes } from "react-router-dom";

import NotFound from "./routes/NotFound";
import Home from "./routes/Home";
import Login from "./routes/Login";
import Register from "./routes/Register";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Router;
