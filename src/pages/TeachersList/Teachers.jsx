import React from "react";
import "./Teachers.scss";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import DataTable from "../../components/DataTable/DataTable";
import Box from "@mui/material/Box";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import axios from "axios";
import useFetchTeacher, {
  ALL_TEACHER_FETCH_KEY,
} from "../../hooks/useFetchTeacher";
import EditTeacher from "../EditTeacher/EditTeacher";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { GW_URL, adminConfig, subjects, validateEmail } from "../../config";
import Loader from "../../components/Loader/Loader";

// columns  of the teacher Details table
const CapitalLizeFirstLetter = (arr) => {
  const modifiedArray = arr.map((item) => {
    const modifiedItem = {
      ...item,
      teacher_name: capitalizeFirstLetter(item.teacher_name),
    };
    return modifiedItem;
  });
  return modifiedArray;
};

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
const columns = [
  {
    field: "id",
    headerName: "S No.",
    flex: 1,
    editable: false,
    align: "left",
    headerAlign: "left",
  },
  {
    field: "teacher_id",
    headerName: "SI No.",
    flex: 1,
    editable: false,
    align: "left",
    hide: true,
    headerAlign: "left",
  },
  {
    field: "teacher_name",
    headerName: "Name",
    flex: 1,
    editable: false,
    headerAlign: "left",
    align: "left",
  },
  {
    field: "subject_name",
    headerName: "Subject",
    editable: true,
    flex: 1,
    editable: false,
    headerAlign: "left",
    align: "left",
  },
  {
    field: "mobile",
    headerName: "Mobile Number",
    flex: 1,
    editable: false,
    headerAlign: "left",
    align: "left",
  },
];

const editTeacherFunc = ({
  school_id,
  teacher_name,
  age,
  mobile,
  email,
  gender,
  medium,
  date,
  subject_id,
  city,
  class_ids,
  experience,
  salary,
  teacher_id,
  qualification,
}) => {
  return axios.put(
    `${GW_URL}/teacher/${teacher_id}?school_id=${school_id}&teacher_name=${teacher_name}&age=${age}&mobile=${mobile}&email=${email}&gender=${gender}&medium=${medium}&date=${date}&subject_id=${subject_id}&city=${city}&class_ids=${class_ids}&experience=${experience}&salary=${salary}&teacher_id=${teacher_id}&qualification=${qualification}`,
    {},
    adminConfig
  );
};
const Teachers = (props) => {
  const [rows, setRows] = useState([]);
  const [Isloading, setIsloading] = useState(true);
  const [selectedTeacher, setSelectedTeacher] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loaderOpen, setLoaderOpen] = useState(false);

  let decodeToken = jwt_decode(localStorage.getItem("auth_token"));
  let school_id =
    localStorage.getItem("superadmin_school") === null
      ? decodeToken.result.school_id
      : localStorage.getItem("superadmin_school");
  let navigate = useNavigate();

  const { isLoading, isError, data, error } = useFetchTeacher(school_id);



  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: editTeacherFunc,
    onSuccess: () => {
      setLoaderOpen(false);
      queryClient.invalidateQueries(ALL_TEACHER_FETCH_KEY);

      toast.success("Teacher Data Updated successfully", {
        position: "top-center",
        autoClose: 2000,

        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    },
    onError: () => {
      setLoaderOpen(false);
      toast.error("Something went wrong", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    },
  });

  const getSubjectName = (subjectIds) => {
    let subjectName = [];
    for (let i = 0; i < subjectIds.length; i++) {
      const subject = subjects.filter((a) => a.subject_id == subjectIds[i]);
      subjectName.push(subject[0].subject_name);
    }
    return subjectName;
  };

  useEffect(() => {
    if (isError) {
      console.log(error);
    }
    if (!isLoading) {
      let allTeacher = [];
      for (let i = 0; i < data?.data?.teacherDetails.length; i++) {
        let subjectName = getSubjectName(
          data?.data?.teacherDetails[i].subject_id
        );
        allTeacher.push({
          ...data?.data?.teacherDetails[i],
          id: i + 1,
          teacher_id: data?.data?.teacherDetails[i].teacher_id,
          subject_name: subjectName,
        });
      }

      setRows(CapitalLizeFirstLetter(allTeacher));
    }
  }, [data]);

  const [TeacherId, setTeacherid] = useState(0);

  const handleSelect = (id) => {
  
    setTeacherid(id);
    navigate(`/Teachers/${id}`);
  };

  const handleOpenModal = (id) => {
    setSelectedTeacher(id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedTeacher("");
    setIsModalOpen(false);
  };

  const handleSubmit = (formData) => {
    // school_id,teacher_name,age,mobile,email,gender,medium,date,subject_id,city,class_ids,formData,experience,salary

    if (formData.teacherName.trim() == "") {
      toast.error("Teacher name is required!", {
        theme: "dark",
      });
      return;
    }
    if (
      formData.qualification.trim() == "" ||
      formData.qualification.length > 60
    ) {
      return toast.error("Qualification length should be in between 1 to 60");
    }
    if (formData.age == "") {
      toast.error("Teacher name is required!", {
        theme: "dark",
      });
      return;
    }
    if (formData.mobile.length != 10) {
      toast.error("Teacher mobile is required!", {
        theme: "dark",
      });
      return;
    }
    if (formData.date == "") {
      toast.error("Teacher joining date is required!", {
        theme: "dark",
      });
      return;
    }
    if (formData.subjects.length == 0) {
      toast.error("Teacher subject is required!", {
        theme: "dark",
      });
      return;
    }
    if (formData.city.trim() == "") {
      toast.error("Teacher city is required!", {
        theme: "dark",
      });
      return;
    }
    if (formData.classIds.length == 0) {
      toast.error("Teacher class is required!", {
        theme: "dark",
      });
      return;
    }
    if (formData.experience == "") {
      toast.error("Teacher experience is required!", {
        theme: "dark",
      });
      return;
    }
    if (formData.salary == "") {
      toast.error("Teacher salary is required!", {
        theme: "dark",
      });
      return;
    }
    if (formData.gender == "") {
      toast.error("Teacher Gender is required!", {
        theme: "dark",
      });
      return;
    }
    if (formData.email == "") {
      toast.error("Teacher email is required!", {
        theme: "dark",
      });
      return;
    }
    if (!validateEmail(formData.email)) {
      toast.error("Teacher email is not valid!", {
        theme: "dark",
      });
      return;
    }
    if (formData.medium == "") {
      toast.error("Teacher medium is required!", {
        theme: "dark",
      });
      return;
    }
    setLoaderOpen(true);
    mutation.mutate({
      school_id,
      teacher_name: formData.teacherName,
      age: formData.age,
      mobile: formData.mobile,
      date: formData.date,
      subject_id: formData.subjectIds,
      city: formData.city,
      class_ids: formData.classIds,
      experience: formData.experience,
      salary: formData.salary,
      teacher_id: selectedTeacher,
      email: formData.email,
      medium: formData.medium,
      gender: formData.gender,
      qualification: formData.qualification,
    });
    handleCloseModal();
  };

  const handleTeacherAttendance = (teacher_id, teacher_name) => {
    navigate(`/Teachers/${teacher_id}/attendance`, {
      state: {
        teacherName: teacher_name,
      },
    });
  };

  const viewColumn = [
    {
      field: "view",
      headerName: "Teacher Details",
      width: 200,
      sortable: false,
      headerAlign: "center",
      align: "center",
      editable: false,
      flex: 1,
      renderCell: (params) => {
        return (
          <div className="viewButton">
            <button
              style={{ marginRight: "5px" }}
              className="btn"
              onClick={() =>
                handleSelect(params.row.teacher_id, params.row.teacher_name)
              }
            >
            View
            </button>
          </div>
        );
      },
    },
    {
      field: "edit",
      headerName: "Edit",
      width: 200,
      sortable: false,
      headerAlign: "center",
      align: "center",
      editable: false,
      flex: 1,
      renderCell: (params) => {
        return (
          <div className="viewButton">
            <button
              style={{ marginRight: "5px" }}
              onClick={() => handleOpenModal(params.row.teacher_id)}
            >
              Edit
            </button>
          </div>
        );
      },
    },
    {
      field: "attendance",
      headerName: "Attendance",
      width: 200,
      sortable: false,
      headerAlign: "center",
      align: "center",
      editable: false,
      flex: 1,
      renderCell: (params) => {
        return (
          <div className="viewButton">
            <button
              style={{ marginRight: "5px" }}
              onClick={() =>
                handleTeacherAttendance(params.row.teacher_id, params.row)
              }
            >
              View
            </button>
          </div>
        );
      },
    },
  ];

  const [isExpanded, setExpanded] = useState(false);
  const isExpandedHandler = (value) => {
    setExpanded(value);
  };
  return (
    <div className="teachers-container ">
      <Sidebar />
      <div className="teachers">
        <Navbar adminName={props.AdminName} />
        <div className="teachers-page page-container">
          <div className="teacher-detail-heading">
            <span>Teachers Details</span>
          </div>
          <div className="teacher-table">
            {
              <DataTable
                expandHandler={isExpanded}
                rows={rows}
                columns={columns.concat(viewColumn)}
                emptyRowsMessage={"No Teachers"}
                loader={isLoading}
              />
            }
            {isModalOpen && (
              <EditTeacher
                teacher_id={selectedTeacher}
                onSubmit={handleSubmit}
                onClose={handleCloseModal}
                school_id={school_id}
              />
            )}

            <div
              className="newButton"
              style={{ position: "relative", marginTop: "10px" }}
            >
              <Link
                to="/Teachers/newTeacher"
                style={{ position: "absolute", right: "0px" }}
              >
                <button>Add new Teacher</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
      <Loader open={loaderOpen} />
    </div>
  );
};

export default Teachers;
