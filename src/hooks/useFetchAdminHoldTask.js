import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { GW_URL, adminConfig } from "../config";

export const ADMIN_HOLD_TASK_FETCH_KEY = "admin-hold-task";

const fetchAllHoldTask = (admin_id) => {
  return axios.get(`${GW_URL}/feedback/${admin_id}/getHoldTask`, adminConfig);
};

const useFetchAdminHoldTask = (admin_id) => {
  const { isLoading, isError, data } = useQuery({
    queryKey: [ADMIN_HOLD_TASK_FETCH_KEY, admin_id],
    queryFn: () => fetchAllHoldTask(admin_id),
  });
  return { isLoading, isError, data };
};

export default useFetchAdminHoldTask;
