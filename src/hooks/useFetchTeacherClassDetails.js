import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { GW_URL, adminConfig } from "../config";
export const ALL_TEACHER_CLASS_DETAILS_FETCH_KEY = "teacher-class-details-list";

const fetchClassDetails = async (teacher_id) => {
  return await axios.get(
    `${GW_URL}/teacher/${teacher_id}/getTeacherMediumAndClass`,
    adminConfig
  );
};
const usefetchClassDetails = (teacher_id) => {
  const { isLoading, isError, data, error } = useQuery({
    queryKey: [ALL_TEACHER_CLASS_DETAILS_FETCH_KEY, teacher_id],
    queryFn: () => fetchClassDetails(teacher_id),
  });
  return { isLoading, isError, data, error };
};
export default usefetchClassDetails;
