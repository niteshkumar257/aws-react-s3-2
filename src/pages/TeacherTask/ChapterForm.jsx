import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
} from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";
import { GW_URL, adminConfig } from "../../config";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ALL_TEACHER_CHAPTER } from "../../hooks/useFetchAllTeacherChapter";
import { useParams } from "react-router-dom";

const addChapter = ({
  teacher_id,
  chapter_no,
  chapter_name,
  first_task_deadline,
  first_task_passing_score,
  first_task_totalscore,
  second_task_date,
  second_task_passing_score,
  second_task_totalscore,
  second_task_meetlink,
  third_task_deadline,
  third_task_testlink,
  third_task_passing_score,
  third_task_totalscore,
}) => {
  return axios.post(
    `${GW_URL}/teacher/${teacher_id}/createChapter`,
    {
      chapter_no,
      chapter_name,
      first_task_deadline,
      first_task_passing_score,
      first_task_totalscore,
      second_task_date,
      second_task_passing_score,
      second_task_totalscore,
      second_task_meetlink,
      third_task_deadline,
      third_task_testlink,
      third_task_passing_score,
      third_task_totalscore,
    },
    adminConfig
  );
};

const ChapterForm = ({ open, handleClose, chapterNo }) => {
  const { teacherId: teacher_id } = useParams();
  const [chapterName, setChapterName] = useState("");
  const [assignmentSubmission, setAssignmentSubmission] = useState({
    deadline: "",
    passingScore: "",
    totalScore: "",
  });
  const [demoSubmission, setDemoSubmission] = useState({
    date: "",
    passingScore: "",
    totalScore: "",
    meetLink: "",
  });
  const [onlineTest, setOnlineTest] = useState({
    testDate: "",
    testLink: "",
    passingScore: "",
    totalScore: "",
  });

  const handleChapterNameChange = (e) => {
    setChapterName(e.target.value);
  };

  const handleAssignmentSubmissionChange = (e) => {
    setAssignmentSubmission({
      ...assignmentSubmission,
      [e.target.name]: e.target.value,
    });
  };

  const handleDemoSubmissionChange = (e) => {
    setDemoSubmission({
      ...demoSubmission,
      [e.target.name]: e.target.value,
    });
  };

  const handleOnlineTestChange = (e) => {
    setOnlineTest({
      ...onlineTest,
      [e.target.name]: e.target.value,
    });
  };

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: addChapter,
    onSuccess: () => {
      queryClient.invalidateQueries(ALL_TEACHER_CHAPTER);

      setAssignmentSubmission({
        deadline: "",
        passingScore: "",
        totalScore: "",
      });

      setDemoSubmission({
        date: "",
        passingScore: "",
        totalScore: "",
        meetLink: "",
      });

      setOnlineTest({
        testDate: "",
        testLink: "",
        passingScore: "",
        totalScore: "",
      });

      setChapterName("");

      toast.success("Chapter Added Successfully!", {
        position: "top-center",
        autoClose: 2000,
        theme: "dark",
      });
      handleClose();
    },
    onError: () => {
      toast.error("Something went wrong!", {
        position: "top-center",
        autoClose: 2000,
        theme: "dark",
      });
    },
  });

  const handleSave = () => {
    if (
      !chapterName ||
      !assignmentSubmission.deadline ||
      !assignmentSubmission.passingScore ||
      !assignmentSubmission.totalScore ||
      !demoSubmission.date ||
      !demoSubmission.passingScore ||
      !demoSubmission.totalScore ||
      !demoSubmission.meetLink ||
      !onlineTest.testDate ||
      !onlineTest.testLink ||
      !onlineTest.passingScore ||
      !onlineTest.totalScore
    ) {
      toast.error("Please fill out all fields.");
      return;
    }
    // If all fields are filled, proceed with saving data.
    mutation.mutate({
      teacher_id,
      chapter_no: chapterNo,
      chapter_name: chapterName,
      first_task_deadline: assignmentSubmission.deadline,
      first_task_passing_score: assignmentSubmission.passingScore,
      first_task_totalscore: assignmentSubmission.totalScore,
      second_task_date: demoSubmission.date,
      second_task_passing_score: demoSubmission.passingScore,
      second_task_totalscore: demoSubmission.totalScore,
      second_task_meetlink: demoSubmission.meetLink,
      third_task_deadline: onlineTest.testDate,
      third_task_testlink: onlineTest.testLink,
      third_task_passing_score: onlineTest.passingScore,
      third_task_totalscore: onlineTest.totalScore,
    });
  };

  return (
    <div>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Add Chapter</DialogTitle>
        <DialogContent>
          <TextField
            label="Chapter Name"
            fullWidth
            sx={{ marginTop: "10px" }}
            value={chapterName}
            onChange={handleChapterNameChange}
          />
          <form>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <h3>Assignment Submission</h3>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Deadline"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  name="deadline"
                  value={assignmentSubmission.deadline}
                  onChange={handleAssignmentSubmissionChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Passing Score"
                  type="number"
                  fullWidth
                  name="passingScore"
                  value={assignmentSubmission.passingScore}
                  onChange={handleAssignmentSubmissionChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Total Score"
                  type="number"
                  fullWidth
                  name="totalScore"
                  value={assignmentSubmission.totalScore}
                  onChange={handleAssignmentSubmissionChange}
                />
              </Grid>
            </Grid>

            {/* Demo Submission */}
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <h3>Demo Submission</h3>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  name="date"
                  value={demoSubmission.date}
                  onChange={handleDemoSubmissionChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Passing Score"
                  type="number"
                  fullWidth
                  name="passingScore"
                  value={demoSubmission.passingScore}
                  onChange={handleDemoSubmissionChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Total Score"
                  type="number"
                  fullWidth
                  name="totalScore"
                  value={demoSubmission.totalScore}
                  onChange={handleDemoSubmissionChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Meet Link"
                  fullWidth
                  name="meetLink"
                  value={demoSubmission.meetLink}
                  onChange={handleDemoSubmissionChange}
                />
              </Grid>
            </Grid>

            {/* Online Test */}
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <h3>Online Test</h3>
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Test Date"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                  name="testDate"
                  value={onlineTest.testDate}
                  onChange={handleOnlineTestChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Test Link"
                  fullWidth
                  name="testLink"
                  value={onlineTest.testLink}
                  onChange={handleOnlineTestChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Passing Score"
                  type="number"
                  fullWidth
                  name="passingScore"
                  value={onlineTest.passingScore}
                  onChange={handleOnlineTestChange}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Total Score"
                  type="number"
                  fullWidth
                  name="totalScore"
                  value={onlineTest.totalScore}
                  onChange={handleOnlineTestChange}
                />
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
          <Button onClick={handleSave} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
      <ToastContainer />
    </div>
  );
};

export default ChapterForm;
