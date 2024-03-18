import { useState, useEffect } from "react";
import "./Dash.scss";
import student1 from "../../assest/male.png";
import teacher from "../../assest/professor.png";
import Courses from "../../assest/courses.png";
import Medium from "../../assest/medium.png";
import ClassImage from "../../assest/library.png";
import jwt_decode from "jwt-decode";
import axios from "axios";
import Widgest from "../Widgest/widgest";
import InfoContainer from "../InfoContainer/InfoContainer";
import SubjectList from "../../components/SubjectLIst/Subject";
import useClassIdsQuery from "../../hooks/useGetSchoolIds";
import { GW_URL } from "../../config";
import { CircularProgress } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import DataLoader from "../Loader/DataLoader";
import ListWidgest from "../Widgest/ListWidgest";
import { adminConfig } from "../../config";
import { ToastContainer, toast } from "react-toastify";
import BoardImage from "../../assest/board.png";
import { useFetchCourse } from "../../hooks/useGetAllCourse";
import AddSubject from "../AddSubject/AddSubject";
import useMediumQuery from "../../hooks/useGetMediuIds";
import useBoardIdQuery from "../../hooks/useGetBoard";

const Dashboard = (props) => {
  const [mediumList, setMediumList] = useState([]);
  const [boardList, setBoardList] = useState([]);
  let decodeToken = jwt_decode(localStorage.getItem("auth_token"));
  let school_id =
    localStorage.getItem("superadmin_school") === null
      ? decodeToken.result.school_id
      : localStorage.getItem("superadmin_school");

  const { data: schoolData, isLoading: schoolLoading } = useQuery(
    ["school", school_id],
    () =>
      axios.get(`${GW_URL}/schools/${school_id}`, adminConfig).then((res) => {
        if (decodeToken.result.role === "superAdmin")
          props.AdminNameHandler("SuperAdmin");
        else props.AdminNameHandler(res?.data.schoolDetail.admin_name);
        return res?.data;
      })
  );

  const { data: mediumIdData, isLoading: mediumIdLoading } =
    useMediumQuery(school_id);

  const { data: classIdData, isLoading: classIdLoading } =
    useClassIdsQuery(school_id);

  const { data: boardIdData, isLoading: boardIdLoading } =
    useBoardIdQuery(school_id);


 // mediumId data to mediumList   
  useEffect(() => {
    if (!mediumIdLoading) {
      let newArr = [];
      for (let md of mediumIdData) {
        newArr.push(md.medium_name);
      }
      setMediumList(newArr);
    }
  }, [mediumIdData]);

  // boardId data to boardList
  useEffect(() => {
    if (!boardIdLoading) {
      let newArr = [];
      for (let bd of boardIdData) {
        newArr.push(bd.board_name);
      }
      setBoardList(newArr);
    }
  }, [boardIdData]);

  return (
    <div>
      <div className="dash">
        {schoolLoading ? (
          <div className="top">
            <DataLoader width={100} Loading={schoolLoading} />
          </div>
        ) : (
          <InfoContainer data={schoolData?.schoolDetail} />
        )}

        <div className="bottom">
          <Widgest
            name={"Student"}
            count={schoolData?.totalStudent}
            image={student1}
            Loader={schoolLoading}
          />
          <Widgest
            name={"Teacher"}
            count={schoolData?.totalTeacher}
            image={teacher}
            Loader={schoolLoading}
          />
          <Widgest
            name={"Classes"}
            count={classIdData?.length}
            image={ClassImage}
            Loader={classIdLoading}
          />
          <ListWidgest
            name={"Board"}
            count={boardList}
            image={BoardImage}
            Loader={boardIdLoading}
          />

          <ListWidgest
            name={"Medium"}
            count={mediumList}
            image={Medium}
            Loader={mediumIdLoading}
          />
          {/* <ListWidgest
            name={"Courses"}
            count={courseIdData}
            image={Courses}
            Loader={courseIdLoading}
          /> */}
        </div>
        <AddSubject />
        <ToastContainer />
      </div>
    </div>
  );
};

export default Dashboard;
