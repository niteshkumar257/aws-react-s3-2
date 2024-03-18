import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { GW_URL, superAdminConfig } from "../config";

export const MENTOR_KEY = "mentor";

const fetchMentor = (mentor_id) => {
  return axios.get(
    `${GW_URL}/mentor/${mentor_id}/getDetails`,
    superAdminConfig
  );
};

const useFetchMentor = (mentor_id) => {
  return useQuery({
    queryKey: [MENTOR_KEY, mentor_id],
    queryFn: () => fetchMentor(mentor_id),
  });
};

export default useFetchMentor;
