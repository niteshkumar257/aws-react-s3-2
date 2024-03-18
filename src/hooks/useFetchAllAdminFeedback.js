import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { GW_URL, adminConfig } from "../config";

export const ALL_ADMIN_FEEDBACK_FETCH_KEY = "all-admin-feedback";

const fetchAllFeedback = () => {
  return axios.get(`${GW_URL}/feedback/getAllTask`, adminConfig);
};

const useFetchAllAdminFeedback = () => {
  const { isLoading, isError, data } = useQuery({
    queryKey: [ALL_ADMIN_FEEDBACK_FETCH_KEY],
    queryFn: fetchAllFeedback,
  });
  return { isLoading, isError, data };
};

export default useFetchAllAdminFeedback;
