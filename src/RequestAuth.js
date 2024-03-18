import axios from "axios";
import jwt_decode from "jwt-decode";
import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation, useParams } from "react-router-dom";
import { GW_URL, adminConfig } from "./config";
 
const RequestAuth = () => {
    const user = jwt_decode(localStorage.getItem("auth_token")).result;
    const location = useLocation();   
    const {TeacherId, student_id: StudentId} = useParams(); 
    const [containStudentId, setContainStudentId] = useState(false);
    const [containTeacherId, setContainedTeacherId] = useState(false);
    const [loading, setLoading] = useState(false); 
 
    useEffect(() => {
        async function check() { 
            if(TeacherId){
                let data = await axios.get(`${GW_URL}/schools/${user.school_id}/allteacher`, adminConfig);  
                setContainedTeacherId(data.data.teacherDetails.filter((a) => a.id == TeacherId).length > 0);
                setLoading(true);
            }else if(StudentId){
                let data = await axios.get(`${GW_URL}/schools/${user.school_id}/allstudent`, adminConfig)  
               setContainStudentId(data.data.allStudent.filter((a) => a.id == StudentId).length > 0);
               setLoading(true);
            }else{
                setLoading(true);
            }
        }
        check();
    }, []);  

    return (
        loading && (user?.role === "SUPER_ADMIN" ? 
        <Outlet /> 
        : containStudentId ? <Outlet /> : containTeacherId ? <Outlet /> :
        <Navigate to="/unauthorized" state={{ from : location}} replace/>)
    );
}

export default RequestAuth;