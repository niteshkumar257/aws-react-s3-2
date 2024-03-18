import { useState, react, useEffect } from "react";
import axios from "axios";
import {
  GW_URL,
  TeacherTTtotalMark,
  EachTaskStatus,
  colorHash,
} from "../../config";
import Loader from "../../components/Loader/Loader";
import { ToastContainer, toast } from "react-toastify";
import { TextField } from "@mui/material";

export const ModalTaskCard = ({
  total_mark,
  threshold_mark,
  link,
  mark,
  status,
  title,
  deadline,
  chapter_id,
  chapter_number,
  teacher_id,
  setTaskUpdated,
}) => {
  const [updatedMark, setUpdateMark] = useState("");
  const [markUploadLoading, setMarkUploadLoading] = useState(false);

  const Render = () => {
    setTaskUpdated((prev) => !prev);
  };

  const updateMarkHandler = (e) => {
    setUpdateMark(e.target.value);
  };
  const UpdateTTScore = (title) => {
    if (!updatedMark) return toast.warning("Please Provide the Mark");
    let task = title.charAt(0).toLowerCase() + title.slice(1) + "_" + "marks";

    const body = {
      [task]: updatedMark,
      chapter_number: chapter_number,
      chapter_id: chapter_id,
    };
    let index = 0;
    if (title === "Assignment") index = 0;
    else if (title === "Demo") index = 1;
    else index = 2;
    let thresholdValue = TeacherTTtotalMark[index];

    if (thresholdValue < updatedMark) {
      return toast.error("Mark cannot be more then Total mark");
    }
    // Actions happesn here

    setMarkUploadLoading(true);
    axios
      .put(
        `${GW_URL}/teacher/${teacher_id}/updateChapterMarksBySuperAdmin`,
        body
      )
      .then((res) => {
        setMarkUploadLoading(false);
        toast.success(res.data.message);
        setTaskUpdated((prev) => !prev);
      })
      .catch((err) => {
        console.log(err);
        setMarkUploadLoading(false);
        toast.error("Something went wrong");
      });
  };
  useEffect(() => {}, [
    updatedMark
  ]);

  return (
    <div
      style={{ border: `2px solid ${colorHash[status]}` }}
      className="each-task-card-container"
    >
      <div className="each-task-card-heading">
        <span>{title}</span>
      </div>

      <div className="each-task-card-info">
        <span>Total mark : {total_mark}</span>
        <span>Dead Line : {deadline}</span>
        <span>Threshold : {threshold_mark}</span>
        <span style={{ color: colorHash[status] }}>
          Status : {EachTaskStatus(status)}{" "}
        </span>
        <span style={{ color: colorHash[status] }}>
          Link : {link ? link : "No submission Yet"}{" "}
        </span>
        {link && mark > 0 && <span>Mark Obtained : {mark} </span>}
      </div>
      {link && status === 1 && (
        <div className="each-task-card-action">
          <TextField
            label="Update Score"
            type="text"
            fullWidth
            name="Update Score"
            value={updatedMark}
            onChange={updateMarkHandler}
          />
          <button
            disabled={markUploadLoading}
            onClick={() => UpdateTTScore(title)}
            className="update-button"
          >
            Update
          </button>
        </div>
      )}
      <Loader open={markUploadLoading} />
    </div>
  );
};
export default ModalTaskCard;
