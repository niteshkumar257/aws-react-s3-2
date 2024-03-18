import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import { GW_URL,adminConfig,mediums } from "../config";


const mappedMediumData=(mediumList)=>{
    let newMappedmediumlist=[];
for(let md of mediums)
{
    for(let ml of mediumList)
    {
        if(ml===md.medium_name)
        {
            newMappedmediumlist.push(md);
        }
    }
}


return newMappedmediumlist;

}

const useMediumQuery=(school_id)=>{
    return useQuery(['mediumId',school_id],
    async ()=>{
        const res=await axios.get(`${GW_URL}/schools/${school_id}/getMediumId`,adminConfig);
         let medium_list=res?.data?.medium_name

        
       medium_list=mappedMediumData(medium_list);
       
       return medium_list;
    }
    )
}
export default useMediumQuery;