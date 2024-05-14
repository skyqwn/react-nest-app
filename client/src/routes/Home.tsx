import Posts from "./Posts";
import Layout from "../components/Layout";
import CreatePosts from "../components/CreatePosts";

export const Home = () => {
  const apiUrl = process.env.REACT_APP_API_URL;

  if (!apiUrl) {
    console.error("REACT_APP_API_URL is not defined!");
  } else {
    console.log("API URL:", apiUrl);
  }
  return (
    <Layout>
      <div className="flex flex-col p-4 w-full">
        <CreatePosts />
        <Posts />
      </div>
    </Layout>
  );
};
