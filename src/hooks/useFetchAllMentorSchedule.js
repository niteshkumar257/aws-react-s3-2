import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { GW_URL, superAdminConfig } from "../config";

export const ALL_MENTOR_SCHEDULE_KEY = "mentor-schedule-list";

const fetchMentorSchedule = () => {
  return axios.get(`${GW_URL}/allMentorSchedule`, superAdminConfig);
};

const useFetchAllMentorSchedule = () => {
  const { isLoading, isError, data } = useQuery({
    queryKey: [ALL_MENTOR_SCHEDULE_KEY],
    queryFn: () => fetchMentorSchedule(),
  });
  return { isLoading, isError, data };
};

export default useFetchAllMentorSchedule;
