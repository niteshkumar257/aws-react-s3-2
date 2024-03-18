import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { GW_URL } from "../config";
export const ALL_MEDIUM_FETCH_KEY = "class-list";
const fetchMedium = async (school_id) => {
  return await axios.get(`${GW_URL}/schools/${school_id}/getMediumId`);
};
const useFetchMedium = (school_id) => {
  const [isLoading, data, isError, error] = useQuery({
    queryKey: [ALL_MEDIUM_FETCH_KEY, school_id],
    queryFn: () => fetchMedium(school_id),
  });
  return { isLoading, isError, data, error };
};
