import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { GW_URL, adminConfig } from "../config";

export const ALL_TEACHER_ATTENDANCE = "all-teacher-attendance";

export const useFetchAllTeacherAttendance = ({ school_id, date }) => {
  const { isLoading, isError, data } = useQuery({
    queryKey: [ALL_TEACHER_ATTENDANCE, date, school_id],
    queryFn: () =>
      axios.get(
        `${GW_URL}/school/${school_id}/getAllTeacherAttendance?attendance_date=${date}`,
        adminConfig
      ),
  });
  return { isLoading, isError, data };
};
