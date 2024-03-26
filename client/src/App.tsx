import { Toaster } from "react-hot-toast";

import Header from "./components/Header";
import Router from "./Router";
import LoginModal from "./components/modals/LoginModal";

function App() {
  return (
    <div>
      <Header />
      <LoginModal />
      <Toaster position="top-center" />
      <Router />
    </div>
  );
}

export default App;
