import Posts from "./Posts";
import Layout from "../components/Layout";
import CreatePosts from "../components/CreatePosts";
import { Helmet } from "react-helmet-async";

export const Home = () => {
  return (
    <Layout>
      <Helmet>
        <title>Home</title>
      </Helmet>
      <div className="flex flex-col p-4 w-full">
        <CreatePosts />
        <Posts />
      </div>
    </Layout>
  );
};
