import { Toaster } from "react-hot-toast";

import Header from "./components/Header";
import Router from "./Router";
import Layout from "./components/Layout";

function App() {
  return (
    <div>
      <Header />
      <Toaster position="top-center" />
      <Layout>
        <Router />
      </Layout>
    </div>
  );
}

export default App;
