import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { GW_URL, adminConfig } from "../config";

export const ALL_TEACHER_CHAPTER = "all-teacher-chapter";


export const useFetchAllTeacherChapter = ({teacher_id}) => { 
     
    const { isLoading, isError, data } = useQuery({
        queryKey: [ALL_TEACHER_CHAPTER, teacher_id],
        queryFn: () => axios.get(`${GW_URL}/teacher/${teacher_id}/getChapterDetails`, adminConfig),
    });
    return { isLoading, isError, data  };
}

