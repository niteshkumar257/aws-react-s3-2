import React, { useEffect, useState } from 'react'
import Sidebar from '../../components/Sidebar/Sidebar'
import Navbar from '../../components/Navbar/Navbar'
import "./StudentAttendance.scss"
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { GW_URL, adminConfig } from '../../config';
import Calendar from './Calendar';
import { useQuery } from '@tanstack/react-query';
import jsPDF from 'jspdf';
import { DatePicker } from '@mui/x-date-pickers';
import { Button, CircularProgress } from '@mui/material';
import { ToastContainer, toast } from "react-toastify";


const StudentAttendance = () => {
  const [loading, setLoading] = useState(false);

  const location = useLocation();
  const studentId = location.state?.userId;
  const userName = location.state?.userName;
  const Class = location.state?.class;

  const currenDate = new Date();
  const year = currenDate.getFullYear();

  const [formData, setFormData] = useState({
    startDate:null,
    endDate:null
  });

  const { data: holidays, isLoading: holidayListLoading } = useQuery(
    ['holidays', year],
    () =>
      axios.get(`${GW_URL}/getHolidays?year=${year}`, adminConfig).
        then(res => res?.data?.holidayList)
  );

  const downloadPDF = () => {
  
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

 
 
    axios.get(`${GW_URL}/student/${studentId}/getStudentAttendance?startDate=${start_date}&endDate=${end_date}`, adminConfig).then((res) => {
      let absentList = res.data.studentAbsentList;
      let allAbsentList = [];
      for (let i = 0; i < absentList.length; i++) { 
        allAbsentList.push({ id: i+1, absent_date: absentList[i].absent_date.slice(0,10) });
      } 
      const doc = new jsPDF();
      doc.text("Student absent details", allAbsentList?.length, 5);
      doc.autoTable({
        columns: [
          { header: 'S No.', dataKey: 'id' },
          { header: 'Absent date', dataKey: 'absent_date' }, 
        ],
        body: allAbsentList
      })
      doc.save(`Student absent ${studentId}.pdf`);
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
                disableFuture
                required
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
          <div className="attendance-info-container">
            <div className="name">
              <label>Name:</label>
              <span className='span-text'>{userName?.charAt(0).toUpperCase() + userName.slice(1)}</span>
            </div>
            <div className="Class">
              <label>Class:</label>
              <span className='span-text'>{Class}</span>
            </div>
          </div>
          <div className="calendar-container">
            {!holidayListLoading && <Calendar studentId={studentId} holidays={holidays} />}
          </div>
        </div>
       <ToastContainer/>
      </div>
    </div>
  )
}

export default StudentAttendance