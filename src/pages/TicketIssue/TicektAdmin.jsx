import React, { useState, useEffect } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import DataTable from "../../components/DataTable/DataTable";
import "./TicketAdmin.scss";
import {
  AdminIssue,
  AdminIssueTwo,
  adminConfig,
  getAdminDetails,
  allStatusAtAdminForTicket,
  superAdminConfig,
} from "../../config";
import { useNavigate } from "react-router-dom";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { TextField, MenuItem } from "@mui/material";
import axios from "axios";
import { GW_URL, ChangeDateFormat } from "../../config";
import Loader from "../../components/Loader/Loader";
import FormDialog from "./Dialogform";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const TicektAdmin = () => {
  const navigate = useNavigate();
  const [date, setDate] = useState("");
  const [status, setStatus] = useState(1);
  const [parentRow, setParentRow] = useState([]);
  const [parentLoading, setParentLoading] = useState(true);
  const [teacherLoading, setTeacherLoading] = useState(true);
  const [teacherRow, setTeacherRow] = useState([]);
  const [actionDialog, setActionDialog] = useState(false);
  const [details, setDetails] = useState("");
  const [requstMessage, setRequestMessage] = useState("");
  const [openLoader, setOpenLoader] = useState(false);
  const [adminChat, setAdminChat] = useState("");
  const [isView, setIsView] = useState(false);

  const { school_id, category_id } = getAdminDetails();

  const { allStatus, chatAllowed, adminAllowedToResolved } =
    allStatusAtAdminForTicket(category_id);

  const getParentIssue = () => {
    axios
      .get(
        `${GW_URL}/ticket/getParentsTicketStatus?school_id=${school_id}&status=${status}&created_on=${date}`,
        adminConfig
      )
      .then((res) => {
        setParentRow(ChangeDateFormat(res.data.tickerInfo));
        setParentLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setParentLoading(false);
      });
  };
  const getTeachetIssue = () => {
    axios
      .get(
        `${GW_URL}/ticket/getTeachersTicketStatus?school_id=${school_id}&status=${status}&created_on=${date}`,
        adminConfig
      )
      .then((res) => {
        setTeacherRow(ChangeDateFormat(res.data.tickerInfo));
        setTeacherLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setTeacherLoading(false);
      });
  };
  useEffect(() => {
    getParentIssue();
    getTeachetIssue();
  }, [status, date]);

  const actionDialogHandler = (value, flag) => {
    const { parents_id, teacher_id, admin_id, id } = value;
    setActionDialog(true);
    setDetails(value);
    setIsView(flag);

    axios
      .get(
        `${GW_URL}/issueMessages/${id}/${admin_id}/${1}/${parents_id}/${teacher_id}`,
        adminConfig
      )
      .then((res) => {
        setAdminChat(res.data.allMessages);
      })
      .catch((err) => {
        console.log(err);
      });

    setActionDialog(true);
    setDetails(value);
  };
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
        const { status } = params.row;

        // Check if the status is equal to 1 or 4
        if (status === 2 || status === 3) {
          // Return null to remove the button from the cell
          return (
            <div className="viewButton">
              <button
                style={{ marginRight: "5px" }}
                onClick={() => actionDialogHandler(params.row, true)}
              >
                View
              </button>
            </div>
          );
        } else
          return (
            <div className="viewButton">
              <button
                onClick={() => actionDialogHandler(params.row, false)}
                style={{ marginRight: "5px", textDecorationLine: "none" }}
              >
                Action
              </button>
            </div>
          );
      },
    },
  ];

  const handleApprove = () => {
    const { parents_id, teacher_id, id, admin_id } = details;
    if (requstMessage.trim() != "") {
      setActionDialog(false);
      setOpenLoader(true);
      if (teacher_id != undefined) {
        axios
          .post(
            `${GW_URL}/ticket/${id}/sendApproveRequest?teacher_id=${teacher_id}&admin_id=${admin_id}&superadmin_id=${1}`,
            {
              message: requstMessage,
            },
            adminConfig
          )
          .then((res) => {
            setOpenLoader(false);
            setRequestMessage("");

            toast.success("Message Sent Succefully", {
              position: "top-center",
              autoClose: 2000,

              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
          })
          .catch((err) => {
            setOpenLoader(false);
            setRequestMessage("");
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
          });
      } else {
        axios
          .post(
            `${GW_URL}/ticket/${id}/sendApproveRequest?parents_id=${parents_id}&admin_id=${admin_id}&superadmin_id=${1}`,
            {
              message: requstMessage,
            },
            adminConfig
          )
          .then((res) => {
            setOpenLoader(false);
            setRequestMessage("");

            toast.success("Message Sent Succefully", {
              position: "top-center",
              autoClose: 2000,

              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
          })
          .catch((err) => {
            console.log(err);
            setOpenLoader(false);
            setRequestMessage("");
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
          });
      }
    } else {
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
    }
  };

  const handleResolved = () => {
    const { parents_id, teacher_id, admin_id, id } = details;
    if (requstMessage.trim() != "") {
      if (teacher_id != undefined) {
        axios
          .put(
            `${GW_URL}/ticket/${id}/approveOrRejectRequest?teacher_id=${teacher_id}&admin_id=${admin_id}&resolve=true&revoke=false`,
            { message: requstMessage },
            superAdminConfig
          )
          .then((res) => {
            setOpenLoader(false);
            setActionDialog(false);
            getTeachetIssue();
            setRequestMessage("");
            toast.success("Issue Resolve Succesfully", {
              position: "top-center",
              autoClose: 2000,

              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
          })
          .catch((err) => {
            console.log(err);
            setLoaderOpen(false);
            setRequestMessage("");
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
          });
      } else {
        axios
          .put(
            `${GW_URL}/ticket/${id}/approveOrRejectRequest?parent_id=${parents_id}&admin_id=${admin_id}&resolve=true&revoke=false`,
            { message: requstMessage },
            superAdminConfig
          )
          .then((res) => {
            setOpenLoader(false);
            setActionDialog(false);
            getParentIssue();
            setRequestMessage("");
            toast.success("Issue Resolve Succesfully", {
              position: "top-center",
              autoClose: 2000,

              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
          })
          .catch((err) => {
            console.log(err);
            setRequestMessage("");
            setOpenLoader(false);
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
          });
      }
    } else {
      toast.error("Message is required ", {
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

  return (
    <div className="ticketAdmin-container ">
      <Sidebar />
      <div className="ticketAdmin">
        <Navbar />
        <div className="ticketAdmin-page page-container">
          TicketAdmin
          <div className="ticketAdminTableContainer">
            <div className="teacherAdminContainer">
              <div className="inputContainer">
                <DatePicker
                  variant="outlined"
                  type="date"
                  format="DD/MM/YYYY"
                  disableFuture
                  value={dayjs(date)}
                  onChange={(e) => setDate(e)}
                />

                <TextField
                  value={status}
                  style={{ width: "15em", marginLeft: "7em" }}
                  select
                  label="Status"
                  required
                  onChange={(e) => setStatus(e.target.value)}
                >
                  {allStatus.map((option) => (
                    <MenuItem key={option.status_id} value={option.status_id}>
                      {option.status_name}
                    </MenuItem>
                  ))}
                </TextField>
              </div>
              <div className="parentAdminContainer"></div>
            </div>
            <div className="parentAdminContainer"></div>
          </div>
          <div>
            <div
              className="headingContainer"
              style={{
                marginBottom: 10,
              }}
            >
              <span>Parent Ticket IssueList</span>
            </div>
            <DataTable
              columns={AdminIssue.concat(viewColumn)}
              rows={parentRow}
              loader={parentLoading}
              emptyRowsMessage={"No ticket issued"}
            />
          </div>
          <div
            className="headingContainer"
            style={{
              marginBottom: 10,
            }}
          >
            <span>Teacher Ticket Issue</span>
          </div>
          {
            <DataTable
              columns={AdminIssueTwo.concat(viewColumn)}
              loader={teacherLoading}
              emptyRowsMessage={"No ticket issued"}
              rows={teacherRow}
            />
          }
        </div>

        {actionDialog && (
          <FormDialog
            value={details}
            open={actionDialog}
            setActionDialog={setActionDialog}
            handleApprove={handleApprove}
            requstMessage={requstMessage}
            setRequestMessage={setRequestMessage}
            chatPermitted={chatAllowed}
            resolvedAllowed={adminAllowedToResolved}
            handleResolved={handleResolved}
            adminChat={adminChat}
            isView={isView}
          />
        )}
      </div>
      <ToastContainer />
      <Loader open={openLoader} />
    </div>
  );
};
export default TicektAdmin;
