import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { GW_URL, adminConfig } from "../config";

export const TEACHER_EACH_CHAPTER_DETAILS = "teacher-each-chapter-details";

export const useFetchTeacherEachChapterDetails = ({
  teacher_id,
  chapter_no,
}) => {
  const { isLoading, isError, data } = useQuery({
    queryKey: [TEACHER_EACH_CHAPTER_DETAILS, teacher_id, chapter_no],
    queryFn: () =>
      axios.get(
        `${GW_URL}/teacher/${teacher_id}/getTeacherChapterProgressDetails?chapter_no=${chapter_no}`,
        adminConfig
      ),
  });
  return { isLoading, isError, data };
};
