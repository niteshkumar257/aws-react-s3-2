import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { GW_URL } from "../config";
export const ALL_COURSE_FETCH_KEY = "course-list";
const fetchCourse = async (school_id) => {
  return await axios.get(`${GW_URL}/schools/${school_id}/getCourseId`);
};
export const useFetchCourse = (school_id) => {
  const [isLoading, data, isError, error] = useQuery({
    queryKey: [ALL_COURSE_FETCH_KEY, school_id],
    queryFn: () => fetchCourse(school_id),
  });
  return { isLoading, isError, data, error };
};
