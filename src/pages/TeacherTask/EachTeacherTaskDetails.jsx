import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  TextField,
  Paper,
} from "@mui/material";
import "./EachTeacherTaskDetails.scss";
import { GW_URL, getIndianDate } from "../../config";
import { useParams } from "react-router-dom";
import {
  TEACHER_EACH_CHAPTER_DETAILS,
  useFetchTeacherEachChapterDetails,
} from "../../hooks/useFetchTeacherEachChapterDetails";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import axios from "axios";

const addTeacherMark = ({
  teacher_id,
  chapter_no,
  first_task_score,
  second_task_score,
  third_task_score,
}) => {
  if (first_task_score != undefined) {
    return axios.put(
      `${GW_URL}/teacher/${teacher_id}/addTeacherScore?chapter_no=${chapter_no}&first_task_score=${first_task_score}`
    );
  } else if (second_task_score != undefined) {
    return axios.put(
      `${GW_URL}/teacher/${teacher_id}/addTeacherScore?chapter_no=${chapter_no}&second_task_score=${second_task_score}`
    );
  } else if (third_task_score != undefined) {
    return axios.put(
      `${GW_URL}/teacher/${teacher_id}/addTeacherScore?chapter_no=${chapter_no}&third_task_score=${third_task_score}`
    );
  }
};

const EachTeacherTaskDetails = ({ open, onClose, chapter }) => {
  const { teacherId: teacher_id } = useParams();

  const [chapterDetails, setChapterDetails] = useState({});
  const [firstTaskPrevScore, setFirstTaskPrevScore] = useState([]);
  const [secondTaskPrevScore, setSecondTaskPrevScore] = useState([]);
  const [thirdTaskPrevScore, setThirdTaskPrevScore] = useState([]);

  const [firstCurrScore, setFirstCurrScore] = useState({});

  const [firstTaskScore, setFirstTaskScore] = useState("");
  const [secondTaskScore, setSecondTaskScore] = useState("");
  const [thirdTaskScore, setThirdTaskScore] = useState("");

  const [secondTaskOpen, setSecondTaskOpen] = useState(false);
  const [thirdTaskOpen, setThirdTaskOpen] = useState(false);

  const {
    isLoading: teacherEachChapterDetailsLoading,
    data: teacherEachChapterDetails,
  } = useFetchTeacherEachChapterDetails({
    teacher_id,
    chapter_no: chapter.chapter_no,
  });

  // post request for mark
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: addTeacherMark,
    onSuccess: () => {
      queryClient.invalidateQueries(TEACHER_EACH_CHAPTER_DETAILS);
      setFirstTaskScore("");
      setSecondTaskScore("");
      setThirdTaskScore("");
      setFirstCurrScore({});
      toast.success("Mark Added Successfully!", {
        position: "top-center",
        autoClose: 2000,
        theme: "dark",
      });
    },
    onError: (err) => {
      toast.error("Something went wrong!", {
        position: "top-center",
        autoClose: 2000,
        theme: "dark",
      });
    },
  });

  // on open the popup set the markfield to its default value
  useEffect(() => {
    if (open) {
      setFirstTaskScore("");
      setSecondTaskScore("");
      setThirdTaskScore("");
    }
  }, [open]);

  // data preprocessing done
  useEffect(() => {
    if (!teacherEachChapterDetailsLoading) {
      let chapterDetails =
        teacherEachChapterDetails?.data?.teacherChapterProgressDetails;

      let currentDate = getIndianDate(new Date());
      let firstDeadline = getIndianDate(chapterDetails?.first_task_deadline);
      let secondDeadline = getIndianDate(chapterDetails?.second_task_date);

      if (
        firstDeadline < currentDate ||
        chapterDetails?.all_task_status[0] == 1
      ) {
        setSecondTaskOpen(true);
      } else {
        setSecondTaskOpen(false);
      }
      if (
        secondDeadline < currentDate ||
        chapterDetails?.all_task_status[1] == 1
      ) {
        setThirdTaskOpen(true);
      } else {
        setThirdTaskOpen(false);
      }

      let firstTask = [],
        secondTask = [],
        thirdTask = [];

      if (
        chapterDetails?.notes_pdf?.length >
        chapterDetails?.first_task_score?.length
      ) {
        setFirstCurrScore({
          total_score: chapterDetails?.first_task_totalscore,
          notes_submitted_on: getIndianDate(
            chapterDetails?.uploaded_on[chapterDetails?.notes_pdf?.length - 1]
          ),
          notes_link:
            chapterDetails?.notes_pdf[chapterDetails?.notes_pdf?.length - 1],
          solution_submitted_on: getIndianDate(
            chapterDetails?.uploaded_on[
              chapterDetails?.solution_pdf?.length - 1
            ]
          ),
          solution_link:
            chapterDetails?.solution_pdf[
              chapterDetails?.solution_pdf?.length - 1
            ],
        });
        for (let i = 0; i < chapterDetails?.notes_pdf?.length - 1; i++) {
          firstTask.push({
            attemp_no: i + 1,
            score: chapterDetails?.first_task_score[i],
            total_score: chapterDetails?.first_task_totalscore,
            notes_submitted_on: getIndianDate(chapterDetails?.uploaded_on[i]),
            notes_link: chapterDetails?.notes_pdf[i],
            solution_submitted_on: getIndianDate(
              chapterDetails?.uploaded_on[i]
            ),
            solution_link: chapterDetails?.solution_pdf[i],
          });
        }
      } else {
        for (let i = 0; i < chapterDetails?.notes_pdf?.length; i++) {
          firstTask.push({
            attemp_no: i + 1,
            score: chapterDetails?.first_task_score[i],
            total_score: chapterDetails?.first_task_totalscore,
            notes_submitted_on: getIndianDate(chapterDetails?.uploaded_on[i]),
            notes_link: chapterDetails?.notes_pdf[i],
            solution_submitted_on: getIndianDate(
              chapterDetails?.uploaded_on[i]
            ),
            solution_link: chapterDetails?.solution_pdf[i],
          });
        }
      }

      for (let i = 0; i < chapterDetails?.second_task_score?.length; i++) {
        secondTask.push({
          attemp_no: i + 1,
          score: chapterDetails?.second_task_score[i],
          total_score: chapterDetails?.second_task_totalscore,
          date: getIndianDate(chapterDetails?.second_task_score_updated_on[i]),
        });
      }

      for (let i = 0; i < chapterDetails?.third_task_score?.length; i++) {
        thirdTask.push({
          attemp_no: i + 1,
          score: chapterDetails?.third_task_score[i],
          total_score: chapterDetails?.third_task_totalscore,
          date: getIndianDate(chapterDetails?.third_task_score_updated_on[i]),
        });
      }

      let first_task_score_updated_on = [],
        second_task_score_updated_on = [],
        third_task_score_updated_on = [],
        uploaded_on = [];

      for (
        let i = 0;
        i < chapterDetails?.first_task_score_updated_on?.length;
        i++
      ) {
        first_task_score_updated_on.push(
          getIndianDate(chapterDetails?.first_task_score_updated_on[i])
        );
      }

      for (
        let i = 0;
        i < chapterDetails?.second_task_score_updated_on?.length;
        i++
      ) {
        second_task_score_updated_on.push(
          getIndianDate(chapterDetails?.second_task_score_updated_on[i])
        );
      }

      for (
        let i = 0;
        i < chapterDetails?.third_task_score_updated_on?.length;
        i++
      ) {
        third_task_score_updated_on.push(
          getIndianDate(chapterDetails?.third_task_score_updated_on[i])
        );
      }

      for (let i = 0; i < chapterDetails?.uploaded_on?.length; i++) {
        uploaded_on.push(getIndianDate(chapterDetails?.uploaded_on[i]));
      }

      setFirstTaskPrevScore(firstTask);
      setSecondTaskPrevScore(secondTask);
      setThirdTaskPrevScore(thirdTask);

      setChapterDetails({
        ...chapterDetails,
        first_task_score_updated_on,
        second_task_score_updated_on,
        third_task_score_updated_on,
        first_task_deadline: getIndianDate(chapterDetails?.first_task_deadline),
        second_task_date: getIndianDate(chapterDetails?.second_task_date),
        third_task_deadline: getIndianDate(chapterDetails?.third_task_deadline),
      });
    }
  }, [teacherEachChapterDetailsLoading, teacherEachChapterDetails]);

  console.log(chapterDetails);
  const handleFirstScoreTaskSubmit = (e) => {
    e.preventDefault();
    if (firstTaskScore.length == 0) {
      toast.error("Mark is required!", {
        position: "top-center",
        autoClose: 2000,
        theme: "dark",
      });
      return;
    }

    mutation.mutate({
      teacher_id,
      chapter_no: chapter.chapter_no,
      first_task_score: firstTaskScore,
    });
  };

  const handleSecondScoreTaskSubmit = (e) => {
    e.preventDefault();
    if (secondTaskScore.length == 0) {
      toast.error("Mark is required!", {
        position: "top-center",
        autoClose: 2000,
        theme: "dark",
      });
      return;
    }

    mutation.mutate({
      teacher_id,
      chapter_no: chapter.chapter_no,
      second_task_score: secondTaskScore,
    });
  };

  const handleThirdScoreTaskSubmit = (e) => {
    e.preventDefault();
    if (thirdTaskScore.length == 0) {
      toast.error("Mark is required!", {
        position: "top-center",
        autoClose: 2000,
        theme: "dark",
      });
      return;
    }

    mutation.mutate({
      teacher_id,
      chapter_no: chapter.chapter_no,
      third_task_score: thirdTaskScore,
    });
  };

  // Open PDF
  const openPDF = (link) => {
    window.open(link);
  };

  if (teacherEachChapterDetailsLoading) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle
          style={{ backgroundColor: "#E4E4E4" }}
        >{`Loading...`}</DialogTitle>
        <DialogContent style={{ backgroundColor: "#E4E4E4" }}>
          {/* You can customize the loader here, e.g., display a spinner or loading message */}
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle
        style={{ backgroundColor: "#E4E4E4" }}
      >{`Chapter Name: ${chapter.chapter_name}`}</DialogTitle>
      <DialogContent style={{ backgroundColor: "#E4E4E4" }}>
        <Paper
          elevation={3}
          style={{
            padding: "20px",
            backgroundColor: "#E4E4E4",
            marginTop: "10px",
          }}
        >
          {/* AssignmentSection */}
          <section>
            <div className="section">
              <h2>Assignment Submission</h2>
              <h2 style={{ color: "red" }}>
                Deadline: {chapterDetails.first_task_deadline}
              </h2>
            </div>
            <div className="assignments-submission">
              {firstTaskPrevScore?.map((scores) => (
                <div className="rows prev-attemp">
                  <p>Attemp {scores.attemp_no}:</p>
                  <p>
                    Score: {scores.score}/{scores.total_score}
                  </p>
                  <p>Date: {scores.notes_submitted_on}</p>
                  <p>
                    Notes:{" "}
                    <Button
                      variant="contained"
                      style={{
                        padding: "10px",
                        width: "fit-content",
                        color: "white",
                        backgroundColor: "#1377C0",
                      }}
                      onClick={() => openPDF(scores.notes_link)}
                    >
                      Link
                    </Button>
                  </p>
                  <p>
                    Solution:{" "}
                    <Button
                      variant="contained"
                      style={{
                        padding: "10px",
                        width: "fit-content",
                        color: "white",
                        backgroundColor: "#1377C0",
                      }}
                      onClick={() => openPDF(scores.solution_link)}
                    >
                      Link
                    </Button>
                  </p>
                </div>
              ))}

              {firstCurrScore.notes_submitted_on && (
                <div className="rows current-attemp">
                  <p>Current:</p>
                  <p></p>
                  <p>Date: {firstCurrScore.notes_submitted_on}</p>
                  <p>
                    Notes:{" "}
                    <Button
                      variant="contained"
                      style={{
                        padding: "10px",
                        width: "fit-content",
                        color: "white",
                        backgroundColor: "#1377C0",
                      }}
                      onClick={() => openPDF(firstCurrScore.notes_link)}
                    >
                      Link
                    </Button>
                  </p>
                  <p>
                    Solution:{" "}
                    <Button
                      variant="contained"
                      style={{
                        padding: "10px",
                        width: "fit-content",
                        color: "white",
                        backgroundColor: "#1377C0",
                      }}
                      onClick={() => openPDF(firstCurrScore.solution_link)}
                    >
                      Link
                    </Button>
                  </p>
                </div>
              )}
              <div className="rows mark-submission">
                {chapterDetails?.all_task_status?.length > 0 &&
                chapterDetails?.all_task_status[0] == 1 ? (
                  <>
                    <p style={{ color: "green" }}>Task Completed</p>
                  </>
                ) : (
                  <>
                    {chapterDetails?.notes_pdf?.length == 0 && (
                      <p style={{ color: "green" }}>
                        No assignment submitted yet
                      </p>
                    )}
                    {chapterDetails?.notes_pdf?.length >
                      chapterDetails?.first_task_score?.length && (
                      <>
                        <p>
                          Mark Obtained:
                          <TextField
                            label="Mark Obtained"
                            type="text"
                            name="date"
                            value={firstTaskScore}
                            style={{ marginLeft: "5%" }}
                            onChange={(e) => setFirstTaskScore(e.target.value)}
                          />
                        </p>
                        <p>
                          Total Mark: {chapterDetails.first_task_totalscore}
                        </p>
                        <Button
                          variant="contained"
                          style={{
                            padding: "20px",
                            width: "fit-content",
                            color: "white",
                            backgroundColor: "#1377C0",
                          }}
                          onClick={handleFirstScoreTaskSubmit}
                        >
                          Submit
                        </Button>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </section>
        </Paper>

        {/* Demo Section */}
        <Paper
          elevation={3}
          style={{
            padding: "20px",
            backgroundColor: "#E4E4E4",
            marginTop: "10px",
          }}
        >
          <section>
            <div className="section">
              <h2>Demo Submission</h2>
              <h2 style={{ color: "red" }}>
                Deadline: {chapterDetails.second_task_date}
              </h2>
            </div>
            <div className="demo-online-section">
              {secondTaskPrevScore?.map((scores) => (
                <>
                  <div className="rows prev-attemp">
                    <p>Attemp {scores.attemp_no}:</p>
                    <p>
                      Score: {scores.score}/{scores.total_score}
                    </p>
                    <p>Date: {scores.date}</p>
                  </div>
                </>
              ))}

              {secondTaskOpen ? (
                <>
                  <div className="meet-link">
                    <p>Meet Link: </p>
                    <p style={{ marginLeft: "5%", color: "blue" }}>
                      <a href={chapterDetails.second_task_meetlink}>
                        {chapterDetails.second_task_meetlink}
                      </a>
                    </p>
                  </div>

                  <div className="rows mark-submission">
                    {chapterDetails?.all_task_status?.length > 0 &&
                    chapterDetails?.all_task_status[1] == 1 ? (
                      <>
                        <p style={{ color: "green" }}>Task Completed</p>
                      </>
                    ) : (
                      <>
                        <p>
                          Mark Obtained:
                          <TextField
                            label="Mark Obtained"
                            type="text"
                            name="date"
                            value={secondTaskScore}
                            style={{ marginLeft: "5%" }}
                            onChange={(e) => setSecondTaskScore(e.target.value)}
                          />
                        </p>
                        <p>
                          Total Mark: {chapterDetails.second_task_totalscore}
                        </p>
                        <Button
                          variant="contained"
                          style={{
                            padding: "20px",
                            width: "fit-content",
                            color: "white",
                            backgroundColor: "#1377C0",
                          }}
                          onClick={handleSecondScoreTaskSubmit}
                        >
                          Submit
                        </Button>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <p className="no-started">Not yet Started</p>
              )}
            </div>
          </section>
        </Paper>

        {/* Test section */}
        <Paper
          elevation={3}
          style={{
            padding: "20px",
            backgroundColor: "#E4E4E4",
            marginTop: "10px",
          }}
        >
          <section>
            <div className="section">
              <h2>Online Test</h2>
              <h2 style={{ color: "red" }}>
                Deadline: {chapterDetails.third_task_deadline}
              </h2>
            </div>
            <div className="demo-online-section">
              {thirdTaskPrevScore?.map((scores) => (
                <div className="rows prev-attemp">
                  <p>Attemp {scores.attemp_no}:</p>
                  <p>
                    Score: {scores.score}/{scores.total_score}
                  </p>
                  <p>Date: {scores.date}</p>
                </div>
              ))}

              {thirdTaskOpen ? (
                <>
                  <div className="meet-link">
                    <p>Test Link: </p>
                    <p style={{ marginLeft: "5%", color: "blue" }}>
                      <a href={chapterDetails.third_task_testlink}>
                        {chapterDetails.third_task_testlink}
                      </a>
                    </p>
                  </div>
                  <div className="rows mark-submission">
                    {chapterDetails?.all_task_status?.length > 0 &&
                    chapterDetails?.all_task_status[2] == 1 ? (
                      <>
                        <p style={{ color: "green" }}>Task Completed</p>
                      </>
                    ) : (
                      <>
                        <p>
                          Mark Obtained:
                          <TextField
                            label="Mark Obtained"
                            type="text"
                            name="date"
                            value={thirdTaskScore}
                            style={{ marginLeft: "5%" }}
                            onChange={(e) => setThirdTaskScore(e.target.value)}
                          />
                        </p>
                        <p>
                          Total Mark: {chapterDetails.third_task_totalscore}
                        </p>
                        <Button
                          variant="contained"
                          style={{
                            padding: "20px",
                            width: "fit-content",
                            color: "white",
                            backgroundColor: "#1377C0",
                          }}
                          onClick={handleThirdScoreTaskSubmit}
                        >
                          Submit
                        </Button>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <p className="no-started">Not yet Started</p>
              )}
            </div>
          </section>
        </Paper>
      </DialogContent>
    </Dialog>
  );
};

export default EachTeacherTaskDetails;
