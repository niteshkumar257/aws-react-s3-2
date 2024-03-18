import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { GW_URL, adminConfig } from "../config";
export const ALL_ADMIN_TICKET_ISSUE = "admin-issue-list";

const fetchAdminIssue = async (school_id, created_on, status) => {
  return await axios.get(
    `${GW_URL}/schools/${school_id}/allteacher`,
    adminConfig
  );
};
const useFetchAdminIssue = (school_id, created_on, status) => {
  const { isLoading, isError, data, error } = useQuery({
    queryKey: [ALL_ADMIN_TICKET_ISSUE, school_id, created_on],
    queryFn: () => fetchAdminIssue(school_id, created_on, status),
  });
  return { isLoading, isError, data, error };
};
export default useFetchTeacher;
