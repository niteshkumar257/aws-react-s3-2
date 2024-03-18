import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { GW_URL, adminConfig,classes } from "../config";


const useClassIdsQuery = (school_id) => {
    const { data: classIdData, isLoading: classIdLoading } = useQuery(['class_ids', school_id], async () => {
        const response = await axios.get(`${GW_URL}/schools/${school_id}/getClassId`, adminConfig);
        
        const class_ids = response.data?.class_id || [];
    
        
        // Assuming you have a subjects array in your config
        const mappedData = class_ids.map(classId => {
            const classs = classes.find(c => c.class_id === classId);
            return { class_id: classId, class_name: classs ? classs.class_name : 'Unknown' };
        });
        
        return mappedData;
    }, {
        enabled: !!school_id
    });

    return { data: classIdData, isLoading: classIdLoading };
};

export default useClassIdsQuery;
