import Login from "./pages/Login/Login";
import { useState, useEffect } from "react";
import DashBoard from "./pages/DashBoard/DashBoard";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Grade from "./pages/Grade/Grade";
import StudentList from "./pages/StudentsList/Student";
import TeacherList from "./pages/TeachersList/Teachers";
import StudentForm from "./pages/StudentForm/StudentForm";
import TeacherForm from "./pages/TeacherForm/TeachersForm";
import Notification from "./pages/Notification/Notification";
import StudentePage from "./pages/StudentPage/Studentpage";
import TeacherPage from "./pages/TeacherPage/TeacherPage";
import ChangePassword from "./pages/ChangePassword/ChangePassword";
import SuperAdmin from "./pages/SuperAdmin/SuperAdmin";
import SchoolForm from "./pages/SchoolForm/SchoolForm";
import TestForm from "./pages/TestForm/TestForm";
import AddCurriculum from "./pages/AddCurriculum/AddCurriculum";
import Mentors from "./pages/MentorList/Mentors";
import MentorsForm from "./pages/MentorForm/MentorsForm";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import NotFoundPage from "./pages/NotFoundPage/NotFoundPage";
import RequestAuth from "./RequestAuth";
import GlobalAuth from "./globalAuth";
import Attendance from "./pages/Attendance/Attendance";
import TicektAdmin from "./pages/TicketIssue/TicektAdmin";
import TicketDetails from "./pages/TicketIssue/TicketDetails";
import TicketSuperAdmin from "./pages/TicketIssue/TicketSuperAdmin";

import StudentAttendance from "./pages/Attendance/StudentAttendance";
import SingleMentorPage from "./pages/MentorPage/MentorPage";

import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import AddVideos from "./pages/AddVideos/AddVideos";
import FeedbackSuperAdmin from "./pages/FeedBack/FeedBackSuperAdmin";
import FeedbackAdmin from "./pages/FeedBack/FeedBackAdmin";
import Certificate from "./pages/CertificatePage/Certificate";
import ClassTeacher from "./pages/ClassTeacher/ClassTeacher";
import AddHoliday from "./pages/AddHoliday/AddHoliday";
import TeacherTask from "./pages/TeacherTask/TeacherTask";
import EachTeacherPage from "./pages/TeacherTask/EachTeacherPage";
import EachTeacherAttendanceCalender from "./pages/Attendance/EachTeacherAttendanceCalender";
import EachTeacherAttendance from "./pages/Attendance/EachTeacherAttendance";
import PTMDetailsPage from "./pages/PTM/CreatePTM";
import TeacherLoginDetails from "./pages/TeacherLoginDetails/TeacherLoginDetails";
import AdminLogin from "./pages/AdminLogin/AdminLogin";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 600000,
    },
  },
});

const App = () => {
  const [adminName, setAdminName] = useState("");
  const AdminNameHandler = (admin_name) => {
    setAdminName(admin_name);
  };
  const [studentId, setStudentid] = useState(0);
  const [teacherId, setTeacherid] = useState(0);
  const [isExpand, setIsExpand] = useState(false);

  const isExapnedHandler = (value) => {
    setIsExpand(value);
  };

  // getting TeacherId from TecherList Page
  const getTeacherId = (id) => {
    setTeacherid(id);
  };
  // getting studentPage
  const getStudentId = (id) => {
    setStudentid(id);
  };

  return (
    <QueryClientProvider client={queryClient}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="changePassword" element={<ChangePassword />} />

            <Route element={<GlobalAuth />}>
              <Route
                path="SuperAdmin"
                element={[<RequestAuth />, <SuperAdmin />]}
              ></Route>
              <Route
                path="dashBoard"
                element={<DashBoard AdminNameHandler={AdminNameHandler} />}
              />
              <Route path="/Student">
                <Route
                  index
                  element={
                    <StudentList
                      AdminName={adminName}
                      getStudentId={getStudentId}
                    />
                  }
                />
                <Route
                  path=":student_id"
                  element={[
                    <RequestAuth />,
                    <StudentePage AdminName={adminName} />,
                  ]}
                />
              </Route>
              <Route path="Grade" element={<Grade AdminName={adminName} />} />
              <Route path="Teachers">
                <Route
                  index
                  element={
                    <TeacherList
                      AdminName={adminName}
                      getTeacherId={getTeacherId}
                    />
                  }
                />
                <Route
                  path="newTeacher"
                  element={<TeacherForm AdminName={adminName} />}
                />
                <Route
                  path=":TeacherId"
                  element={[
                    <RequestAuth />,
                    <TeacherPage AdminName={adminName} teacherId={teacherId} />,
                  ]}
                />
                <Route
                  path=":teacherId/attendance"
                  element={[<RequestAuth />, <EachTeacherAttendance />]}
                />
              </Route>
              <Route
                path="AddStudent"
                element={<StudentForm AdminName={adminName} />}
              />
              <Route
                path="AddTeacher"
                element={<TeacherForm AdminName={adminName} />}
              />
              <Route
                path="Notification"
                element={<Notification AdminName={adminName} />}
              />
              <Route
                path="ClassTeacher"
                element={<ClassTeacher AdminName={adminName} />}
              />
              <Route path="attendance">
                <Route index element={<Attendance AdminName={adminName} />} />
                <Route
                  path=":studentId"
                  element={<StudentAttendance AdminName={adminName} />}
                  AdminName={adminName}
                ></Route>
              </Route>
              <Route
                path="PTMDetails"
                element={<PTMDetailsPage AdminName={adminName} />}
              />
              <Route
                path="AddSchool"
                element={[<RequestAuth />, <SchoolForm />]}
              />
              <Route
                path="getTeacherLoginDetails"
                element={[<RequestAuth />, <TeacherLoginDetails />]}
              />
              <Route
                path="getAdminLoginDetails"
                element={[<RequestAuth />, <AdminLogin />]}
              />
              <Route
                path="TeacherTask"
                element={[<RequestAuth />, <TeacherTask />]}
              />
              <Route
                path="TeacherTask/assignTask/:teacherId"
                element={[<RequestAuth />, <EachTeacherPage />]}
              />
              <Route
                path="TeacherTask/assignTask/:teacherId/:chapter_id"
                element={[<RequestAuth />, <EachTeacherPage />]}
              />

              <Route path="/AddTest" element={<TestForm />} />
              <Route path="/Mentor" element={[<RequestAuth />, <Mentors />]} />
              <Route path="/AddMentor" element={<MentorsForm />} />
              <Route path="/Videos" element={<AddVideos />} />
              <Route
                path="/Mentor/:MentorId"
                element={[<RequestAuth />, <SingleMentorPage />]}
              />
              <Route path="/AddCurriculum" element={[<AddCurriculum />]} />
              <Route path="/AddHoliday" element={<AddHoliday />} />
              <Route
                path="/FeedbackSuperAdmin"
                element={<FeedbackSuperAdmin />}
              />
              <Route path="/FeedbackAdmin" element={<FeedbackAdmin />} />
              <Route path="/Certificate" element={<Certificate />} />
              <Route path="/ticketAdmin" element={<TicektAdmin />} />
              <Route
                path="/ticketDetails/:id/:school_id/:school_name/:father_name/:parents_id/:title/:description/:created_on/:status/:admin_id"
                element={<TicketDetails />}
              />
              <Route path="/ticketSuperAdmin" element={<TicketSuperAdmin />} />
              <Route path="/ticketSuperAdmin/:id" element={<TicketDetails />} />
            </Route>
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </BrowserRouter>
      </LocalizationProvider>

      <ReactQueryDevtools initialIsOpen={true} position="bottom-right" />
    </QueryClientProvider>
  );
};

export default App;
