import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { GW_URL, adminConfig, classes } from "../config";

const useTeacherClassIdsQuery = (teacher_id) => {
  const { data: classIdData, isLoading: classIdLoading } = useQuery(
    ["class_ids", teacher_id],
    async () => {
      const response = await axios.get(
        `${GW_URL}/teacher/${teacher_id}/getAllClassIds`,
        adminConfig
      );

      const class_ids = response.data?.classIdList.class_ids || [];
      console.log(class_ids);

      // Assuming you have a subjects array in your config
      const mappedData = class_ids.map((classId) => {
        const classs = classes.find((c) => c.class_id === classId);
        return {
          class_id: classId,
          class_name: classs ? classs.class_name : "Unknown",
        };
      });

      return mappedData;
    },
    {
      enabled: !!teacher_id,
    }
  );

  return { data: classIdData, isLoading: classIdLoading };
};
export default useTeacherClassIdsQuery;
