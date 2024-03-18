import {useQuery} from "@tanstack/react-query";
import axios from "axios"
import {GW_URL, adminConfig,subjects } from "../config";


const useSubjectIQuery=(school_id)=>{
    const { data: subjectIdData, isLoading: subjectIdLoading } =  useQuery(['subject_ids',school_id],async()=>{
        const response=await axios.get(`${GW_URL}/school/${school_id}/getSubjectIds`,adminConfig); 

        const subject_ids = response.data?.subject_id || [];
       
       
        const mappedData = subject_ids.map(subjectId => {
          const subject = subjects.find(s => s.subject_id === subjectId);
          return { subject_id: subjectId, subject_name: subject ? subject.subject_name : 'Unknown' };
        });
        return mappedData;

    }, {
        enabled: !!school_id
      })

      return { data: subjectIdData, isLoading: subjectIdLoading };

}
export default useSubjectIQuery;