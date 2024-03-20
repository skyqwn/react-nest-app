import Posts from "./Posts";
import Layout2 from "../components/Layout2";
import CreatePosts from "../components/CreatePosts";

export const Home = () => {
  return (
    <Layout2>
      <div className="flex flex-col p-4 w-full">
        <CreatePosts />
        <Posts />
      </div>
    </Layout2>
  );
};
