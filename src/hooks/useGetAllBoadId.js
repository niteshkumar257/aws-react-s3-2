import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { GW_URL } from "../config";
export const ALL_BOARD_FETCH_KEY = "class-list";
const fetchBoard = async (school_id) => {
  return await axios.get(`${GW_URL}/schools/${school_id}/getBoardId`);
};
const useFetchBoard = (school_id) => {
  const [isLoading, data, isError, error] = useQuery({
    queryKey: [ALL_BOARD_FETCH_KEY, school_id],
    queryFn: () => fetchBoard(school_id),
  });
  return { isLoading, isError, data, error };
};
