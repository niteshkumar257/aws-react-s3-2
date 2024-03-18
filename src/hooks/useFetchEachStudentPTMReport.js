import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { GW_URL, adminConfig } from "../config";

export const ALL_STUDENT_PTM_REPORT_KEY = "student-ptm-report-list";

const fetchStudentPerformanceReport = (studentId, selectedPTM) => {
  if(studentId===undefined) return ;
  console.log(studentId);
  console.log(`${GW_URL}/student/${studentId}/getPTMReport?ptm_id=${selectedPTM}`);
  return axios.get(
    `${GW_URL}/student/${studentId}/getPTMReport?ptm_id=${selectedPTM}`,
    adminConfig
  );
};

const usefetchStudentPerformanceReport = (studentId, selectedPTM) => {
  const { isLoading, isError, data } = useQuery({
    queryKey: [ALL_STUDENT_PTM_REPORT_KEY, studentId, selectedPTM],
    queryFn: () => fetchStudentPerformanceReport(studentId, selectedPTM),
    enabled:!! studentId
  });
  return { isLoading, isError, data };
};

export default usefetchStudentPerformanceReport;
