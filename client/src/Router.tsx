import { Route, Routes } from "react-router-dom";

import NotFound from "./routes/NotFound";
import ProtectRouter from "./components/ProtectRouter";
import CommunityDetail from "./routes/CommunityDetail";
import Posts from "./routes/Posts";
import Profile from "./routes/Profile";
import Message from "./routes/Message";
import Explore from "./routes/Explore";
import { Home } from "./routes/Home";

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
      <Route path="/posts" element={<Posts />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/messages" element={<Message />} />
      <Route path="/explore" element={<Explore />} />
      {/* <Route
        path="/post"
        element={
          <ProtectRouter>
            <Community />
          </ProtectRouter>
        }
      /> */}
      <Route path="/post/:id" element={<CommunityDetail />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Router;
