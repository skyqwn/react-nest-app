import { Route, Routes } from "react-router-dom";

import Auth from "./routes/Auth";
import NotFound from "./routes/NotFound";
import Home from "./routes/Home";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Router;
