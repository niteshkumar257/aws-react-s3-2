import React, { useEffect } from "react";
import "./Attendance.scss";
import { useState } from "react";

import {
  Box,
  Button,
  CircularProgress,
  MenuItem,
  TextField,
} from "@mui/material";
import DataTable from "../../components/DataTable/DataTable";
import {
  ALL_TEACHER_ATTENDANCE,
  useFetchAllTeacherAttendance,
} from "../../hooks/useFetchAllTeacherAttendance.js";
import jwt_decode from "jwt-decode";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import DataLoader from "../../components/Loader/DataLoader";
import NoData from "../../components/Template/NoData";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { GW_URL, adminConfig, formateTimeToAm_PM } from "../../config";
import { ToastContainer, toast } from "react-toastify";
import ImageModal from "./ImageModal.jsx";
import Loader from "../../components/Loader/Loader.jsx";
import ConfirmationModal from "./ConfirmatinModal.jsx";

const Teacher_attendance_column = [
  {
    field: "id",
    headerName: "S No.",
    width: 150,
    flex: 1,
    headerAlign: "left",
    align: "left",
  },
  {
    field: "serial_id",
    headerName: "S No.",
    hide: false,
    width: 150,
    flex: 1,
    headerAlign: "left",
    align: "left",
    hide: true,
  },
  {
    field: "teacher_id",
    flex: 1,
    headerName: "Teacher id",
    width: 150,
    editable: false,
    hide: true,
    headerAlign: "left",
    align: "left",
  },
  {
    field: "teacher_name",
    flex: 1,
    headerName: "Name",
    width: 150,
    editable: false,
    headerAlign: "left",
    align: "left",
  },
  {
    field: "mobile",
    headerName: "Mobile No.",
    editable: false,
    width: 150,
    flex: 1,
    headerAlign: "left",
    align: "left",
  },

  // {
  //   field: "outtime",
  //   headerName: "Outtime",
  //   editable: false,
  //   width: 150,
  //   flex: 1,
  //   headerAlign: "left",
  //   align: "left",
  // },
];
const Data = [
  {
    id: 1,
    serial_id: 101,
    teacher_id: 1001,
    teacher_name: "John Doe",
    medium: "English",
    mobile: "123-456-7890",
    intime: "08:00 AM",
    outtime: "03:00 PM",
    reject: 0,
  },
  {
    id: 2,
    serial_id: 102,
    teacher_id: 1002,
    teacher_name: "Jane Smith",
    medium: "Math",
    mobile: "987-654-3210",
    intime: "09:00 AM",
    outtime: "04:00 PM",
    reject: 0,
  },
  {
    id: 3,
    serial_id: 103,
    teacher_id: 1003,
    teacher_name: "Bob Johnson",
    medium: "Science",
    mobile: "555-555-5555",
    intime: "08:30 AM",
    outtime: "02:30 PM",
    reject: 0,
  },
  {
    id: 4,
    serial_id: 104,
    teacher_id: 1004,
    teacher_name: "Alice Brown",
    medium: "History",
    mobile: "111-222-3333",
    intime: "07:45 AM",
    outtime: "03:45 PM",
    reject: 1,
  },
  {
    id: 5,
    serial_id: 105,
    teacher_id: 1005,
    teacher_name: "Eva White",
    medium: "Geography",
    mobile: "999-888-7777",
    intime: "08:15 AM",
    outtime: "03:15 PM",
    reject: 1,
  },
];

// You can continue to add more data objects to the `rowData` array to match the number of rows you need for your table.

const rejectTeacherAttendance = ({ teacher_id, attendance_date }) => {
  return axios.post(
    `${GW_URL}/teacher/${teacher_id}/rejectTeacherAttendance`,
    { attendanceDate: attendance_date },
    adminConfig
  );
};

const TeacherAttendance = () => {
  const [date, setDate] = useState(new Date(new Date()).toJSON().slice(0, 10));
  const [dataRows, setDataRows] = useState(Data);
  const [teacherRejectedChanged, setTeacherRejectedChanged] = useState(false);
  const [imageUri, setImageUri] = useState();

  const [teacherName, setTeacherName] = useState("Nitesh Kumar");
  const [attendanceUpdateLoading, setAttendanceUpdateLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [isConfirmationOpen, setConfirmationOpen] = useState(false);

  const handleOpenModal = (value, type) => {
    if (type === "intime") {
      setImageUri(value.intime_image);
    } else {
      setImageUri(value.outtime_image);
    }
    setTeacherName(value.teacher_name);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  let decodeToken = jwt_decode(localStorage.getItem("auth_token"));
  let school_id =
    localStorage.getItem("superadmin_school") === null
      ? decodeToken.result.school_id
      : localStorage.getItem("superadmin_school");

  const { isLoading, data } = useFetchAllTeacherAttendance({ school_id, date });

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: rejectTeacherAttendance,
    onSuccess: () => {
      setAttendanceUpdateLoading(false);
      queryClient.invalidateQueries(ALL_TEACHER_ATTENDANCE, date, school_id);
      setTeacherRejectedChanged(true);
      toast.success("Attendance Rejected!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    },
    onError: () => {
      setAttendanceUpdateLoading(false);
      toast.error("Something went wrong", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    },
  });

  useEffect(() => {
    if (!isLoading) {
      let teacherAttendanceData = data?.data?.allTeacherAttendanceDetails;
      let allTeacherAttendanceContainer = [];
      for (let i = 0; i < teacherAttendanceData?.length; i++) {
        allTeacherAttendanceContainer.push({
          id: i + 1,
          serial_id: i + 1,
          ...teacherAttendanceData[i],
        });
      }
      setDataRows(allTeacherAttendanceContainer);
    }
  }, [isLoading, date, teacherRejectedChanged]);

  const downloadPDF = () => {
    console.log("hello there");
    const doc = new jsPDF();
    let selected_date = new Date(date);
    let attendance_date = new Date(
      selected_date.getTime() + 60 * 60 * 6 * 1000 - 60 * 60 * 0.5 * 1000
    );
    doc.text("Attendance list", dataRows.length, 5);
    doc.autoTable({
      columns: [
        { header: "S No.", dataKey: "id" },
        { header: "Teacher Name", dataKey: "teacher_name" },
        { header: "Mobile Number", dataKey: "mobile" },
        { header: "Intime", dataKey: "intime" },
        { header: "Outtime", dataKey: "outtime" },
      ],
      body: dataRows,
    });
    doc.save(`attendance-${attendance_date.toJSON().slice(0, 10)}.pdf`);
  };

  const rejectAttendance = (teacherId) => {
    setConfirmationOpen(true);
    setSelectedTeacher(teacherId);
  };

  const handleCloseConfirmation = () => {
    setConfirmationOpen(false);
  };

  const handleConfirm = () => {
    setAttendanceUpdateLoading(true);
    setTeacherRejectedChanged(false);
    mutation.mutate({ teacher_id: selectedTeacher, attendance_date: date });
    handleCloseConfirmation();
  };

  const inTimeColumn = [
    {
      field: "intime",
      headerName: "In Time",
      width: 200,
      editable: false,
      sortable: false,
      align: "center",
      headerAlign: "center",
      flex: 1,
      disableFilter: true,

      renderCell: (params) => {
        return (
          <div>
            <button
              onClick={() => handleOpenModal(params.row, "intime")}
              style={{
                backgroundColor: "#77dd77",
                borderRadius: 9,
                color: "black",
                width: 100,
                textDecoration: "none",
              }}
            >
              {formateTimeToAm_PM(params.row.intime)}
            </button>
          </div>
        );
      },
    },

    {
      field: "outtime",
      headerName: "Out Time",
      width: 200,
      editable: false,
      sortable: false,
      align: "center",
      headerAlign: "center",
      flex: 1,
      disableFilter: true,

      renderCell: (params) => {
        return (
          <div>
            <button
              disabled={!params.row.intime_image}
              onClick={() => handleOpenModal(params.row, "outime")}
              style={{
                backgroundColor: "#77dd77",
                borderRadius: 9,
                color: "black",
                width: 100,
                textDecoration: "none",
              }}
            >
              {params.row.outtime
                ? formateTimeToAm_PM(params.row.outtime)
                : "Not yet"}
            </button>
          </div>
        );
      },
    },
    {
      field: "verified",
      headerName: "Action",
      width: 200,
      editable: false,
      sortable: false,
      align: "center",
      headerAlign: "center",
      flex: 1,
      disableFilter: true,
      renderCell: (params) => {
        return (
          <div
            style={{
              display: "flex",
              width: "400",
              display: "flex",
              flexDirection: "row",
              columnGap: 10,
              justifyItems: "center",
              alignItems: "center",
            }}
          >
            {params.row.verified == "1" && (
              <button
                style={{
                  marginRight: "5px",
                  backgroundColor: "red",
                  textDecoration: "none",
                  color: "white",
                  textDecoration: "none",
                }}
                onClick={() => rejectAttendance(params.row.teacher_id)}
              >
                Reject
              </button>
            )}

            {params.row.verified == "0" && (
              <p
                style={{
                  fontSize: "14px",
                  marginRight: "5px",
                  textDecoration: "none",
                  color: "red",
                }}
              >
                Rejected
              </p>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="attendance-container">
      <div className="attendance">
        <div className="attendance-page page-container">
          <div className="attendance-headr">
            <span>Teacher Attendance</span>
          </div>

          <div className="attendance-headr">
            <span style={{ marginRight: "1em" }}>Select Date: </span>
            <DatePicker
              variant="outlined"
              type="date"
              format="DD/MM/YYYY"
              disableFuture
              value={dayjs(date)}
              onChange={(e) => setDate(e)}
            />
            <div
              style={{
                width: "auto",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              {!isLoading && data?.data?.attendanceTakent != 0 && (
                <Button
                  variant="contained"
                  sx={{
                    width: "fit-content",
                    padding: "1.3em",
                    margin: "0.4em",
                  }}
                  onClick={downloadPDF}
                >
                  Generate PDF
                </Button>
              )}
            </div>
          </div>
          <Box sx={{ flexDirection: "column", justifyContent: "space-evenly" }}>
            {isLoading ? (
              <DataLoader Loading={isLoading} width={60} />
            ) : data?.data?.allTeacherAttendanceDetails?.length > 0 ? (
              <DataTable
                rows={data.data.allTeacherAttendanceDetails.map(
                  (item, index) => ({ id: index + 1, ...item })
                )}
                columns={Teacher_attendance_column.concat(inTimeColumn)}
                emptyRowsMessage={"No teacher attendance"}
                loader={isLoading}
              />
            ) : (
              <NoData
                message={"Attendance is not yet taken or holiday"}
                height={"400px"}
              />
            )}
          </Box>
        </div>
      </div>
      {teacherName && imageUri && (
        <ImageModal
          open={modalOpen}
          handleClose={handleCloseModal}
          teacherName={teacherName}
          imageUrl={imageUri}
        />
      )}
      <ToastContainer />
      <Loader open={attendanceUpdateLoading} />
      <ConfirmationModal
        open={isConfirmationOpen}
        onClose={handleCloseConfirmation}
        onConfirm={handleConfirm}
        title="Confirmation"
        message="Are you sure you want to proceed?"
      />
    </div>
  );
};

export default TeacherAttendance;
