import { useState } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  TextField,
} from "@mui/material";
import {
  GW_URL,
  adminConfig,
  allFeedbackStatus,
  superAdminConfig,
} from "../../config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ALL_ADMIN_FEEDBACK_FETCH_KEY } from "../../hooks/useFetchAllAdminFeedback";
import axios from "axios";
import { getIndianTime } from "./FeedBackAdmin";

const changeStatus = ({ task_id, value, isHold }) => {
  if (isHold) {
    return axios.put(
      `${GW_URL}/feedback/${task_id}/changeTaskStatusFromHold`,
      {
        status: value,
      },
      adminConfig
    );
  } else {
    return axios.put(
      `${GW_URL}/feedback/${task_id}/changeTaskStatus`,
      {
        status: value,
      },
      adminConfig
    );
  }
};

const submitFeedBack = ({ task_id, feedback, value }) => {
  return axios.put(
    `${GW_URL}/feedback/${task_id}/changeTaskStatus`,
    {
      status: value,
      feedback,
    },
    adminConfig
  );
};

const ChangeStatusSuperAdmin = ({
  open,
  handleClose,
  adminId,
  taskDetails,
  showStatus,
}) => {
  const [status, setStatus] = useState({
    status_id: allFeedbackStatus.filter(
      (a) => a.status_name == taskDetails?.status
    )[0]?.status_id,
    status_name: allFeedbackStatus.filter(
      (a) => a.status_name == taskDetails?.status
    )[0]?.status_name,
  });
  const initialStatus = allFeedbackStatus.filter(
    (a) => a.status_name == taskDetails?.status
  )[0]?.status_id;
  const [formData, setFormData] = useState({
    feedback: "",
  });
  const updatedFeedbackStatus =
    status.status_id != 0
      ? allFeedbackStatus.filter((a) => a.status_id != 0)
      : allFeedbackStatus;

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: changeStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ALL_ADMIN_FEEDBACK_FETCH_KEY],
      });
      showStatus({ success: true, fail: false });
      handleClose(true);
    },
    onError: (err) => {
      showStatus({ success: false, fail: true });
    },
  });

  const submitFeedbackMutation = useMutation({
    mutationFn: submitFeedBack,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ALL_ADMIN_FEEDBACK_FETCH_KEY],
      });
      showStatus({ success: true, fail: false });
      handleClose(true);
    },
    onError: (err) => {
      showStatus({ success: false, fail: true });
    },
  });

  const handleStatusChange = (e) => {
    const { name, value } = e.target;
    setStatus((prevData) => ({
      ...prevData,
      status_id: value,
      status_name: name,
    }));
    // mutation.mutate({ task_id: taskDetails?.task_id, value: value });
  };

  const handleFeedBackSubmit = (e) => {
    e.preventDefault();
    // on change the status to hold
    if (status.status_id == 2 || status.status_id == 3) {
      if (formData.feedback.trim() == "") {
        alert("Please enter feedback");
        return;
      } else if (formData.feedback.trim().length > 300) {
        alert("Please enter feedback within 300 characters");
        return;
      }
      if (status.status_id == 2) {
        submitFeedbackMutation.mutate({
          task_id: taskDetails?.task_id,
          value: status.status_id,
          feedback:
            taskDetails.feedback == null
              ? "By superadmin - Hold - " +
                getIndianTime(new Date()).toJSON().slice(0, 10) +
                " - " +
                formData.feedback
              : taskDetails.feedback +
                " By superadmin - Hold - " +
                getIndianTime(new Date()).toJSON().slice(0, 10) +
                " - " +
                formData.feedback,
        });
      } else {
        submitFeedbackMutation.mutate({
          task_id: taskDetails?.task_id,
          value: status.status_id,
          feedback:
            taskDetails.feedback == null
              ? "By superadmin - Completed - " +
                getIndianTime(new Date()).toJSON().slice(0, 10) +
                " - " +
                formData.feedback
              : taskDetails.feedback +
                " By superadmin - Completed - " +
                getIndianTime(new Date()).toJSON().slice(0, 10) +
                " - " +
                formData.feedback,
        });
      }
    } else {
      mutation.mutate({
        task_id: taskDetails?.task_id,
        value: status.status_id,
        isHold: initialStatus == 2,
      });
    }
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxWidth: "1400px",
            width: "50%",
            height: "auto",
          },
        }}
      >
        <DialogTitle>
          <label>Task Details</label>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <div className="task-details">
              <div className="each-details">
                <span className="heading-name">Admin name: </span>
                <span>{taskDetails?.admin_name}</span>
              </div>
              <div className="each-details">
                <span className="heading-name">Task: </span>
                <span>{taskDetails?.task}</span>
              </div>
              <div className="each-details">
                <span className="heading-name">Original Deadline: </span>
                <span>{taskDetails?.original_deadline}</span>
              </div>
              <div className="each-details">
                <span className="heading-name">New Deadline: </span>
                <span>{taskDetails?.new_deadline}</span>
              </div>
              {taskDetails?.feedback?.length > 0 && (
                <div className="each-details">
                  <span className="heading-name">Feedback: </span>
                  <span>{taskDetails?.feedback}</span>
                </div>
              )}
              <div>
                {
                  <form
                    onSubmit={handleFeedBackSubmit}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      name="status"
                      label="Status"
                      select
                      value={status.status_id}
                      onChange={handleStatusChange}
                      fullWidth
                      // helperText="Note: You don't need to submit after status change. It will automatically change."
                      margin="normal"
                    >
                      {updatedFeedbackStatus.map((option) => (
                        <MenuItem
                          key={option.status_id}
                          value={option.status_id}
                        >
                          {option.status_name}
                        </MenuItem>
                      ))}
                    </TextField>
                    {(status.status_id == 2 || status.status_id == 3) && (
                      <>
                        <TextField
                          style={{ marginTop: "10px", marginBottom: "10px" }}
                          fullWidth
                          multiline
                          value={formData.feedback}
                          name="feedback"
                          sx={{ flex: 1 }}
                          label="Feedback"
                          required
                          helperText="Enter Feedback"
                          onChange={(e) =>
                            setFormData((prevData) => ({
                              ...prevData,
                              ["feedback"]: e.target.value,
                            }))
                          }
                        />
                      </>
                    )}
                    <Button
                      fullWidth
                      sx={{ padding: "1.4em" }}
                      variant="contained"
                      type="submit"
                      color="primary"
                    >
                      Submit
                    </Button>
                  </form>
                }
              </div>
            </div>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ChangeStatusSuperAdmin;
