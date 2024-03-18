import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { GW_URL, adminConfig } from "../config";
export const ALL_TEACHER_FETCH_KEY = "teacher-list";


const  fetchTeacher=async(school_id)=>
{
    return  await axios.get(`${GW_URL}/schools/${school_id}/teacherListWithTT`, adminConfig)
}
const useFetchTeacher=(school_id)=>{ 
const  {isLoading,isError,data,error}=useQuery({
    queryKey:[ALL_TEACHER_FETCH_KEY,school_id],
    queryFn:()=>fetchTeacher(school_id),
    staleTime:600000,
    enabled:!!school_id
   })
   return {isLoading,isError,data,error}
}
export default useFetchTeacher;

