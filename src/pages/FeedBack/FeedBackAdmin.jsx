import { useEffect, useState } from "react";
import DataTable from "../../components/DataTable/DataTable";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import "./FeedBackAdmin.scss";
import useFetchAdminHoldTask from "../../hooks/useFetchAdminHoldTask";
import { allFeedbackStatus } from "../../config.js";
import useFetchAdminCurrentTask from "../../hooks/useFetchAdminCurrentTask";
import jwt_decode from "jwt-decode";
import ChangeStatusAdmin from "./ChangeStatusAdmin";
import { ToastContainer, toast } from "react-toastify";

const currentDateTaskColumn = [
  {
    field: "id",
    headerName: "S No.",
    width: 100,
    flex: 1,
    headerAlign: "left",
    align: "left",
  },
  {
    field: "task_id",
    flex: 1,
    headerName: "",
    editable: false,
    headerAlign: "left",
    align: "left",
    hide: "true",
  },
  {
    field: "task",
    flex: 1,
    headerName: "Task",
    width: 150,
    editable: false,
    headerAlign: "left",
    align: "left",
  },
  {
    field: "original_deadline",
    flex: 1,
    headerName: "Original Deadline",
    width: 150,
    editable: false,
    headerAlign: "left",
    align: "left",
  },
  {
    field: "new_deadline",
    flex: 1,
    headerName: "New Deadline",
    width: 150,
    editable: false,
    headerAlign: "left",
    align: "left",
  },
  {
    field: "status",
    flex: 1,
    headerName: "Status",
    width: 150,
    editable: false,
    headerAlign: "left",
    align: "left",
    renderCell: (params) => {
      let statusColor = "";
      let statusText = "";

      if (params.row.status == "In Progess") {
        statusColor = "Orange";
        statusText = "In progress";
      } else if (params.row.status == "Hold") {
        statusColor = "Red";
        statusText = "Hold";
      } else if (params.row.status == "Completed") {
        statusColor = "Green";
        statusText = "Completed";
      } else {
        statusColor = "";
        statusText = "-";
      }

      return (
        <div
          style={{
            backgroundColor: statusColor,
            color: statusText != "-" ? "white" : "black",
            padding: "4px 8px",
            borderRadius: "4px",
            fontSize: 15,
          }}
        >
          {statusText}
        </div>
      );
    },
  },
  {
    field: "feedback",
    headerName: "",
    type: "text",
    width: 150,
    flex: 1,
    editable: false,
    hide: true,
    headerAlign: "left",
    align: "left",
  },
];

const holdTaskColumn = [
  {
    field: "id",
    headerName: "S No.",
    width: 100,
    flex: 1,
    headerAlign: "left",
    align: "left",
  },
  {
    field: "task_id",
    flex: 1,
    headerName: "",
    editable: false,
    headerAlign: "left",
    align: "left",
    hide: "true",
  },
  {
    field: "task",
    flex: 1,
    headerName: "Task",
    width: 150,
    editable: false,
    headerAlign: "left",
    align: "left",
  },
  {
    field: "original_deadline",
    flex: 1,
    headerName: "Original Deadline",
    width: 150,
    editable: false,
    headerAlign: "left",
    align: "left",
  },
  {
    field: "new_deadline",
    flex: 1,
    headerName: "New Deadline",
    width: 150,
    editable: false,
    headerAlign: "left",
    align: "left",
  },
  {
    field: "status",
    flex: 1,
    headerName: "Status",
    width: 150,
    editable: false,
    headerAlign: "left",
    align: "left",
    renderCell: (params) => {
      let statusColor = "";
      let statusText = "";

      if (params.row.status == "In Progess") {
        statusColor = "Orange";
        statusText = "In progress";
      } else if (params.row.status == "Hold") {
        statusColor = "Red";
        statusText = "Hold";
      } else if (params.row.status == "Completed") {
        statusColor = "Green";
        statusText = "Completed";
      } else {
        statusColor = "";
        statusText = "-";
      }

      return (
        <div
          style={{
            backgroundColor: statusColor,
            color: statusText != "-" ? "white" : "black",
            padding: "4px 8px",
            borderRadius: "4px",
            fontSize: 15,
          }}
        >
          {statusText}
        </div>
      );
    },
  },
  {
    field: "feedback",
    headerName: "",
    type: "text",
    width: 150,
    flex: 1,
    editable: false,
    hide: true,
    headerAlign: "left",
    align: "left",
  },
];

export const getIndianTime = (date) => {
  let startDate = new Date(date);
  let day = 60 * 60 * 6 * 1000 - 60 * 60 * 0.5 * 1000;
  let newDate = new Date(startDate.getTime() + day);
  return newDate;
};

const FeedbackAdmin = () => {
  const [allCurrenDateTaskDetails, setAllCurrenDateTaskDetails] = useState([]);
  const [allHoldTaskDetails, setAllHoldTaskDetails] = useState([]);
  const [selectedTaskDetails, setSelectedTaskDetails] = useState();
  const [isHoldTaskSelected, setIsHoldTaskSelected] = useState(false);
  const [openSelectedTask, setOpenSelectedTask] = useState(false);

  let decodeToken = jwt_decode(localStorage.getItem("auth_token"));
  let admin_id = decodeToken.result.admin_id;

  const { isLoading: currentTaskLoading, data: currentTaskData } =
    useFetchAdminCurrentTask(admin_id);
  const { isLoading: holdTaskLoading, data: holdTaskData } =
    useFetchAdminHoldTask(admin_id);

  useEffect(() => {
    if (!currentTaskLoading) {
      let currentTask = [];

      for (let i = 0; i < currentTaskData?.data?.allTaskInfo.length; i++) {
        let newDeadline = getIndianTime(
          currentTaskData?.data?.allTaskInfo[i].new_deadline
        );
        let originalDeadline = getIndianTime(
          currentTaskData?.data?.allTaskInfo[i].original_deadline
        );
        let taskStataus = allFeedbackStatus.filter(
          (a) => a.status_id == currentTaskData?.data?.allTaskInfo[i].status
        )[0].status_name;

        currentTask.push({
          id: i + 1,
          task_id: currentTaskData?.data?.allTaskInfo[i].task_id,
          task: currentTaskData?.data?.allTaskInfo[i].task,
          status: taskStataus,
          original_deadline: originalDeadline.toJSON().slice(0, 10),
          new_deadline: newDeadline.toJSON().slice(0, 10),
          feedback: currentTaskData?.data?.allTaskInfo[i].feedback,
        });
      }

      setAllCurrenDateTaskDetails(currentTask);
    }
  }, [currentTaskData]);

  useEffect(() => {
    if (!holdTaskLoading) {
      let holdTask = [];
      for (let i = 0; i < holdTaskData?.data?.allTaskInfo.length; i++) {
        let newDeadline = getIndianTime(
          holdTaskData?.data?.allTaskInfo[i].new_deadline
        );
        let originalDeadline = getIndianTime(
          holdTaskData?.data?.allTaskInfo[i].original_deadline
        );
        let taskStataus = allFeedbackStatus.filter(
          (a) => a.status_id == holdTaskData?.data?.allTaskInfo[i].status
        )[0].status_name;

        holdTask.push({
          id: i + 1,
          task_id: holdTaskData?.data?.allTaskInfo[i].task_id,
          task: holdTaskData?.data?.allTaskInfo[i].task,
          status: taskStataus,
          original_deadline: originalDeadline.toJSON().slice(0, 10),
          new_deadline: newDeadline.toJSON().slice(0, 10),
          feedback: holdTaskData?.data?.allTaskInfo[i].feedback,
        });
      }
      setAllHoldTaskDetails(holdTask);
    }
  }, [holdTaskData]);

  const handleCloseSelectedTask = (open) => {
    setOpenSelectedTask(!open);
  };

  const handleCurrentTaskSelect = (data) => {
    setIsHoldTaskSelected(false);
    setOpenSelectedTask(true);
    setSelectedTaskDetails(data);
  };

  const handleHoldTaskSelect = (data) => {
    setIsHoldTaskSelected(true);
    setOpenSelectedTask(true);
    setSelectedTaskDetails(data);
  };

  const showStatus = ({ success, fail }) => {
    if (success) {
      toast.success("Data Changed Successfully!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } else if (fail) {
      toast.error("Something went wrong!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };

  const viewCurrentTaskColumn = [
    {
      field: "view",
      headerName: "View",
      width: 200,
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
              style={{ marginRight: "5px" }}
              onClick={() => handleCurrentTaskSelect(params.row)}
            >
              View
            </button>
          </div>
        );
      },
    },
  ];

  const viewHoldTaskColumn = [
    {
      field: "view",
      headerName: "View",
      width: 200,
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
              style={{ marginRight: "5px" }}
              onClick={() => handleHoldTaskSelect(params.row)}
            >
              View
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="feedback-container">
      <Sidebar />
      <div className="feedback-Admin">
        <Navbar />
        <div style={{ marginLeft: "10px" }}>
          <h3>Current Tasks</h3>
          <DataTable
            rows={allCurrenDateTaskDetails}
            columns={currentDateTaskColumn.concat(viewCurrentTaskColumn)}
            emptyRowsMessage={"No task till now"}
            loader={currentTaskLoading}
          />
        </div>
        <div style={{ marginLeft: "10px" }}>
          <h3>On hold Task</h3>
          <DataTable
            rows={allHoldTaskDetails}
            columns={holdTaskColumn.concat(viewHoldTaskColumn)}
            emptyRowsMessage={"No hold task till now"}
            loader={holdTaskLoading}
          />
        </div>
      </div>
      {openSelectedTask && (
        <ChangeStatusAdmin
          open={openSelectedTask}
          taskDetails={selectedTaskDetails}
          handleClose={handleCloseSelectedTask}
          isHoldOpen={isHoldTaskSelected}
          showStatus={showStatus}
        />
      )}
      <ToastContainer />
    </div>
  );
};

export default FeedbackAdmin;
