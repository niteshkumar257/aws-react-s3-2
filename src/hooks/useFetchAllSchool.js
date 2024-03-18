import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { GW_URL } from "../config";
import { superAdminConfig } from "../config";

export const ALL_SCHOOL_FETCH_KEY = "school-list";

const fetchAllSchool = () => {
  return axios.get(`${GW_URL}/schools`, superAdminConfig);
};

const useFetchAllSchool = () => {
  const { isLoading, isError, data } = useQuery([ALL_SCHOOL_FETCH_KEY], () =>
    fetchAllSchool(),
    {
      staleTime:6000000
    }
  );
  return { isLoading, isError, data };
};

export default useFetchAllSchool;
