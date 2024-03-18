import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import { GW_URL,adminConfig } from "../config";

export const SCHOOL_SUBJECTS_CLASS="school-subject-class"

function sortSubjectsByCustomOrder(subjects) {
  const customOrder = { 'Nursery': 1, 'KG-1': 2, 'KG-2': 3 };

  const sortedSubjects = [...subjects].sort((a, b) => {
    const orderA = customOrder[a.id] || (parseInt(a.id) ? 9999 : 0);
    const orderB = customOrder[b.id] || (parseInt(b.id) ? 9999 : 0);

    return orderA - orderB;
  });

  return sortedSubjects;
}

const fetchSubjects=async(school_id)=>{
    const response =await axios.get(`${GW_URL}/school/${school_id}/getSchoolSubject`,adminConfig)

       let allRows = [];
        for (const [key, value] of Object.entries(response.data.subjects)) {
          let val = value.subject_name.slice(0, value.subject_name.length - 2);
          allRows.push({ id: key, subject: val });
        }
     let newRows=sortSubjectsByCustomOrder(allRows);
    return newRows;
}

const useGetClassWiseSubjects=(school_id)=>{
    const {isLoading,isError,data,error}=useQuery({
        queryKey:[SCHOOL_SUBJECTS_CLASS,school_id],
        queryFn:()=>fetchSubjects(school_id),
        staleTime:5*60*1000,
        enabled:!!school_id
    })

    return {isLoading,isError,data,error}
}
export default useGetClassWiseSubjects;