import React, { useState } from 'react'
import Sidebar from '../../components/Sidebar/Sidebar'
import Navbar from '../../components/Navbar/Navbar'
import "./StudentAttendance.scss";
import EachTeacherAttendanceCalender from './EachTeacherAttendanceCalender';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { useLocation, useParams } from 'react-router-dom';
import { GW_URL, adminConfig, getIndianDate } from '../../config';
import { DatePicker } from '@mui/x-date-pickers';
import { Button, CircularProgress } from '@mui/material';
import { ToastContainer, toast } from 'react-toastify';
import jsPDF from 'jspdf';
import useFetchAllHoliday from '../../hooks/useFetchAllHoliday';

const EachTeacherAttendance = () => {
    const [loading, setLoading] = useState(false);
    const { decodeToken, school_id, category_id } = getAdminDetails();

    const location = useLocation();
    const teacherName = location?.state?.teacherName?.teacher_name;
    const params = useParams();

    const { teacherId } = params;

    const [formData, setFormData] = useState({
        startDate: "",
        endDate: ""
    });

    const currenDate = new Date();
    const year = currenDate.getFullYear();

    // const { data: holidays, isLoading: holidayListLoading } = useQuery(
    //     ['holidays', year],
    //     () =>
    //         axios.get(`${GW_URL}/getHolidays?year=${year}`, adminConfig).
    //             then(res => res?.data?.holidayList)
    // );
    const { data: holidays, isLoading: holidayListLoading } = useFetchAllHoliday(school_id);
    const downloadPDF = () => {
        console.log("hello pdf");
        if (formData.startDate.length == "") {
            toast.error("Please Add start date!", {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                theme: "dark",
            });
            return;
        }

        if (formData.endDate.length == "") {
            toast.error("Please Add end date!", {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                theme: "dark",
            });
            return;
        }

        if (formData.startDate > formData.endDate) {
            toast.error("Start date should be less than end date!", {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                theme: "dark",
            });
            return;
        }


        setLoading(true);
        axios.get(`${GW_URL}/teachers/${teacherId}/getTeacherAttendance?startDate=${formData.startDate}&endDate=${formData.endDate}`, adminConfig).then((res) => {
            let absentList = res.data.teacherAbsentList;
            let allAbsentList = [];
            for (let i = 0; i < absentList.length; i++) { 
                allAbsentList.push({ id: i+1, absent_date: absentList[i].absent_date.slice(0,10) });
            } 
            const doc = new jsPDF();
            doc.text("Teacher absent details", allAbsentList?.length, 5);
            doc.autoTable({
                columns: [
                { header: 'S No.', dataKey: 'id' },
                { header: 'Absent date', dataKey: 'absent_date' }, 
                ],
                body: allAbsentList
            });
            doc.save(`Teacher absent ${teacherName}.pdf`);
             
            setLoading(false);
        }).catch((err) => {
            console.log(err);
            toast.error("Something went wrong generating pdf", {
                position: "top-center",
                autoClose: 2000,
                hideProgressBar: false,
                theme: "dark",
            });
            setLoading(false);
        })
    }

    return (
        <div className='attendance-container '>
            <Sidebar />
            <div className='attendance'>
                <Navbar />
                <div className='attendance-page page-container'>
                    <div className="dateRange">
                        <div className="datePicker">

                            <DatePicker
                                name="startDate"
                                variant="outlined"
                                type="date"
                                format="DD/MM/YYYY"
                                required
                                sx={{ flex: 1, marginRight: "5%" }}
                                value={formData.startDate}
                                slotProps={{
                                    textField: {
                                        helperText: 'Select startDate',
                                    },
                                }}
                                onChange={(e) => setFormData((prevData) => ({ ...prevData, ['startDate']: e }))}
                            />
                            <DatePicker
                                name="endDate"
                                variant="outlined"
                                type="date"
                                format="DD/MM/YYYY"
                                required
                                disableFuture
                                sx={{ flex: 1 }}
                                value={formData.endDate}
                                slotProps={{
                                    textField: {
                                        helperText: 'Select endDate',
                                    },
                                }}
                                onChange={(e) => setFormData((prevData) => ({ ...prevData, ['endDate']: e }))}
                            />

                            <Button
                                variant="contained"
                                sx={{ width: "fit-content", padding: "1.3em", margin: "0.4em" }}
                                onClick={downloadPDF}
                                disabled={loading}
                            >
                                {loading ? <CircularProgress size={24} /> : 'Generate PDF'}
                            </Button>
                        </div>
                    </div>
                    {/* <div className="attendance-info-container">
                        <div className="name">
                            <label>Name:</label>
                            <span className='span-text'>{teacherName}</span>
                        </div>
                    </div> */}
                    <div className="calendar-container">
                        <EachTeacherAttendanceCalender teacherId={teacherId} holidays={holidays} holidayListLoading={holidayListLoading} />
                    </div>
                </div>
                <ToastContainer />
            </div>
        </div>
    )
}

export default EachTeacherAttendance;