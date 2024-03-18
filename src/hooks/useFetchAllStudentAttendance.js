import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { GW_URL, adminConfig } from "../config";

export const useFetchAllStudentAttendance = ({ school_id, date, class_id }) => {
  if (class_id == "Nursery") {
    class_id = -3;
  } else if (class_id == "KG-1") {
    class_id = -2;
  } else if (class_id == "KG-2") {
    class_id = -1;
  } else if (class_id == "ALL") {
    class_id = 13;
  }

  const { isLoading, isError, data } = useQuery({
    queryKey: ["all-student-attendance", date, school_id, class_id],
    queryFn: () =>
      axios.get(
        `${GW_URL}/school/${school_id}/getAllAttendance?attendance_date=${date}&class_id=${class_id}`,
        adminConfig
      ),
  });
  return { isLoading, isError, data };
};
