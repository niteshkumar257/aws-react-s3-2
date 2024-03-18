import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import { GW_URL,adminConfig } from "../config";

const useGetClassIdSubjects=(school_id,classs)=>{
    return useQuery(['classId-subjects',school_id,classs],
    async ()=>{
        const response=await   axios
        .get(
          `${GW_URL}/schools/${school_id}/${classs}/getClassSubjects`,
          adminConfig
        )

        return response?.data?.subjects
    },{
        enabled:!!school_id || !!classs
      }
    )
}
export default useGetClassIdSubjects;