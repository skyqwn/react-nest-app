import Posts from "./Posts";
import Layout from "../components/Layout";
import CreatePosts from "../components/CreatePosts";

export const Home = () => {
  console.log(process.env.REACT_APP_GOOGLE_URL);
  return (
    <Layout>
      <div className="flex flex-col p-4 w-full">
        <CreatePosts />
        <Posts />
      </div>
    </Layout>
  );
};
