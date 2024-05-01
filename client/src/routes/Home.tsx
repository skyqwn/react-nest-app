import Posts from "./Posts";
import Layout from "../components/Layout";
import CreatePosts from "../components/CreatePosts";

export const Home = () => {
  return (
    <div className="overflow-y-auto h-screen">
      <Layout>
        <div className="flex flex-col p-4 w-full">
          <CreatePosts />
          <Posts />
        </div>
      </Layout>
    </div>
  );
};
