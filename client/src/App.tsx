import { Toaster } from "react-hot-toast";

import Header from "./components/Header";
import Router from "./Router";
import LoginModal from "./components/modals/LoginModal";
import EditProfileModal from "./components/modals/EditProfileModal";

function App() {
  console.log(process.env.REACT_APP_BASE_URL);
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
