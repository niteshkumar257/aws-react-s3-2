import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { GW_URL, adminConfig } from "../config";

export const ALL_CURRICULUM_KEY = "curriculum-list";

const fetchCurriculum = (school_id) => {
  return axios.get(
    `${GW_URL}/getCurriculum?school_id=${school_id}`,
    adminConfig
  );
};

const useFetchAllCurriculum = (school_id) => {
  return useQuery({
    queryKey: [ALL_CURRICULUM_KEY, school_id],
    queryFn: () => fetchCurriculum(school_id),
  });
};

export default useFetchAllCurriculum;
