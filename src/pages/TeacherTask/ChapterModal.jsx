import React, { useEffect, useState, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  TextField,
  Paper,
} from "@mui/material";
import "./EachTeacherTaskDetails.scss";
import {
  GW_URL,
  getIndianDate,
  colorHash,
  EachTaskStatus,
  TeacherTTtotalMark,
} from "../../config";
import ModalTaskCard from "./ModalTaskCard";
import { useParams } from "react-router-dom";
import {
  TEACHER_EACH_CHAPTER_DETAILS,
  useFetchTeacherEachChapterDetails,
} from "../../hooks/useFetchTeacherEachChapterDetails";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import axios from "axios";
import "./ChapterModal.scss";
import { ToastContainer, toast } from "react-toastify";
import Loader from "../../components/Loader/Loader";
import { CurrencyFranc } from "@mui/icons-material";

function addDaysToDate(dateString, daysToAdd) {
  const givenDate = new Date(dateString);
  const newDate = new Date(givenDate);
  newDate.setDate(newDate.getDate() + daysToAdd);

  return getIndianDate(newDate);
}

const ChapterModal = ({
  chapter,
  open,
  onClose,
  setTaskUpdated,
  teacher_id,
  taskUpdate,
}) => {
  const Render = () => {
    setTaskUpdated((prev) => !prev);
  };

  useEffect(() => {
    console.log(chapter);
  }, [chapter]);
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        style={{ backgroundColor: "#E4E4E4" }}
      >{`Chapter Name: ${chapter?.chapter_name}`}</DialogTitle>
      <DialogContent style={{ backgroundColor: "#E4E4E4" }}>
        {/* AssignmentSection */}

        <ModalTaskCard
          title={"Assignment"}
          total_mark={50}
          threshold_mark={40}
          link={chapter.assignment_link}
          mark={chapter.assignment_marks}
          status={chapter.assignment_status}
          deadline={addDaysToDate(chapter.chapter_start_time, 2)}
          chapter_id={chapter.chapter_id}
          chapter_number={chapter.chapter_number}
          chapter_name={chapter.chapter_name}
          teacher_id={teacher_id}
          setTaskUpdated={setTaskUpdated}
        />

        <ModalTaskCard
          title={"Demo"}
          total_mark={30}
          threshold_mark={25}
          link={chapter.demo_link}
          mark={chapter.demo_marks}
          status={chapter.demo_status}
          deadline={addDaysToDate(chapter.chapter_start_time, 4)}
          chapter_id={chapter.chapter_id}
          chapter_number={chapter.chapter_number}
          chapter_name={chapter.chapter_name}
          teacher_id={teacher_id}
          setTaskUpdated={setTaskUpdated}
        />
        <ModalTaskCard
          title={"Test"}
          total_mark={20}
          threshold_mark={15}
          link={chapter.test_link}
          mark={chapter.test_marks}
          status={chapter.test_status}
          deadline={addDaysToDate(chapter.chapter_start_time, 7)}
          chapter_id={chapter.chapter_id}
          chapter_number={chapter.chapter_number}
          chapter_name={chapter.chapter_name}
          teacher_id={teacher_id}
          setTaskUpdated={setTaskUpdated}
        />
        <CommetBox />
      </DialogContent>
    </Dialog>
  );
};
export default ChapterModal;

export const CommetBox = () => {
  const [comment, setComment] = useState("");
  const onChangeCommnet = (e) => {
    setComment(e.target.value);
  };
  const Updatecomment = () => {
    console.log(comment);
  };
  return (
    <div className="each-task-card-action">
      <TextField
        label="Comment"
        type="text"
        fullWidth
        name="comment"
        value={comment}
        onChange={onChangeCommnet}
      />
      <button onClick={Updatecomment} className="update-button">
        Comment
      </button>
    </div>
  );
};
