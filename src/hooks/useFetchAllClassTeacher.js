import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { GW_URL, adminConfig } from "../config";

export const ALL_CLASS_TEACHER = "all-class-teacher";

const fetchAllClassTeacher = (school_id) => {
  return axios.get(
    `${GW_URL}/schools/${school_id}/getAllClassTeacher`,
    adminConfig
  );
};

const useFetchAllClassTeacher = (school_id) => {
  const { isLoading, isError, data } = useQuery({
    queryKey: [ALL_CLASS_TEACHER],
    queryFn: () => fetchAllClassTeacher(school_id),
  });
  return { isLoading, isError, data };
};

export default useFetchAllClassTeacher;
