import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import "./TeacherLoginDetails.scss";
import DataTable from "../../components/DataTable/DataTable";
import { Button, Container, MenuItem, TextField } from "@mui/material";
import useFetchAllSchool from "../../hooks/useFetchAllSchool";
import axios from "axios";
import { GW_URL, superAdminConfig } from "../../config";
import jsPDF from "jspdf";

const columns = [
  {
    field: "id",
    headerName: "S No.",
    flex: 1,
    editable: false,
    align: "left",
    headerAlign: "left",
  },
  {
    field: "teacher_name",
    headerName: "Name",
    flex: 1,
    editable: false,
    headerAlign: "left",
    align: "left",
  },
  {
    field: "username",
    headerName: "UserName",
    editable: true,
    flex: 1,
    editable: false,
    headerAlign: "left",
    align: "left",
  },
  {
    field: "password",
    headerName: "Password",
    flex: 1,
    editable: false,
    headerAlign: "left",
    align: "left",
  },
];

const TeacherLoginDetails = () => {
  const [dataRows, setDataRows] = useState([]);
  const [schoolId, setSchoolId] = useState(undefined);
  const [teacherLoginLoading, setTeacherLoginLoading] = useState(false);

  const { isLoading: schoolLoading, data: schoolData } = useFetchAllSchool();

  useEffect(() => {
    function fetch() {
      setTeacherLoginLoading(true);
      axios
        .get(
          `${GW_URL}/schools/${schoolId}/getTeachersLoginDetails`,
          superAdminConfig
        )
        .then((teacherLoginDetails) => {
          let allTeacherDetails = [];
          let allTeacherLoginDetails =
            teacherLoginDetails?.data?.teacherLoginDetails;
          for (let i = 0; i < allTeacherLoginDetails?.length; i++) {
            allTeacherDetails.push({ ...allTeacherLoginDetails[i], id: i + 1 });
          }
          setDataRows(allTeacherDetails);
          setTeacherLoginLoading(false);
        });
    }
    if (schoolId != undefined) {
      fetch();
    }
  }, [schoolId]);

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Teacher login details", dataRows?.length, 5);
    doc.autoTable({
      columns: [
        { header: "S No.", dataKey: "id" },
        { header: "Name", dataKey: "teacher_name" },
        { header: "Username", dataKey: "username" },
        { header: "Password", dataKey: "password" },
      ],
      body: dataRows,
    });
    doc.save(`teacher_login_${schoolId}.pdf`);
  };

  return (
    <div className="teacher-id-password-container">
      <Sidebar />
      <div className="teacher-id-password">
        <Navbar />
        <div style={{ marginLeft: "10px" }}>
          <h3>Teacher password</h3>
          <div
            style={{
              display: "flex",
              width: "100%",
              justifyContent: "space-between",
            }}
          >
            <TextField
              value={schoolId || ""}
              style={{ marginBottom: "10px", width: "33%", marginRight: "1em" }}
              select
              label="School"
              required
              onChange={(e) => setSchoolId(e.target.value)}
            >
              {!schoolLoading &&
                schoolData?.data?.allSchool.length > 0 &&
                schoolData?.data?.allSchool.map((option) => (
                  <MenuItem key={option.id} value={option.id}>
                    {option.school_name}
                  </MenuItem>
                ))}
            </TextField>
            <div
              style={{
                width: "auto",
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              {!teacherLoginLoading && (
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
          <DataTable
            rows={dataRows}
            columns={columns}
            emptyRowsMessage={"No Teachers"}
            loader={teacherLoginLoading}
          />
        </div>
      </div>
    </div>
  );
};

export default TeacherLoginDetails;
