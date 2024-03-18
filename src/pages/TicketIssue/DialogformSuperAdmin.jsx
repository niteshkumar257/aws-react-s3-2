import * as React from "react";
import { useEffect, useState } from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import "./DialogformSuperAdmin.scss";
import {
  GW_URL,
  capitalizeFirstLetter,
  formatTime,
  sortMessage,
  dateToString,
  adminConfig,
} from "../../config";
import { Paper } from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import DangerousIcon from "@mui/icons-material/Dangerous";
import DataLoader from "../../components/Loader/DataLoader";
import axios from "axios";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import ClearSharpIcon from "@mui/icons-material/ClearSharp";
import { useQuery } from "@tanstack/react-query";
export default function FormDialog({
  value,
  open,
  setActionDialog,
  handleRevoke,
  handleResolve,
  requestMessage,
  setRequestMessage,
  adminChat,
  isView,
}) {
  const { messages, created_at } = adminChat;
  const messageTime = new Date(created_at).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  const [mobileNumber, setMobileNumber] = useState("");
  const [loaderOpen, setLoaderOpen] = useState(true);

  const {
    data: schoolData,
    isLoading: schoolLoading,
    isError: Error,
  } = useQuery(["school", value.school_id], () =>
    axios
      .get(`${GW_URL}/schools/${value.school_id}`, adminConfig)
      .then((res) => {
        return res?.data;
      })
  );
  const getTeacherDetails = () => {
    axios
      .get(`${GW_URL}/teacher/${value.teacher_id}`, adminConfig)
      .then((res) => {
        setMobileNumber(res.data.teacherDetails[0].mobile);
        setLoaderOpen(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getParentsDetails = () => {
    axios
      .get(`${GW_URL}/parents/${value.parents_id}`, adminConfig)
      .then((res) => {
        setMobileNumber(res.data.parentDetails.whatsapp_no);
        setLoaderOpen(false);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    if (value.teacher_id != undefined) getTeacherDetails();
    else getParentsDetails();
  }, []);

  const handleClickOpen = () => {
    setActionDialog(true);
  };

  const handleClose = () => {
    setActionDialog(false);
  };
  const SubmitForm = () => {
    console.log("");
  };

  const allStatus = [
    {
      status_id: 1,
      status_name: "Pending at Admin",
    },
    {
      status_id: 2,
      status_name: "Pending for Approval",
    },
    {
      status_id: 3,
      status_name: "Resolved",
    },
  ];
  return (
    <div>
      <div className="cancelButtonContainer">
        <ClearSharpIcon
          onClick={handleClose}
          sx={{
            fontSize: 50,
            color: "black",
            cursor: "pointer",
          }}
        />
      </div>

      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            minWidth: "1400px",
            width: "70vw", // Set the desired width
            // Set the desired height
            height: "auto",
            backgroundColor: "#F9FCFE",
          },
        }}
      >
        <DialogTitle>
          <label style={{ marginRight: 54 }}>Title:</label>
          <span style={{ marginLeft: 10 }}>
            {capitalizeFirstLetter(value.title)}
          </span>
        </DialogTitle>

        <DialogContent>
          <div>
            <label>Descriptioin:</label>
            <span style={{ fontWeight: 400 }}>
              {" "}
              {capitalizeFirstLetter(value.description)}
            </span>
          </div>

          <DialogContentText>
            <div className="modalContainer">
              <div className="infoContainer">
                <Paper
                  elevation={3}
                  sx={{ height: "auto", minHeight: 0, p: 2, borderRadius: 4 }}
                >
                  <div className="infoItem">
                    <label>School Name:</label>
                    <span>{value.school_name}</span>
                  </div>
                  <div className="infoItem">
                    <label>
                      {value.teacher_name != undefined
                        ? "Teacher Name"
                        : "Parent Name"}
                      :{" "}
                    </label>
                    <span>
                      {value.teacher_name != undefined
                        ? value.teacher_name
                        : value.father_name}
                    </span>
                  </div>
                  <div className="infoItem">
                    <label>
                      {value.teacher_id != undefined
                        ? "Mobile Teacher"
                        : "Mobile Parent"}
                      :{" "}
                    </label>
                    <span>
                      {value.teacher_name != undefined
                        ? mobileNumber
                        : mobileNumber}
                    </span>
                  </div>

                  <div className="infoItem">
                    <label>Mobile Admin:</label>
                    <span>{schoolData?.schoolDetail.mobile}</span>
                  </div>
                  <div className="infoItem">
                    <label>Admin Name:</label>
                    <span>{schoolData?.schoolDetail.admin_name}</span>
                  </div>

                  <div className="infoItem">
                    <label>Created On:</label>
                    <span>{dateToString(value.created_on.slice(0, 10))}</span>
                  </div>

                  <div className="infoItem">
                    <label>Status: </label>
                    {
                      <span className={`status-${value.status}`}>
                        {allStatus[value.status - 1].status_name}
                      </span>
                    }
                  </div>
                  {value.isrevoke && (
                    <div className="infoItem">
                      <label>Revoke: </label>
                      <ReportProblemIcon
                        style={{
                          color: "red",
                          fontWeight: "bold",
                          fontSize: 15,
                          marginLeft: 5,
                        }}
                      />
                    </div>
                  )}
                </Paper>
                {!isView && (
                  <div className="inputMessage">
                    <TextField
                      sx={{
                        borderColor: "black",
                      }}
                      autoFocus
                      margin="dense"
                      id="name"
                      value={requestMessage}
                      label="message"
                      type="email"
                      fullWidth
                      variant="outlined"
                      helperText="Enter the Message"
                      onChange={(e) => setRequestMessage(e.target.value)}
                    />
                  </div>
                )}
              </div>

              <div className="rightChatContainer">
                <Paper
                  elevation={3}
                  sx={{ height: "auto", minHeight: 0, p: 2, borderRadius: 4 }}
                >
                  <ChatIcon style={{ color: "blue" }} />
                  {adminChat.length === 0 && (
                    <div
                      style={{
                        width: "90%",
                        height: "auto",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      No chats
                    </div>
                  )}

                  {adminChat.length > 0 && (
                    <div className="chatContainer">
                      {adminChat.length > 0 &&
                        sortMessage(adminChat)?.map((message, index) => (
                          <div
                            className={`chatMessage ${
                              index % 2 === 0 ? "left" : "right"
                            }`}
                          >
                            <p>{message.messsages}</p>
                            <span>{formatTime(message.created_at)}</span>
                          </div>
                        ))}
                    </div>
                  )}
                </Paper>
              </div>
            </div>
          </DialogContentText>
        </DialogContent>
        {!isView && (
          <DialogActions>
            {value.status === 2 && (
              <button className="approveButton" onClick={handleResolve}>
                Resolved
              </button>
            )}
            {value.status === 2 && (
              <button className="cancelButton" onClick={handleRevoke}>
                Revoke
              </button>
            )}
          </DialogActions>
        )}
      </Dialog>
    </div>
  );
}
