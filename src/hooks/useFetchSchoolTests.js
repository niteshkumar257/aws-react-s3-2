import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { GW_URL, adminConfig } from "../config";
export const ALL_TEST_DETAILS = "all-test-details";

const fetchTest = async (school_id) => {
  return await axios.get(
    `${GW_URL}/schools/${school_id}/getAllTestDetails`,
    adminConfig
  );
};

const useFetchSchoolTest = (school_id) => {
  const { isLoading, isError, data } = useQuery({
    queryKey: [ALL_TEST_DETAILS, school_id],
    queryFn: () => fetchTest(school_id),
    enabled: !!school_id,
  });
  return { isLoading, isError, data };
};

export default useFetchSchoolTest;
