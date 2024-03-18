import React, { useState, useEffect } from "react";
import "./ParentsTeacher.scss";
import { TextField } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import DataGridWithToolTrip from "../../components/DataGrid/DataGridWithToolTrip";
import { GW_URL, adminConfig } from "../../config";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { DatePicker } from "@mui/x-date-pickers";
import Loader from "../../components/Loader/Loader";
import Details from "./Details";

const ParentsTeacher = () => {
  const [classId, setClassId] = useState("");
  const [Classes, setClasses] = useState();
  const [meetingDate, setMeetingDate] = useState("");
  const [rows, setRows] = useState([]);
  const [loaderOpen, setLoaderOpen] = useState(false);
  let decodeToken = jwt_decode(localStorage.getItem("auth_token"));
  let school_id =
    localStorage.getItem("superadmin_school") === null
      ? decodeToken.result.school_id
      : localStorage.getItem("superadmin_school");

  useEffect(() => {
    axios
      .get(`${GW_URL}/schools/${school_id}/getClassId`, adminConfig)
      .then((res) => {
        const modified = res.data.class_id.map((id, index) => ({
          id,
          class_name: res.data.class_name[index],
        }));
        setClasses(modified);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const fetchPTMInfo = () => {
    axios
      .get(`${GW_URL}/schools/${school_id}/ptmNotification`, adminConfig)
      .then((res) => {
        let allRows = [];
        for (let i = 0; i < res.data.allPTMNotification.length; i++) {
          let scheduleStartDate = new Date(
            res.data.allPTMNotification[i].schedule_on
          );
          let createdStartDate = new Date(
            res.data.allPTMNotification[i].created_on
          );
          let day = 60 * 60 * 6 * 1000 - 60 * 60 * 0.5 * 1000;
          let scheduleDate = new Date(scheduleStartDate.getTime() + day);
          let createdDate = new Date(createdStartDate.getTime() + day);
          allRows.push({
            ...res.data.allPTMNotification[i],
            id: i + 1,
            schedule_on: scheduleDate.toJSON().slice(0, 10),
            created_on: createdDate.toJSON().slice(0, 10),
          });
        }
        setRows(allRows);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Couldn't fetch the PTM Details");
      });
  };

  useEffect(() => {
    fetchPTMInfo();
  }, []);

  const addPTM = (e) => {
    e.preventDefault();
    if (classId == "") {
      toast.error("Class is required!", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }
    if (meetingDate == "") {
      toast.error("Meeting date is required!", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }
    setLoaderOpen(true);
    axios
      .post(
        `${GW_URL}/schools/${school_id}/${classId}/ptmNotification`,
        {
          meeting_date: meetingDate,
        },
        adminConfig
      )
      .then((res) => {
        setLoaderOpen(false);
        toast.success(res.data.message, {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        fetchPTMInfo();
        setClassId("");
        setMeetingDate("");
      })
      .catch(() => {
        setLoaderOpen(false);
        toast.error("Something went wrong!", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      });
  };

  const columns = [
    {
      field: "id",
      headerName: "S No.",
      width: 50,
      flex: 1,
      editable: false,
      headerAlign: "left",
      align: "left",
    },
    {
      field: "parent_name",
      headerName: "Parent Name",
      width: 50,
      flex: 1,
      editable: false,
      headerAlign: "left",
      align: "left",
    },
    {
      field: "message",
      flex: 1,
      headerName: "Info",
      width: 200,
      editable: false,
      headerAlign: "left",
      align: "left",
      renderCell: (params) => <Details value={params.value} />,
    },
    {
      field: "created_on",
      headerName: "Created On",
      width: 50,
      flex: 1,
      editable: false,
      headerAlign: "left",
      align: "left",
    },
    {
      field: "schedule_on",
      headerName: "Schedule On",
      width: 50,
      flex: 1,
      editable: false,
      headerAlign: "left",
      align: "left",
    },
  ];

  return (
    <>
      <div className="parent-teacher-meeting-container">
        <div className="parent-teacher-meeting-container-heading">
          <span>Parents Teacher Meeting</span>
        </div>
        <div className="parent-teacher-meeting-container-body">
          <div className="parent-teacher-meeting-container-form">
            <form noValidate onSubmit={addPTM}>
              <div className="teachers-info-detail-container">
                <div className="teachers-info-detail-student-container">
                  <div className="teachers-info-detail-student-container-subheading">
                    <span>Parent Teacher Meeting Details</span>
                  </div>
                  <div className="teachers-info-detail-student-container-textfield">
                    {/* row one */}
                    <div className="teachers-info-section ">
                      <TextField
                        fullWidth
                        value={classId}
                        sx={{ flex: 1 }}
                        required
                        select
                        label="Class"
                        helperText="Select Class"
                        onChange={(e) => setClassId(e.target.value)}
                      >
                        {Classes?.map((option) => (
                          <MenuItem key={option.id} value={option.id}>
                            {option.class_name}
                          </MenuItem>
                        ))}
                      </TextField>
                      <DatePicker
                        fullWidth
                        variant="outlined"
                        type="date"
                        format="DD/MM/YYYY"
                        slotProps={{
                          textField: {
                            helperText: "Select meeting date",
                          },
                        }}
                        disablePast
                        value={meetingDate}
                        onChange={(e) => setMeetingDate(e)}
                      />
                    </div>
                  </div>
                </div>
                <div className="buttonSubmit">
                  {" "}
                  <button>Push</button>{" "}
                </div>
              </div>
            </form>
          </div>
          <div className="parent-teacher-meeting-container-table">
            <DataGridWithToolTrip
              rows={rows}
              columns={columns}
              emptyRowsMessage={"No meetings are scheduled"}
            />
          </div>
        </div>
        <ToastContainer />
        <Loader open={loaderOpen} />
      </div>
    </>
  );
};

export default ParentsTeacher;
