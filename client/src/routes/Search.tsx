import { useLocation } from "react-router-dom";
import qs from "query-string";

import Layout from "../components/Layout";
import { useMutation } from "@tanstack/react-query";
import { instance } from "../api/apiconfig";

const Search = () => {
  const { search } = useLocation();
  const { term } = qs.parse(search);

  const searchMutation = async () => {
    // const res = await instance.get()
  };

  const {} = useMutation({
    mutationKey: ["search", term],
    // mutationFn: ()=> {

    // }
  });

  return <Layout>search</Layout>;
};

export default Search;
