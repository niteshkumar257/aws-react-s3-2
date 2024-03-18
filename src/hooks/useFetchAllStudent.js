import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { ADMIN, GW_URL, adminConfig } from "../config";
export const ALL_STUDENT_FETCH_KEY = "student-list";

const fetchAllStudent = async (school_id) => {
  return await axios.get(
    `${GW_URL}/schools/${school_id}/allstudent`,
    adminConfig
  );
};

const useFetchAllStudent = (school_id) => {
  const { isLoading, isError, data } = useQuery({
    queryKey: [ALL_STUDENT_FETCH_KEY, school_id],
    queryFn: () => fetchAllStudent(school_id),
  });
  return { isLoading, isError, data };
};

export default useFetchAllStudent;
