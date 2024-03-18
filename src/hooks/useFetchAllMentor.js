import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { GW_URL, superAdminConfig } from "../config";

export const ALL_MENTOR_KEY = "mentor-list";

const fetchMentor = () => {
  return axios.get(`${GW_URL}/mentors`, superAdminConfig);
};

const useFetchAllMentor = () => {
  return useQuery({
    queryKey: [ALL_MENTOR_KEY],
    queryFn: () => fetchMentor(),
  });
};

export default useFetchAllMentor;
