import { useEffect, useState } from "react";
import { FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import jwt_decode from "jwt-decode";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./ClassTeacher.scss"; 
import useFetchTeacher from "../../hooks/useFetchTeacher";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GW_URL, adminConfig, allStreams } from "../../config";
import Loader from "../../components/Loader/Loader";
import DataGridWithTooltip from '../../components/DataGrid/DataGridWithToolTrip';
import useFetchAllClassTeacher, { ALL_CLASS_TEACHER } from "../../hooks/useFetchAllClassTeacher"; 

const columns = [
    { field: 'id', headerName: 'S No.', width: 50, flex: 1, editable: false, headerAlign: "left", align: "left", },
    { field: 'class_id', headerName: 'Class Id', width: 50, hide: true, flex: 1, editable: false, headerAlign: "left", align: "left", },
    { field: 'teacher_id', headerName: 'Teacher Id', width: 50, hide: true, flex: 1, editable: false, headerAlign: "left", align: "left", },
    {
        field: 'teacher_name', flex: 1, headerName: 'Teacher Name', width: 200, editable: false, headerAlign: "center", align: "center",
    },
    { field: 'class_name', headerName: 'Class', width: 50, flex: 1, editable: false, headerAlign: "center", align: "center" },
    { field: 'stream', headerName: 'Stream', width: 50, flex: 1, editable: false, headerAlign: "center", align: "center" },
    { field: 'medium', headerName: 'Medium', width: 50, flex: 1, editable: false, headerAlign: "center", align: "center" },
    { field: 'section', headerName: 'Section', width: 50, flex: 1, editable: false, headerAlign: "center", align: "center" },
];

const addClassTeacher = ({ school_id, medium, class_id, teacher_id, section, stream }) => {
    if(stream.length == 0){
        return axios.put(`${GW_URL}/schools/${school_id}/addClassTeacher`, {
            class_id,
            teacher_id,
            section,
            medium
        }, adminConfig);
    }else{
        return axios.put(`${GW_URL}/schools/${school_id}/addClassTeacher`, {
            class_id,
            teacher_id,
            section,
            medium,
            stream
        }, adminConfig);
    }
}

const ClassTeacher = (props) => {
    const [rows, setRows] = useState([]);
    const [openLoader, setOpenLoader] = useState(false);
    const [formData, setFormData] = useState({
        teacherId: "",
        classId: "",
        section: "",
        medium: "",
        stream: ""
    });
    const [allClasses, setAllClasses] = useState([]);
    const [teacherClassAndMediumInfo, setTeacherClassAndMediumInfo] = useState([]);
    const [allMedium, setAllMedium] = useState([]);
    const [allSection, setAllSection] = useState([]);
    const [streamOpen, setStreamOpen] = useState(false);

    let decodeToken = jwt_decode(localStorage.getItem("auth_token"));
    let school_id = (localStorage.getItem("superadmin_school") === null) ? decodeToken.result.school_id : localStorage.getItem("superadmin_school"); 
    const { data: allTeacher } = useFetchTeacher(school_id);
    const { isLoading, data: classTeacherData } = useFetchAllClassTeacher(school_id);

    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: addClassTeacher,
        onSuccess: () => {
            setOpenLoader(false);
            queryClient.invalidateQueries(ALL_CLASS_TEACHER);
        
            toast.success("Class Teacher assigned successfully", {
                position: "top-center",
                autoClose: 1000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            }
            );
            setFormData({
                teacherId: "",
                classId: "",
                section: "",
                medium: "",
                stream: ""
            });
            setStreamOpen(false);
        },
        onError: () => {
            setOpenLoader(false);
            toast.error("Something went wrong!", {
                theme: "dark",
            });
        },
    });

    useEffect(() => {
        if (!isLoading) {
            let allClassTeacher = [];
            for (let i = 0; i < classTeacherData?.data?.allClassTeacher.length; i++) {
                let stream = classTeacherData?.data?.allClassTeacher[i].stream;
                if(stream?.length == 0){
                    stream = '---'
                }
                allClassTeacher.push({ ...classTeacherData?.data?.allClassTeacher[i], stream: stream, id: i + 1 });
            }
            setRows(allClassTeacher);
        }
    }, [classTeacherData]);

    useEffect(() => {
        if (formData.teacherId != "") { 
            setAllClasses([]);
            setAllSection([]);
            setAllMedium([]);
            setFormData((prev) => ({...prev, medium: '', section: '', classId: ''}));
            axios.get(`${GW_URL}/teacher/${formData.teacherId}/getTeacherMediumAndClass`, adminConfig)
                .then((data) => {
                    let teacherAllMediumAndClassInfo = data.data.allMediumAndClass;
                    let classes = [];
                    for (let i = 0; i < teacherAllMediumAndClassInfo?.length; i++) {
                        classes.push({ class_id: teacherAllMediumAndClassInfo[i].class_id, class_name: teacherAllMediumAndClassInfo[i].class_name });
                    }
                    setAllClasses(classes);
                    setTeacherClassAndMediumInfo(teacherAllMediumAndClassInfo);
                }).catch((err) => {
                    console.log(err);
                })
        }
    }, [formData.teacherId]);

    useEffect(() => {
        function upStream(){
            if(formData.classId > 10){
                setStreamOpen(true);
            }else{
                setStreamOpen(false);
            }
        }
        upStream();
    }, [formData.classId]);

    const ClassTeacherHandler = (e) => {
        e.preventDefault();
        if (formData.teacherId.length == 0) {
            toast.error("Teacher is required!", {
                theme: "dark"
            });
            return;
        }
        if (formData.classId.length == 0) {
            toast.error("Class is required!", {
                theme: "dark"
            });
            return;
        } 
        if (parseInt(formData.classId) > 10 && formData.stream.length == 0) {
            toast.error("Stream is required!", {
                theme: "dark"
            });
            return;
        }
        if (formData.medium.length == 0) {
            toast.error("Medium is required!", {
                theme: "dark"
            });
            return;
        }
        if(formData.section.length == 0){
            toast.error("Section is required!", {
                theme: "dark"
            });
            return;
        }
        
        setOpenLoader(true);
        mutation.mutate({ school_id, class_id: formData.classId, medium: formData.medium, teacher_id: formData.teacherId, section: formData.section[0], stream: formData.stream });
    }

    const handleTeacherChange = (e) => {
        e.preventDefault();
        let value = e.target.value;
        setFormData((prev) => ({ ...prev, teacherId: value }));
    }

    const handleClassChange = (e) => {
        e.preventDefault();
        let value = e.target.value;
        setFormData((prev) => ({...prev, medium: '', section: '', stream: ''}));
        setAllSection([]);
        setAllMedium(teacherClassAndMediumInfo.filter((info) => info.class_id == value)[0].medium_section);
        setFormData((prev) => ({ ...prev, classId: value }));
    }

    const handleStreamChange = (e) => {
        e.preventDefault();
        let value = e.target.value; 
        setFormData((prev) => ({...prev, medium: '', section: ''}));
        setAllSection([]);
        setFormData((prev) => ({ ...prev, stream: value }));
    }
 
    const handleMediumChange = (e,value) => {
        e.preventDefault();   
        for(let i = 0; i < teacherClassAndMediumInfo.length; i++){ 
            if(teacherClassAndMediumInfo[i].class_id == formData.classId){ 
                allMedium.map((item, index) => { 
                    let mediumArray = Object.keys(item);
                    for(let j = 0; j < mediumArray.length; j++){
                        if(mediumArray[j] == value){
                            setAllSection(Object.values(item)[j].map((ele) => ele)); 
                        }
                    } 
                })
            }
        } 
        
        setFormData((prev) => ({ ...prev, medium: value, section: '' }));
    }

    const handleSectionChange = (e) => {
        e.preventDefault();
        let value = e.target.value;
        setFormData((prev) => ({ ...prev, section: value }));
    }

    return (
        <div className='classTeacher-container'>
            <Sidebar />
            <div className='classTeachers'>
                <Navbar adminName={props.AdminName} />
                <div className='classTeacher-page page-container'>
                    <div className="classTeacher-page-container">
                        <div className='classTeacher-page-container-heading'>
                            <span >Add Class Teacher</span>
                        </div>
                        <form noValidate onSubmit={ClassTeacherHandler}>
                            <div className='classTeacher-info-detail-container'>
                                <div className='classTeacher-info-detail-student-container'>
                                    <div className='classTeacher-info-detail-student-container-subheading'>
                                        <span>Teacher Details</span>
                                    </div>
                                    <div className='classTeacher-info-detail-student-container-textfield'>
                                        <div className='classTeacher-info-section '>
                                            <TextField
                                                name="teacher"
                                                label="Teacher"
                                                select
                                                value={formData.teacherId}
                                                onChange={handleTeacherChange}
                                                fullWidth
                                                margin="normal"
                                                SelectProps={{
                                                    multiple: false,
                                                }}
                                            >
                                                {allTeacher?.data?.teacherDetails?.map((option) => (
                                                    <MenuItem key={option.teacher_id} value={option.id}>
                                                        {option.teacher_name}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                            <TextField
                                                name="class"
                                                label="Class"
                                                select
                                                value={formData.classId}
                                                onChange={handleClassChange}
                                                fullWidth
                                                margin="normal"
                                                SelectProps={{
                                                    multiple: false,
                                                }}
                                            >
                                                {allClasses?.map((option) => (
                                                    <MenuItem key={option.class_id} value={option.class_id}>
                                                        {option.class_name}
                                                    </MenuItem>
                                                ))}
                                            </TextField>

                                            {streamOpen && <TextField
                                                name="stream"
                                                label="Stream"
                                                select
                                                value={formData.stream}
                                                onChange={handleStreamChange}
                                                fullWidth
                                                margin="normal"
                                                SelectProps={{
                                                    multiple: false,
                                                }}
                                            >
                                                {allStreams?.map((option) => (
                                                    <MenuItem key={option.value} value={option.value}>
                                                        {option.label}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                            }

                                            <FormControl fullWidth margin="normal" style={{ flexGrow: 1 }}>
                                                <InputLabel id={`medium-label`}>Medium</InputLabel>
                                                <Select
                                                    labelId={`medium-label`}
                                                    name={`medium`}
                                                    value={formData.medium}
                                                    onChange={(e) => handleMediumChange(e,e.target.value)}
                                                    required
                                                >
                                                    {allMedium.map((item, index) => (
                                                        Object.keys(item).map((ele) => (
                                                            <MenuItem key={index} value ={ele}>
                                                                {ele}
                                                            </MenuItem> 
                                                        ))
                                                    ))}
                                                </Select>
                                            </FormControl> 

                                            <TextField
                                                name="section"
                                                label="Section"
                                                select
                                                value={formData.section}
                                                onChange={handleSectionChange}
                                                fullWidth
                                                margin="normal"
                                                SelectProps={{
                                                    multiple: false,
                                                }}
                                            >
                                                {allSection?.map((option) => (
                                                    <MenuItem key={option} value={option}>
                                                        {option}
                                                    </MenuItem>
                                                ))}
                                            </TextField>
                                        </div>
                                    </div>
                                </div>
                                <div className='buttonSubmit'> <button>Update</button>  </div>
                            </div>
                        </form>
                    </div>
                    <DataGridWithTooltip rows={rows} columns={columns} loader={isLoading} emptyRowsMessage={"No Teacher Assigned"} />
                </div>
            </div>
            <ToastContainer />
            <Loader open={openLoader} />
        </div>
    );
}

export default ClassTeacher;