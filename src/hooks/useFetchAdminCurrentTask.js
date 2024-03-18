import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { GW_URL, adminConfig } from "../config";

export const ADMIN_CURRENT_TASK_FETCH_KEY = "admin-current-task";

const fetchAllTask = (admin_id) => {
  return axios.get(
    `${GW_URL}/feedback/${admin_id}/getAdminCurrectDateTask`,
    adminConfig
  );
};

const useFetchAdminCurrentTask = (admin_id) => {
  const { isLoading, isError, data } = useQuery({
    queryKey: [ADMIN_CURRENT_TASK_FETCH_KEY, admin_id],
    queryFn: () => fetchAllTask(admin_id),
  });
  return { isLoading, isError, data };
};

export default useFetchAdminCurrentTask;
