import { useState } from "react";
import {
  Button,
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import axios from "axios";
import { GW_URL, superAdminConfig } from "../../config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ALL_ADMIN_FEEDBACK_FETCH_KEY } from "../../hooks/useFetchAllAdminFeedback";

const createTask = ({ admin_id, task, deadline }) => {
  return axios.post(
    `${GW_URL}/feedback/createTask`,
    {
      admin_id,
      task,
      deadline,
    },
    superAdminConfig
  );
};

const CreateTaskDialog = ({ open, handleClose, adminId, showStatus }) => {
  const [formData, setFormData] = useState({
    task: "",
    deadline: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ALL_ADMIN_FEEDBACK_FETCH_KEY });
      handleClose(true);
      showStatus({ success: true, fail: false });
    },
    onError: (err) => {
      showStatus({ success: false, fail: true });
    },
  });

  const handleTaskSubmit = (e) => {
    e.preventDefault();
    if (formData.task.trim() == "") {
      alert("Task is mandatory");
      return;
    } else if (formData.task.trim().length > 60) {
      alert("Task should be less than or equal to 60 characters");
      return;
    } else if (formData.deadline == "") {
      alert("Deadline is mandatory");
      return;
    }
    mutation.mutate({
      admin_id: adminId,
      task: formData.task,
      deadline: formData.deadline,
    });
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
          <label>Create Task</label>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            <form
              onSubmit={handleTaskSubmit}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <TextField
                style={{ marginBottom: "10px", marginTop: "10px" }}
                fullWidth
                value={formData.task}
                name="task"
                sx={{ flex: 1 }}
                label="Task"
                required
                helperText="Enter Task"
                onChange={handleChange}
              />
              <DatePicker
                fullWidth
                name="deadline"
                variant="outlined"
                type="date"
                format="DD/MM/YYYY"
                required
                disablePast
                value={formData.deadline}
                slotProps={{
                  textField: {
                    helperText: "Select Deadline Date",
                    fullWidth: true,
                  },
                }}
                onChange={(e) =>
                  setFormData((prevData) => ({ ...prevData, ["deadline"]: e }))
                }
              />
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
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CreateTaskDialog;
