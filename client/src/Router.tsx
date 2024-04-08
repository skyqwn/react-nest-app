import { Route, Routes, useParams } from "react-router-dom";

import NotFound from "./routes/NotFound";
import ProtectRouter from "./components/ProtectRouter";
import CommunityDetail from "./routes/CommunityDetail";
import Posts from "./routes/Posts";
import Profile from "./routes/Profile";
import Alter from "./routes/Alter";
import Explore from "./routes/Explore";
import { Home } from "./routes/Home";
import PostDetail from "./routes/PostDetail";
import UnAuth from "./routes/UnAuth";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/posts" element={<Posts />} />
      <Route path="/posts/:postId" element={<PostDetail />} />
      <Route
        path="/profile/:id"
        element={
          <ProtectRouter>
            <Profile />
          </ProtectRouter>
        }
      />
      <Route path="/alter" element={<Alter />} />
      <Route path="/unauthorize" element={<UnAuth />} />
      <Route path="/explore" element={<Explore />} />
      <Route path="/post/:id" element={<CommunityDetail />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Router;
