import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { GW_URL, adminConfig } from "../config";

export const ALL_PERFORMACE_REPORT_KEY = "performance-report-list";

const fetchAllPerformanceReport = (ptm_id, school_id) => {
  return axios.get(
    `${GW_URL}/admin/${ptm_id}/getAllPTMReport?school_id=${school_id}`,
    adminConfig
  );
};

const useFetchAllPerformanceReport = (ptm_id, school_id) => {
  const { isLoading, isError, data } = useQuery({
    queryKey: [ALL_PERFORMACE_REPORT_KEY, ptm_id, school_id],
    queryFn: () => fetchAllPerformanceReport(ptm_id, school_id),
  });
  return { isLoading, isError, data };
};

export default useFetchAllPerformanceReport;
