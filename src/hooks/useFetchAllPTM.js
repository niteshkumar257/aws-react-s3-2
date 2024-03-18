import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { GW_URL, adminConfig } from "../config";

export const ALL_PERFORMACE_KEY = "performance-list";

const fetchAllPTM = (school_id) => {
  return axios.get(`${GW_URL}/admin/${school_id}/getAllPTMList`, adminConfig);
};

const usefetchAllPTM = (school_id) => {
  const { isLoading, isError, data } = useQuery({
    queryKey: [ALL_PERFORMACE_KEY, school_id],
    queryFn: () => fetchAllPTM(school_id),
  });
  return { isLoading, isError, data };
};

export default usefetchAllPTM;
