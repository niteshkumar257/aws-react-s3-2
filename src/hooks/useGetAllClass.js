import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { GW_URL } from "../config";
export const ALL_CLASS_FETCH_KEY = "class-list";
const fetchClass = async (school_id) => {
  return await axios.get(`${GW_URL}/schools/${school_id}/getClassId`);
};
const useFetchClass = (school_id) => {
  const [isLoading, data, isError, error] = useQuery({
    queryKey: [ALL_CLASS_FETCH_KEY, school_id],
    queryFn: () => fetchClass(school_id),
  });
  return { isLoading, isError, data, error };
};
