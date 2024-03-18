import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import "./TeacherTask.scss";
import DataTable from "../../components/DataTable/DataTable";
import { useNavigate } from "react-router-dom";
import { MenuItem, TextField } from "@mui/material";
import useFetchAllSchool from "../../hooks/useFetchAllSchool";
import Loader from "../../components/Loader/Loader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useFetchTeacher from "../../hooks/useFetchTeacher";
import axios from "axios";

import {
  GW_URL,
  subjects,
  superAdminConfig,
  getTaskColor,
  getTaskStatus,
  TT_subjectList,
} from "../../config";


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
    field: "teacher_id",
    headerName: "SI No.",
    flex: 1,
    editable: false,
    align: "left",
    hide: true,
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
    field: "subject_name",
    headerName: "Subject",
    editable: true,
    flex: 1,
    editable: false,
    headerAlign: "left",
    align: "left",
  },
  {
    field: "mobile",
    headerName: "Mobile Number",
    flex: 1,
    editable: false,
    headerAlign: "left",
    align: "left",
  },
];

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const CapitalLizeFirstLetter = (arr) => {
  const modifiedArray = arr.map((item) => {
    const modifiedItem = {
      ...item,
      teacher_name: capitalizeFirstLetter(item.teacher_name),
    };
    return modifiedItem;
  });
  return modifiedArray;
};

const TeacherTask = () => {
  const navigate = useNavigate();

  const [dataRows, setDataRows] = useState([]);
  const [schoolId, setSchoolId] = useState(undefined);
  const { isLoading, data } = useFetchTeacher(schoolId);
  const [loaderOpen, setLoaderOpen] = useState(false);

  const [assignLoading, setAssignLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [noChapters, setNoChapters] = useState(0);


  const { isLoading: schoolLoading, data: schoolData } = useFetchAllSchool();

  const getSubjectName = (subjectIds) => {
    let subjectName = [];
    for (let i = 0; i < subjectIds.length; i++) {
      const subject = subjects.filter((a) => a.subject_id == subjectIds[i]);
      subjectName.push(subject[0].subject_name);
    }
    return subjectName;
  };

  useEffect(() => {
    if (!isLoading) {
      let allTeacher = [];
      for (let i = 0; i < data?.data?.teacherDetails.length; i++) {
        let subjectName = getSubjectName(
          data?.data?.teacherDetails[i].subject_id
        );
        allTeacher.push({
          ...data?.data?.teacherDetails[i],
          id: i + 1,

          teacher_id: data?.data?.teacherDetails[i].teacher_id,

          subject_name: subjectName,
        });
      }

      setDataRows(CapitalLizeFirstLetter(allTeacher));
    }
  }, [data]);

  const viewColumn = [
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      editable: false,
      sortable: false,
      align: "center",
      headerAlign: "center",
      flex: 1,
      disableFilter: true,
      renderCell: (params) => {
        return (
          <div className="viewButton">
            <button
              onClick={() => actionDialogHandler(params.row)}
              style={{
                marginRight: "5px",

                padding: ".5rem",
                width: "150px",
                color: "white",
                textDecorationLine: "none",
                backgroundColor: `${getTaskColor(params.row.total_status)}`,
              }}
            >
              {getTaskStatus(params.row.total_status)}

            </button>
          </div>
        );
      },
    },
  ];

  const actionDialogHandler = (teacher) => {
    const id = teacher.teacher_id;
    let { class_ids, subject_id } = teacher;

    class_ids.sort((a, b) => a - b);
    subject_id.sort((a, b) => a - b);

    const chapter_tt_status = parseInt(teacher.total_status);

    if (chapter_tt_status >= 0) {
      navigate(`assignTask/${id}`);
    } else {
      setAssignLoading(true);
      axios
        .post(`${GW_URL}/teacher/${id}/assignChapters`, {
          school_id: schoolId,
          class_ids,
          subject_id,
        })
        .then((res) => {
          if (res.data.chapters) {
            setNoChapters(res.data.chapters.length);
            toast.warning("No chapters out there");
          } else {
            navigate(`assignTask/${id}`);
          }
          setAssignLoading(false);
        })
        .catch((err) => {
          console.log(err);
          setIsError(true);
          setAssignLoading(false);
        });
    }
  };


  return (
    <div className="teachertask-container">
      <Sidebar />
      <div className="teacherTask">
        <Navbar />
        <div style={{ marginLeft: "10px" }}>
          <h3>Teacher Task</h3>
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
          <DataTable
            rows={dataRows}
            columns={columns.concat(viewColumn)}
            emptyRowsMessage={"No Teachers"}
            loader={isLoading}
          />
        </div>
      </div>
      <Loader open={loaderOpen || assignLoading} />

      <ToastContainer />
    </div>
  );
};

export default TeacherTask;
