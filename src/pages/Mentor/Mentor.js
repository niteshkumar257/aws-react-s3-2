import React, { useState, useEffect } from "react";
import DataTable from "../../components/SuperAdminTable/SuperAdminTable";
import axios from "axios";
import "./Mentor.scss";
import { GW_URL, superAdminConfig } from "../../config";
import dayjs from "dayjs";
import { getIndianTime } from "../FeedBack/FeedBackAdmin";

const columns = [
  { field: "id", headerName: "ID", width: 0, flex: 0, hide: true },
  {
    field: "mentor_id",
    headerName: "Mentor Id",
    width: 50,
    flex: 1,
    headerAlign: "left",
    align: "left",
  },
  {
    field: "mentor_name",
    flex: 1,
    headerName: "Mentor Name",
    width: 200,
    editable: true,
    headerAlign: "left",
    align: "left",
  },
  // { field: 'school_name', headerName: 'School Name', width: 50, flex: 1, editable: false, headerAlign: "left", align: "left" },
  {
    field: "parent_name",
    headerName: "Parent Name",
    editable: false,
    width: 200,
    flex: 1,
    headerAlign: "left",
    align: "left",
  },
  {
    field: "request_date",
    headerName: "Request Date",
    editable: false,
    width: 150,
    flex: 1,
    headerAlign: "left",
    align: "left",
  },
  {
    field: "schedule_date",
    headerName: "Schedule Date",
    editable: false,
    width: 150,
    flex: 1,
    headerAlign: "left",
    align: "left",
  },
  {
    field: "status",
    headerName: "FullFill",
    editable: false,
    width: 150,
    flex: 1,
    headerAlign: "left",
    align: "left",
  },
];

const Mentor = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    axios
      .get(`${GW_URL}/allMentorSchedule`, superAdminConfig)
      .then((data) => {
        const allSchedules = data.data.allMentorSchedule;
        const arrangedSchedules = [];

        let cnt = 0;
        allSchedules?.forEach((schedule) => {
          const parent_name = schedule.father_name;

          for (let j = 0; j < schedule.mentor_id.length; j++) {
            cnt++;
            let request_date = getIndianTime(schedule?.request_date[j]);

            let scheduleObj = {
              id: cnt,
              mentor_id: schedule.mentor_id[j],
              mentor_name: schedule.mentor_name[j],
              parent_name: parent_name,
              request_date:
                request_date.slice(8, 10) +
                "-" +
                request_date.slice(5, 7) +
                "-" +
                request_date.slice(0, 4) +
                " : " +
                request_date.slice(11, 19),
              schedule_date:
                schedule.schedule_date == null ||
                schedule.schedule_date[j] == undefined
                  ? "-"
                  : schedule.schedule_date[j].slice(8, 10) +
                    "-" +
                    schedule.schedule_date[j].slice(5, 7) +
                    "-" +
                    schedule.schedule_date[j].slice(0, 4) +
                    " : " +
                    schedule.schedule_date[j].slice(11, 19),
              status: schedule.meet_done[j] == 0 ? "False" : "True",
            };
            arrangedSchedules.push(scheduleObj);
          }
        });
        setRows(arrangedSchedules);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  return (
    <div className="mentor-schedule-container">
      <div className="mentor-schedule">
        <span className="mentor-schedule-heading">Mentor Schedules</span>
        <div className="mentor-schedule-table page-container">
          <DataTable rows={rows} columns={columns} />
        </div>
      </div>
    </div>
  );
};

export default Mentor;
