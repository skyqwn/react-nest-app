import { Toaster } from "react-hot-toast";

import Header from "./components/Header";
import Router from "./Router";
import LoginModal from "./components/modals/LoginModal";
import EditProfileModal from "./components/modals/EditProfileModal";
import EditPostModal from "./components/modals/EditPostModal";

function App() {
  return (
    <>
      <Header />
      <LoginModal />
      <EditProfileModal />
      <Toaster position="top-center" />
      <Router />
    </>
  );
}

export default App;
