import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import { GW_URL,adminConfig,subjects } from "../config";

const useTeacherSubjectIdQuery=(teacher_id)=>{
    const { data: subjectIdData, isLoading: subjectIdLoading } =  useQuery(['subject_ids',teacher_id],async()=>{
        const response=await axios.get(`${GW_URL}/teacher/${teacher_id}/getAllSubjectIds`,adminConfig); 

        console.log(response)
        const subject_ids = response.data?.subjectIdsList.subject_id || [];
       
       
        const mappedData = subject_ids.map(subjectId => {
          const subject = subjects.find(s => s.subject_id === subjectId);
          return { subject_id: subjectId, subject_name: subject ? subject.subject_name : 'Unknown' };
        });
        return mappedData;

    }, {
        enabled: !!teacher_id
      })

      return { data: subjectIdData, isLoading: subjectIdLoading };
}

export default useTeacherSubjectIdQuery;