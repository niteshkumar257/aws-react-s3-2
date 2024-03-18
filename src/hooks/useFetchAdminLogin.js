import {useQuery} from "@tanstack/react-query";
import axios from "axios";
import { GW_URL,adminConfig } from "../config";
export const ALL_ADMIN_LOGIN='all-admin-login-key';
const useFetchAdminLogin=()=>{
    return useQuery(
        [ALL_ADMIN_LOGIN],
        ()=>axios.get(`${GW_URL}/schools/adminsDetails/username`,adminConfig)
        .then(res=>res.data.adminList)
    )
};
export default useFetchAdminLogin;