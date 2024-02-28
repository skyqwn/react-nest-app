import { Toaster } from "react-hot-toast";

import Header from "./components/Header";
import Router from "./Router";

function App() {
  return (
    <div>
      <Header />
      <Toaster position="top-center" />
      <Router />
    </div>
  );
}

export default App;
