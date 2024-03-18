import React, { useEffect, useContext, useState, useRef } from "react";
import "./CompareLevel.scss";
import ReactSelect from "./ReactSelect";
import {
  months,
  classes,
  GW_URL,
  adminConfig,
  currentYear,
  currentMonth,
  studentLevel,
  subjects,
  getSelectedMonthLevel,
  getCurrentMonthStudentLevel,
  mergeTwoJson,
  mediums,
  allSections
} from "../../config";
import axios from "axios";
import jwt_decode from "jwt-decode";
import DataTable from "../../components/DataTable/DataTable";

import { TextField, Stack, MenuItem } from "@mui/material";
import DataLoader from "../../components/Loader/DataLoader";
import Button from "@mui/material/Button";
import NoData from "../../components/NoData/NoData";

import { ToastContainer, toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";

// custom hooks
import useMediumQuery from "../../hooks/useGetMediuIds";
import useClassIdsQuery from "../../hooks/useGetSchoolIds";
import SelectField from "../../components/selectTextField/selectTextfield";

import jsPDF from "jspdf";
import "jspdf-autotable";

const getTableData = (studentLevel, month1, month2) => {
  const result = [];
  const resultMap = {};

  for (const record of studentLevel) {
    const student_id = record.student_id;
    const student_name = record.student_name;

    for (let i = 0; i < record.subject_ids.length; i++) {
      const subject_id = record.subject_ids[i];
      const level = record.levels[i];
      const month = record.month;

      const key = `${student_id}-${subject_id}`;
      if (!resultMap[key]) {
        resultMap[key] = {
          id: result.length + 1,
          student_id: student_id,
          student_name: student_name,
          subject_id: subjects.find(
            (subject) => subject.subject_id == subject_id
          ).subject_name,
          level1: null,
          month1: null,
          level2: null,
          month2: null,
        };
        result.push(resultMap[key]);
      }

      if (month === month1) {
        resultMap[key].level1 = level;
        resultMap[key].month1 = month1;
      }

      if (month === month2) {
        resultMap[key].level2 = level;
        resultMap[key].month2 = month2;
      }
    }
  }

  const coloredStudentLevel = result.map((record) => {
    const { level1, level2 } = record;

    let level2Color = level1 <= level2 ? "#03C03C" : "#E32636";

    if (level2 == null) level2Color = "white";

    if (level2 == null || level1 == null) {
      return {
        ...record,
        level2: {
          value: level2,
          color: "#1377C0",
        },
      };
    }
    return {
      ...record,
      level2: {
        value: level2,
        color: level2Color,
      },
    };
  });
  return coloredStudentLevel;
};

const CompareLevel = () => {
  let decodeToken = jwt_decode(localStorage.getItem("auth_token"));
  let school_id =
    localStorage.getItem("superadmin_school") === null
      ? decodeToken.result.school_id
      : localStorage.getItem("superadmin_school");

  const currentDate = new Date();
  const currentMonthIndex = currentDate.getMonth();

  const [studentLevelrow, setStudentLevelRow] = useState();
  const [classValue, setClassValue] = useState(null);
  const [medium, setMedium] = useState(null);
  const [month1, setMonth1] = useState();
  const [month2, setMonth2] = useState(currentMonthIndex);
  const [studentLevelLoading, setStudentLevelLoading] = useState(false);
  const [section,setSetcions]=useState(null);

  const monthOptions = months.map((month) => ({
    value: month.month_id,
    label: month.month_name,
  }));


  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.text("StudentLevel", 10, 10);
    doc.autoTable({
      columns: [
        { header: "Serial No", dataKey: "id" },
        { header: "Student Name", dataKey: "student_name" },
        { header: "Subject Name", dataKey: "subject_id" },
        { header: "level1", dataKey: "level1" },
        { header: "level2", dataKey: "level2" },
      ],
      body: studentLevelrow,
      startY: 20, // Set the starting Y coordinate
      margin: { top: 30 }, // Add margin between heading and table rows
      didParseCell: (data) => {
        if (data.row.section === "body" && data.column.dataKey === "level2") {
          const rowIndex = data.row.index;
          const row = studentLevelrow[rowIndex];

          if (row && row.level2) {
            const { value, color } = row.level2 ?? {};
            data.cell.text = value?.toString() ?? "";
            data.cell.styles.fillColor = color;
            data.cell.styles.halign = "center";
            data.cell.styles.textColor = "#ffffff";
          }
        }
      },
    });

    doc.save(`StudentLevel_pdf`);
  };

  const getStudentLevel = () => {
    if (month1 == null) {
      toast.error("Please select a month");
      return;
    }
    if (classValue == null) {
      toast.error("Please Select a ClassValue");
      return;
    }
    if (medium == null) {
      toast.error("Please Select a Medium");
      return;
    }
    if(section==null) {
      toast.error("Please Select a Section");
      return ;
    }
    setStudentLevelLoading(true);
    console.log(month1,classValue,medium);

    axios
      .get(
        `${GW_URL}/schools/${school_id}/getStudentLevel?year=${currentYear}&month1=${month1}&month2=${month2}&class_id=${classValue}&medium=${medium}&section=${section}`,
        adminConfig
      )
      .then((res) => {
        const rows = getTableData(res.data?.studentLevel, month1, month2);

        setStudentLevelRow(rows);
        setStudentLevelLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setStudentLevelLoading(false);
      });
  };

  const compareStudentLevelHandler = () => {
    getStudentLevel();
  };

  const { data: mediumIdData, isLoading: mediumIdLoading } =
    useMediumQuery(school_id);

  const { data: classIdData, isLoading: classIdLoading } =
    useClassIdsQuery(school_id);

  const classHandler = (value) => {
    setClassValue(value);
  };
  const mediumHandler = (value) => {
    setMedium(value);
  };
  const sectionHandler=(value)=>{
    setSetcions(value);
  }
  const month1Handler=(value)=>{
    setMonth1(value);
  }
  return (
    <div className="compareClassContainer">
      <div className="compareClassTopContainer">
        <div className="comparetClassHeaderContainer">
          <span>Student Level Comparision</span>
        </div>
      </div>
      <div className="compareClassBottomContainer">
        <div className="selectCotainer">
          {/* <TextField
            defaultValue=""
            sx={{ flex: 0.5 }}
            required
            select
            label="Month"
            onChange={(e) => setMonth1(e.target.value)}
            helperText="Select Month"
          >
            {monthOptions?.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField> */}

          <SelectField
            label="Month"
            items={months}
            // loading={classIdLoading}
            onChange={month1Handler}
            idKey={"month_id"}
            nameKey={"month_name"}
          />
          <SelectField
            label="Class"
            items={classIdData}
            loading={classIdLoading}
            onChange={classHandler}
            idKey={"class_id"}
            nameKey={"class_name"}
          />

          <SelectField
            label="Medium"
            items={mediumIdData}
            loading={mediumIdLoading}
            onChange={mediumHandler}
            idKey={"medium_id"}
            nameKey={"medium_name"}
          />
           <SelectField
          label="Section"
          items={allSections}
          onChange={sectionHandler}
          idKey={"section_name"}
          nameKey={"section_name"}
        />

          <Button
            sx={{ width: 100, padding: 3, height: 55, fontSize: 12 }}
            onClick={compareStudentLevelHandler}
            variant="contained"
            size="large"
          >
            Compare
          </Button>
          <Button
            sx={{ width: 150, padding: 3, height: 55, fontSize: 12 }}
            onClick={downloadPDF}
            variant="contained"
            size="large"
            disabled={studentLevelrow?.length > 0 ? false : true}
          >
            Generate Pdf
          </Button>
        </div>
        <div className="TableContainer">
          <div></div>
          {studentLevelLoading ? (
            <div
              style={{
                width: "100%",
                height: "30vh",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <DataLoader Loading={studentLevelLoading} width={60} />
            </div>
          ) : studentLevelrow?.length > 0 ? (
            <DataTable rows={studentLevelrow} columns={studentLevel} />
          ) : (
            <NoData message={"No Student Level"} height={200} />
          )}
        </div>
        <ToastContainer />
      </div>
    </div>
  );
};

export default CompareLevel;
