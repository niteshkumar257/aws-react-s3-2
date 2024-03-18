import React, { useState, useEffect } from "react";
import DataTable from "../../components/SuperAdminTable/SuperAdminTable";
import axios from "axios";
import "./Mentor.scss";
import { GW_URL, superAdminConfig } from "../../config";
import useFetchAllMentorSchedule, {
  ALL_MENTOR_SCHEDULE_KEY,
} from "../../hooks/useFetchAllMentorSchedule";
import SuperAdminTable from "../../components/SuperAdminTable/SuperAdminTable";
import dayjs from "dayjs";
import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ToastContainer, toast } from "react-toastify";

const columns = [
  { field: "id", headerName: "S No.", width: 220, flex: 1 },
  {
    field: "request_id",
    headerName: "Request Id",
    hide: true,
    width: 50,
    flex: 1,
    headerAlign: "left",
    align: "left",
  },
  {
    field: "mentor_id",
    headerName: "Mentor Id",
    hide: true,
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
    field: "schedule_time",
    headerName: "Schedule Time",
    editable: false,
    width: 150,
    flex: 1,
    headerAlign: "left",
    align: "left",
  },
  {
    field: "status",
    headerName: "Status",
    editable: false,
    width: 150,
    flex: 1,
    headerAlign: "left",
    align: "left",
  },
];

const updateMentorRequest = ({ formData, requestId }) => {
  return axios.put(
    `${GW_URL}/mentor/updateSlot`,
    {
      schedule_date: formData.date,
      schedule_time: formData.time,
      status: formData.status,
      meet_link: formData.meeturl,
      request_id: requestId,
    },
    superAdminConfig
  );
};

const Mentor = () => {
  const [rows, setRows] = useState([]);
  const [open, setOpen] = useState(false);
  const [mentorId, setMentorId] = useState("");
  const [status, setStatus] = useState("");
  const [requestId, setRequestId] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [formData, setFormData] = useState({
    date: new Date(),
    time: "",
    status: "",
    meeturl: "",
  });

  const [apiData, setApiData] = useState({
    bookedSlots: [],
    timeIntervals: [],
  });

  const { isLoading, data } = useFetchAllMentorSchedule();

  const generateTimeOptions = () => {
    const { bookedSlots } = apiData;
    let startTime = "09:00:00";
    let endTime = "18:00:00";
    const bookedTimes = new Set();
    const availableTimeSlots = [];
    let currentTime = startTime;

    while (currentTime <= endTime) {
      let isBooked = false;

      for (const slot of bookedSlots) {
        const { time, fortime } = slot;
        const [slotHours, slotMinutes, slotSeconds] = time
          .split(":")
          .map(Number);
        let totalSlotSeconds =
          slotHours * 3600 + slotMinutes * 60 + slotSeconds;

        const [currentHours, currentMinutes, currentSeconds] = currentTime
          .split(":")
          .map(Number);
        const totalCurrentSeconds =
          currentHours * 3600 + currentMinutes * 60 + currentSeconds;

        if (
          totalCurrentSeconds >= totalSlotSeconds &&
          totalCurrentSeconds < totalSlotSeconds + fortime * 60
        ) {
          isBooked = true;
          break;
        }
      }

      if (!isBooked) {
        availableTimeSlots.push(currentTime);
      }

      const [hours, minutes, seconds] = currentTime.split(":").map(Number);
      let totalSeconds = hours * 3600 + minutes * 60 + seconds;
      totalSeconds += 900; // 15 minutes in seconds
      const nextHours = Math.floor(totalSeconds / 3600);
      const remainingSeconds = totalSeconds % 3600;
      const nextMinutes = Math.floor(remainingSeconds / 60);
      const nextSeconds = remainingSeconds % 60;
      currentTime = `${String(nextHours).padStart(2, "0")}:${String(
        nextMinutes
      ).padStart(2, "0")}:${String(nextSeconds).padStart(2, "0")}`;
    }
    return availableTimeSlots;
  };

  useEffect(() => {
    if (!isLoading) {
      const allMentorSchedule = [];
      const schedules = data.data?.allMentorSchedule;
      let i = 1;
      schedules.forEach((schedule) => {
        let request_date = dayjs(schedule.request_date).format("DD-MM-YYYY");
        let schedule_date = schedule.schedule_date
          ? dayjs(schedule.schedule_date).format("DD-MM-YYYY")
          : "-";
        let schedule_time = schedule.schedule_time
          ? schedule.schedule_time
          : "-";
        allMentorSchedule.push({
          ...schedule,
          id: i,
          request_date,
          schedule_date,
          schedule_time,
        });
        i++;
      });
      setRows(allMentorSchedule);
    }
  }, [data]);

  useEffect(() => {
    if (requestId != "") {
      const fetchData = async () => {
        try {
          const res = await axios.get(
            `${GW_URL}/mentor/${requestId}/requestDetails`,
            superAdminConfig
          );
          if (res.status == 500) {
            return;
          }

          setFormData(res.data.requestDetails);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchData();
    }
  }, [requestId]);

  const queryClient = useQueryClient();
  const mutataion = useMutation({
    mutationFn: updateMentorRequest,
    onSuccess: () => {
      queryClient.invalidateQueries(ALL_MENTOR_SCHEDULE_KEY);
      toast.success("Mentor request updated successfully!", {
        position: "top-center",
        autoClose: 2000,
        theme: "dark",
      });
      setFormData({
        date: new Date(),
        time: "",
        status: "",
        meeturl: "",
      });
    },
    onError: () => {
      toast.error("Something went wrong", {
        position: "top-center",
        theme: "dark",
        autoClose: 2000,
      });
      setFormData({
        date: new Date(),
        time: "",
        status: "",
        meeturl: "",
      });
    },
  });

  useEffect(() => {
    if (mentorId != "") {
      const fetchData = async () => {
        try {
          const res = await axios.get(
            `${GW_URL}/mentor/${mentorId}/getMentorSchedules?scheduleDate=${formData.date}`,
            superAdminConfig
          );
          if (res.status == 500) {
            return;
          }
          setApiData({
            bookedSlots: res.data.bookedSlots,
            timeIntervals: res.data.timeIntervals,
          });
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
      fetchData();
    }
  }, [formData.date]);

  useEffect(() => {
    setAvailableSlots(generateTimeOptions());
  }, [apiData.bookedSlots]);

  const isTimeBooked = (time) => {
    const { bookedSlots } = apiData;
    return bookedSlots.some((slot) => slot.time === time);
  };

  const handleOpen = (selectedRow) => {
    setOpen(true);
    setMentorId(selectedRow.mentor_id);
    setStatus(selectedRow.status);
    setRequestId(selectedRow.request_id);
  };

  const handleClose = () => {
    setOpen(false);
    setMentorId("");
    setRequestId("");
    setFormData({
      date: new Date(),
      time: "",
      status: "",
      meeturl: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    if (formData.date == "") {
      toast.error("Date not selected!", {
        position: "top-center",
        theme: "dark",
        autoClose: 2000,
      });
      return;
    }
    if (formData.time == "") {
      toast.error("Time not selected!", {
        position: "top-center",
        theme: "dark",
        autoClose: 2000,
      });
      return;
    }
    if (formData.meeturl == "") {
      toast.error("Meet Link not given!", {
        position: "top-center",
        theme: "dark",
        autoClose: 2000,
      });
      return;
    }
    mutataion.mutate({ formData, requestId });
    handleClose();
  };

  const updateColumn = [
    {
      field: "Update",
      headerName: "Action",
      sortable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <div>
            <div className="UpdateButton">
              <button
                onClick={() => {
                  handleOpen(params.row);
                }}
              >
                Update
              </button>
            </div>
            <Modal
              open={open}
              onClose={handleClose}
              aria-labelledby="modal-title"
              aria-describedby="modal-description"
              className="modal-container"
            >
              <div className="modal-paper larger-modal">
                <h2 id="modal-title">Schedule Meeting</h2>
                <form>
                  <DatePicker
                    label="Date"
                    name="date"
                    value={dayjs(formData.date)}
                    onChange={(date) => setFormData({ ...formData, date })}
                    fullWidth
                    disablePast
                    className="form-field"
                    renderInput={(params) => <TextField {...params} />}
                    format="DD-MM-YYYY"
                  />
                  <FormControl fullWidth className="form-field">
                    <InputLabel>Status</InputLabel>
                    <Select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                    >
                      {status == "PENDING" && (
                        <MenuItem value="PENDING">Pending</MenuItem>
                      )}
                      <MenuItem value="SCHEDULED">Scheduled</MenuItem>
                      <MenuItem value="COMPLETED">Completed</MenuItem>
                    </Select>
                  </FormControl>
                  {status == "PENDING" && (
                    <TextField
                      label="Time"
                      select
                      name="time"
                      value={formData.time}
                      onChange={handleChange}
                      fullWidth
                      className="form-field"
                      // error={isTimeBooked(formData.time)}
                      // helperText={isTimeBooked(formData.time) ? 'This time is already booked' : ''}
                    >
                      {availableSlots?.map((availableTime) => (
                        <MenuItem key={availableTime} value={availableTime}>
                          {availableTime}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                  <TextField
                    label="Meeting URL"
                    variant="outlined"
                    fullWidth
                    name="meeturl"
                    value={formData.meeturl}
                    onChange={handleChange}
                    placeholder="https://example.com/meeting"
                    helperText="Enter the URL for meeting"
                  />
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleSubmit}
                    fullWidth
                    className="submit-button"
                  >
                    Schedule
                  </Button>
                </form>
              </div>
            </Modal>
          </div>
        );
      },
    },
  ];

  return (
    <div className="mentor-schedule-container">
      <div className="mentor-schedule">
        <span className="mentor-schedule-heading">Mentor Schedules</span>
        <DataTable
          width={800}
          rows={rows}
          columns={columns.concat(updateColumn)}
          loader={isLoading}
          emptyRowsMessage={"No Mettings details"}
        />
        <div className="mentor-schedules-table "></div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Mentor;
