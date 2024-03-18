import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { ADMIN, GW_URL, adminConfig } from "../config";
export const ALL_STUDENT_FETCH_KEY = "student-level";

const fetchAllStudent = async (school_id, month, year) => {
  return await axios.get(
    `${GW_URL}/schools/${school_id}/getStudentLevel&month=${month}&year=${year}`,
    adminConfig
  );
};

const useFetchAllStudent = (school_id, month, year) => {
  const { isLoading, isError, data } = useQuery({
    queryKey: [ALL_STUDENT_FETCH_KEY, school_id],
    queryFn: () => fetchAllStudent(school_id),
  });
  return { isLoading, isError, data };
};

export default useFetchAllStudent;
