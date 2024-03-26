import Posts from "./Posts";
import Layout from "../components/Layout";
import CreatePosts from "../components/CreatePosts";
import PostDetail from "./PostDetail";

export const Home = () => {
  return (
    <Layout>
      <div className="flex flex-col p-4 w-full">
        <CreatePosts />
        <Posts />
      </div>
    </Layout>
  );
};
