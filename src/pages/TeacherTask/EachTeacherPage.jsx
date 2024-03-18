import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import "./EachTeacherPage.scss";
import "react-toastify/dist/ReactToastify.css";
import { Button, Paper } from "@mui/material";
import ChapterForm from "./ChapterForm";
import EachTeacherTaskDetails from "./EachTeacherTaskDetails";
import { useFetchAllTeacherChapter } from "../../hooks/useFetchAllTeacherChapter";

import { useParams, useNavigate } from "react-router-dom";
import { getIndianDate } from "../../config";
import axios from "axios";
import { GW_URL, EachTaskStatus, colorHash } from "../../config";
import Loader from "../../components/Loader/Loader";
import ChapterModal from "./ChapterModal";
import { ToastContainer, toast } from "react-toastify";
import TaskCard from "./TaskCard";
import DataLoader from "../../components/Loader/DataLoader";

const EachTeacherPage = () => {
  const { teacherId: teacher_id } = useParams();


  const [taskUpdate, setTaskUpdated] = useState(false);
  const [chaptersList, setChaptersList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // const { isLoading: allChapterLoading, data: teacherChapterDetails } =
  //   useFetchAllTeacherChapter({ teacher_id });
  let teacherChapterDetails = [];

  // get rqust for all teacherChaptes

  const getData = () => {
    console.log("hello there ");
    setIsLoading(true);
    axios
      .get(`${GW_URL}/teacher/${teacher_id}/getChapterDetails`)
      .then((res) => {
        console.log(res.data.chapterDetails);
        setChaptersList(res.data.chapterDetails);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
      });
  };
  useEffect(() => {

    getData();
  }, [taskUpdate]);


  return (
    <div className="teachertask-container">
      <Sidebar />
      <div className="teacherTask">
        <Navbar />

        <div className="task-list-container">
          <div className="task-card-header-container">
            <span>All chapters</span>
          </div>
          {isLoading ? (
          <DataLoader Loading={isLoading}/>
          ) : (
            chaptersList
              .sort((a, b) => a.chapter_number - b.chapter_number)
              .map((chapter) => {
                return (
                  <TaskCard
                    key={chapter.chapter_number}
                    chapter={chapter}
                    teacher_id={teacher_id}
                    setTaskUpdated={setTaskUpdated}
                    taskUpdate={taskUpdate}
                  />
                );
              })
          )}
        </div>
      </div>
      <ToastContainer />

    </div>
  );
};

export default EachTeacherPage;
