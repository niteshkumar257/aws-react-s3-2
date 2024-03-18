import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { GW_URL, adminConfig } from "../config";


export const ALL_HOLIDAY_KEY = 'curriculum-list';
 
const useFetchAllHoliday = (schoolId) => {
   
    
    return useQuery(
        [ALL_HOLIDAY_KEY , schoolId],
        () => axios.get(`${GW_URL}/getHolidays?school_id=${schoolId}`, adminConfig).
        then(res => res?.data?.holidayList)
    );

};

export default useFetchAllHoliday;
