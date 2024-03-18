import React, { useEffect } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import "./Attendance.scss";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  MenuItem,
  TextField,
} from "@mui/material";
import DataTable from "../../components/DataTable/DataTable";
import { useFetchAllStudentAttendance } from "../../hooks/useFetchAllStudentAttendance";
import jwt_decode from "jwt-decode";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import useSchoolData from "../../hooks/useSchoolData";
import DataLoader from "../../components/Loader/DataLoader";
import NoData from "../../components/Template/NoData";
import jsPDF from "jspdf";
import "jspdf-autotable";
import Location from "../Location/Location";
import TeacherAttendance from "./TeacherAttendance.jsx";
import useClassIdsQuery from "../../hooks/useGetSchoolIds.js";

const columns = [
  {
    field: "id",
    headerName: "S No.",
    width: 150,
    flex: 1,
    headerAlign: "left",
    align: "left",
    hide: true,
  },
  {
    field: "student_id",
    headerName: "Serial No",
    hide: true,
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
  },
  {
    field: "student_name",
    flex: 1,
    headerName: "Name",
    width: 150,
    editable: false,
    headerAlign: "left",
    align: "left",
  },
  {
    field: "class_id",
    headerName: "Class",
    type: "number",
    width: 150,
    flex: 1,
    editable: false,
    headerAlign: "left",
    align: "left",
  },
  {
    field: "medium",
    headerName: "Medium",
    type: "number",
    width: 150,
    flex: 1,
    editable: false,
    headerAlign: "left",
    align: "left",
  },
  {
    field: "section",
    headerName: "Section",
    type: "text",
    width: 150,
    flex: 1,
    editable: false,
    headerAlign: "left",
    align: "left",
  },
  {
    field: "father_name",
    headerName: "Parents Name",
    editable: false,
    width: 150,
    flex: 1,
    headerAlign: "left",
    align: "left",
  },
  {
    field: "whatsapp_no",
    headerName: "Primary Mobile",
    editable: false,
    width: 150,
    flex: 1,
    headerAlign: "left",
    align: "left",
  },
  {
    field: "alternative_mobile",
    headerName: "Alt. Mobile",
    editable: false,
    width: 150,
    flex: 1,
    headerAlign: "left",
    align: "left",
  },
];

const Attendance = () => {
  const [Class, setClass] = useState("ALL");
  const [date, setDate] = useState(new Date(new Date()).toJSON().slice(0, 10));
  const [dataRows, setDataRows] = useState([]);
  const navigate = useNavigate();

  let decodeToken = jwt_decode(localStorage.getItem("auth_token"));
  let school_id =
    localStorage.getItem("superadmin_school") === null
      ? decodeToken.result.school_id
      : localStorage.getItem("superadmin_school");

  const { data: classIdData, isLoading: classIdLoading } =
    useClassIdsQuery(school_id);

  const { isLoading, data } = useFetchAllStudentAttendance({
    school_id,
    date,
    class_id: Class,
    allClasses: Class === "ALL",
  });

  // const { isLoading: classDataLoading, classArray } = useSchoolData(school_id);

  const handleSelect = (row) => {
    navigate(`/attendance/${row.id}`, {
      state: {
        userId: row.id,
        userName: row.student_name,
        class: row.class_id,
      },
    });
  };

  useEffect(() => {
    if (!isLoading) {
      if (data?.data?.attendanceTaken !== 0) {
        setDataRows(data?.data?.attendanceData);
      }
    }
  }, [isLoading, date]);

  const addClass = (classArray) => {
    return [...classArray, { id: 13, value: "ALL", label: "ALL" }];
  };

  const viewColumn = [
    {
      field: "view",
      headerName: "Student Details",
      width: 200,
      editable: false,
      sortable: false,
      align: "left",
      headerAlign: "left",
      flex: 1,
      disableFilter: true,
      renderCell: (params) => {
        return (
          <div className="viewButton">
            <button
              style={{ marginRight: "5px" }}
              onClick={() => handleSelect(params.row)}
            >
              View
            </button>
          </div>
        );
      },
    },
  ];

  const downloadPDF = () => {
    const doc = new jsPDF();
    let selected_date = new Date(date);
    let attendance_date = new Date(
      selected_date.getTime() + 60 * 60 * 6 * 1000 - 60 * 60 * 0.5 * 1000
    );
    doc.text("Attendance list", data?.data?.attendanceData?.length, 5);
    doc.autoTable({
      columns: [
        { header: "S No.", dataKey: "id" },
        { header: "Student Name", dataKey: "student_name" },
        { header: "Class", dataKey: "class_id" },
        { header: "section", dataKey: "section" },
        { header: "Medium", dataKey: "medium" },
        { header: "Parent Name", dataKey: "father_name" },
        { header: "Primary Mobile", dataKey: "whatsapp_no" },
      ],
      body: dataRows,
    });
    doc.save(`attendance_${attendance_date.toJSON().slice(0, 10)}.pdf`);
  };

  const addId = (values) => {
    const changeClassName = (class_id) => {
      switch (class_id) {
        case -1:
          return "KG1";
        case -2:
          return "KG2";
        case -3:
          return "KG3";
        default:
          return class_id;
      }
    };

    const detailsWithId = values?.map((detail, index) => ({
      ...detail,
      serial_id: index + 1,
    }));
    for (let i = 0; i < detailsWithId?.length; i++) {
      const currentObject = detailsWithId[i];
      const newClassName = changeClassName(currentObject.class_id);
      currentObject.class_id = newClassName;
    }
    return detailsWithId;
  };
  return (
    <div className="attendance-container">
      <Sidebar />
      <div className="attendance">
        <Navbar />
        {classIdLoading ? (
          <div
            style={{
              flex: 4,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100vh",
            }}
          >
            <DataLoader width={100} Loading={classIdLoading} />
          </div>
        ) : (
          <div>
            <div className="attendance-page page-container">
              {/* <div className="location-container">
               <Location/>
            </div> */}
              <div className="attendance-headr">
                <span>Student Attendance</span>
              </div>

              <div className="attendance-headr">
                <span style={{ marginRight: "2em" }}>Select Date: </span>
                <DatePicker
                  variant="outlined"
                  type="date"
                  format="DD/MM/YYYY"
                  disableFuture
                  value={dayjs(date)}
                  onChange={(e) => setDate(e)}
                />
                <TextField
                  value={Class}
                  style={{ width: "15em", marginLeft: "7em" }}
                  select
                  label="Class"
                  required
                  onChange={(e) => setClass(e.target.value)}
                >
                  {classIdLoading ? ( // If loading, show loading message
                    <MenuItem value="">Loading...</MenuItem>
                  ) : (
                    // If not loading, show the actual dropdown options
                    classIdData.map((option) => (
                      <MenuItem key={option.class_id} value={option.class_id}>
                        {option.class_name}
                      </MenuItem>
                    ))
                  )}
                </TextField>
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
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                {isLoading ? (
                  <DataLoader Loading={isLoading} width={60} />
                ) : data?.data?.attendanceTaken != 0 ? (
                  // <DataTable rows={ addId(data?.data?.attendanceData)} columns={columns.concat(viewColumn)} emptyRowsMessage={"All student are present"} loader={isLoading}
                  // />
                  <DataTable
                    rows={addId(dataRows)}
                    columns={columns.concat(viewColumn)}
                    emptyRowsMessage={"All student are present"}
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
            <TeacherAttendance />
          </div>
        )}
      </div>
    </div>
  );
};

export default Attendance;
