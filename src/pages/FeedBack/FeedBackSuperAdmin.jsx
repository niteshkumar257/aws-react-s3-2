import { useEffect, useState } from "react";
import DataTable from "../../components/DataTable/DataTable";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import useFetchAllSchool from "../../hooks/useFetchAllSchool";
import "./FeedBackSuperadmin.scss";
import useFetchAllAdminFeedback from "../../hooks/useFetchAllAdminFeedback";
import { allFeedbackStatus } from "../../config.js";
import CreateTaskDialog from "./CreateTaskDialog";
import ChangeStatusSuperAdmin from "./ChangeStatusSuperAdmin";
import { ToastContainer, toast } from "react-toastify";

const allAdminColumns = [
  {
    field: "id",
    headerName: "S No.",
    width: 150,
    flex: 1,
    headerAlign: "left",
    align: "left",
  },
  {
    field: "admin_id",
    flex: 1,
    headerName: "",
    editable: false,
    headerAlign: "left",
    align: "left",
    hide: "true",
  },
  {
    field: "school_name",
    flex: 1,
    headerName: "School Name",
    width: 150,
    editable: false,
    headerAlign: "left",
    align: "left",
  },
  {
    field: "admin_name",
    flex: 1,
    headerName: "Admin Name",
    width: 150,
    editable: false,
    headerAlign: "left",
    align: "left",
  },
  {
    field: "mobile",
    headerName: "Mobile No.",
    type: "text",
    width: 150,
    flex: 1,
    editable: false,
    headerAlign: "left",
    align: "left",
  },
];

const allAdminTaskColumns = [
  {
    field: "id",
    headerName: "S No.",
    width: 150,
    flex: 1,
    headerAlign: "left",
    align: "left",
  },
  {
    field: "admin_name",
    flex: 1,
    headerName: "Admin Name",
    width: 150,
    editable: false,
    headerAlign: "left",
    align: "left",
  },
  {
    field: "admin_id",
    flex: 1,
    headerName: "",
    editable: false,
    headerAlign: "left",
    align: "left",
    hide: "true",
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
    field: "original_deadline",
    headerName: "Original Deadline",
    type: "text",
    width: 150,
    flex: 1,
    editable: false,
    headerAlign: "left",
    align: "left",
  },
  {
    field: "new_deadline",
    headerName: "New Deadline",
    type: "text",
    width: 150,
    flex: 1,
    editable: false,
    headerAlign: "left",
    align: "left",
  },
  {
    field: "feedback",
    flex: 1,
    headerName: "",
    editable: false,
    headerAlign: "left",
    align: "left",
    hide: "true",
  },
];

export const getIndianTime = (date) => {
  let startDate = new Date(date);
  let day = 60 * 60 * 6 * 1000 - 60 * 60 * 0.5 * 1000;
  let newDate = new Date(startDate.getTime() + day);
  return newDate;
};

const FeedbackSuperAdmin = () => {
  const [allAdminDetails, setAllAdminDetails] = useState([]);
  const [allTaskDetails, setAllTaskDetails] = useState([]);
  const [createTaskOpen, setCreateTaskOpen] = useState(false);
  const [viewTaskOpen, setViewTaskOpen] = useState(false);
  const [createTaskAdminSelected, setCreateTaskAdminSelected] = useState();
  const [viewTaskAdminSelected, setViewTaskAdminSelected] = useState();

  const { isLoading: adminLoading, data: adminData } = useFetchAllSchool();
  const { isLoading: allTaskLoading, data: allTaskData } =
    useFetchAllAdminFeedback();

  useEffect(() => {
    if (!adminLoading) {
      let allAdminData = [];
      for (let i = 0; i < adminData?.data?.allSchool.length; i++) {
        allAdminData.push({
          id: i + 1,
          admin_id: adminData?.data?.allSchool[i].admin_id,
          school_name: adminData?.data?.allSchool[i].school_name,
          admin_name: adminData?.data?.allSchool[i].admin_name,
          mobile: adminData?.data?.allSchool[i].mobile,
        });
      }
      setAllAdminDetails(allAdminData);
    }
  }, [adminData]);

  useEffect(() => {
    if (!allTaskLoading) {
      let allTask = [];
      for (let i = 0; i < allTaskData?.data?.allTaskInfo.length; i++) {
        let taskStataus = allFeedbackStatus.filter(
          (a) => a.status_id == allTaskData?.data?.allTaskInfo[i].status
        )[0].status_name;

        let newDeadline = getIndianTime(
          allTaskData?.data?.allTaskInfo[i].new_deadline
        );
        let originalDeadline = getIndianTime(
          allTaskData?.data?.allTaskInfo[i].original_deadline
        );

        allTask.push({
          id: i + 1,
          task_id: allTaskData?.data?.allTaskInfo[i].task_id,
          admin_id: allTaskData?.data?.allTaskInfo[i].admin_id,
          admin_name: allTaskData?.data?.allTaskInfo[i].admin_name,
          task: allTaskData?.data?.allTaskInfo[i].task,
          status: taskStataus,
          original_deadline: originalDeadline.toJSON().slice(0, 10),
          new_deadline: newDeadline.toJSON().slice(0, 10),
          feedback: allTaskData?.data?.allTaskInfo[i].feedback,
        });
      }
      setAllTaskDetails(allTask);
    }
  }, [allTaskData]);

  const handleCreateTaskClose = () => {
    setCreateTaskOpen(!createTaskOpen);
  };

  const handleCreateTaskSelect = (data) => {
    setCreateTaskAdminSelected(data.admin_id);
    setCreateTaskOpen(true);
  };

  const handleViewTaskClose = () => {
    setViewTaskOpen(!viewTaskOpen);
  };

  const handleViewTaskSelect = (data) => {
    setViewTaskAdminSelected(data);
    setViewTaskOpen(true);
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

  const viewColumn = [
    {
      field: "view",
      headerName: "Create Task",
      width: 200,
      editable: false,
      sortable: false,
      align: "center",
      headerAlign: "center",
      flex: 1,
      disableFilter: true,
      renderCell: (params) => {
        return (
          <div className="viewButton" style={{ width: "fit-content" }}>
            <button
              style={{ marginRight: "5px", width: "100%" }}
              onClick={() => handleCreateTaskSelect(params.row)}
            >
              Create Task
            </button>
          </div>
        );
      },
    },
  ];

  const viewTaskColumn = [
    {
      field: "view",
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
          <div className="viewButton">
            <button
              style={{ marginRight: "5px" }}
              onClick={() => handleViewTaskSelect(params.row)}
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
      <div className="feedback-SuperAdmin">
        <Navbar />
        <div style={{ marginLeft: "10px" }}>
          <h3>All Admin</h3>
          <DataTable
            rows={allAdminDetails}
            columns={allAdminColumns.concat(viewColumn)}
            emptyRowsMessage={"There is admin present"}
            loader={adminLoading}
          />
        </div>
        <div style={{ marginLeft: "10px" }}>
          <h3>All Admin Task</h3>
          <DataTable
            rows={allTaskDetails}
            columns={allAdminTaskColumns.concat(viewTaskColumn)}
            emptyRowsMessage={"There is admin task present"}
            loader={allTaskLoading}
          />
        </div>
      </div>
      {createTaskOpen && (
        <CreateTaskDialog
          open={createTaskOpen}
          handleClose={handleCreateTaskClose}
          adminId={createTaskAdminSelected}
          showStatus={showStatus}
        />
      )}
      {viewTaskOpen && (
        <ChangeStatusSuperAdmin
          open={viewTaskOpen}
          handleClose={handleViewTaskClose}
          adminId={viewTaskAdminSelected}
          taskDetails={viewTaskAdminSelected}
          showStatus={showStatus}
        />
      )}

      <ToastContainer />
    </div>
  );
};

export default FeedbackSuperAdmin;
