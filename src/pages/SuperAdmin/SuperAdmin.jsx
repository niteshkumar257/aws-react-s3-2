import React from "react";
import DataTable from "../../components/SuperAdminTable/SuperAdminTable";
// import Navbar from "../../components/SuperAdminNavbar/SuperNavbar"
import "./SuperAdmin.scss";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import jwt_decode from "jwt-decode";
import useFetchAllSchool from "../../hooks/useFetchAllSchool";
import EditSchool from "../EditSchool/EditSchool";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ToastContainer, toast } from "react-toastify";
import { ALL_SCHOOL_FETCH_KEY } from "../../hooks/useFetchAllSchool.js";
import {
  GW_URL,
  adminConfig,
  superAdminConfig,
  validateEmail,
} from "../../config";
import Loader from "../../components/Loader/Loader";

const ChangeDataFormat = (rows) => {
  const newData = [];

  console.log(rows);
  for (const school of rows) {
    const schoolCopy = { ...school };
    let adminName = schoolCopy.admin_name;
    adminName = adminName
      .split("_")
      .map((name) => name.charAt(0).toUpperCase() + name.slice(1))
      .join(" ");
    schoolCopy.admin_name = adminName.replace(/_/g, "");
    newData.push(schoolCopy);
  }

  return newData;
};
const columns = [
  {
    field: "id",
    headerName: "Serial",
    width: 90,
    flex: 1,
    headerAlign: "center",
    align: "center",
    hide: true,
  },

  {
    field: "school_name",
    headerName: "School Name",
    width: 150,
    editable: true,
    headerAlign: "left",
    align: "left",
    flex: 1,
  },
  {
    field: "city_name",
    headerName: "City",
    width: 150,
    editable: true,
    headerAlign: "left",
    align: "left",
    flex: 1,
  },
  {
    field: "admin_name",
    headerName: "Owner",
    type: "number",
    width: 110,
    editable: true,
    headerAlign: "left",
    align: "left",
    flex: 1,
  },
  {
    field: "mobile",
    headerName: "Phone Number",

    sortable: false,
    headerAlign: "left",
    align: "left",
    flex: 1,
  },

  {
    field: "category_id",
    headerName: "Category",
    hide: true,
    sortable: false,
    headerAlign: "left",
    align: "left",
    flex: 1,
  },
];

const CapitalLizeFirstLetter = (row) => {
  const modifiedArray = row.map((item) => {
    const modifiedItem = {
      school_name: capitalizeFirstLetter(item.school_name),
      city_name: capitalizeFirstLetter(item.city_name),
      id: item.id,
      admin_name: capitalizeFirstLetter(item.admin_name),
      email: item.email,
      mobile: item.mobile,
      category_id: item.category_id,
    };
    return modifiedItem;
  });
  return modifiedArray;
};

function capitalizeFirstLetter(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}
const EditSchoolFunc = ({
  school_name,
  city_name,
  admin_name,
  school_id,
  email,
  mobile,
  courses_id,
  mediums_id,
  boards_id,
  classes_id,
  subjects_id,
  formData,
  academic_start_month,
  category_id,
}) => {
  return axios.put(
    `${GW_URL}/schools/${school_id}?school_name=${school_name}&city_name=${city_name}&admin_name=${admin_name}&email=${email}&mobile=${mobile}&course_id=${courses_id}&medium_id=${mediums_id}&board_id=${boards_id}&class_id=${classes_id}&subject_id=${subjects_id}&academic_start_month=${academic_start_month}&category=${category_id}`,
    {},
    superAdminConfig
  );
};

const SuperAdmin = () => {
  const [selectedSchool, setSelectedSchool] = useState("");
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loaderOpen, setLoaderOpen] = useState(false);

  const SUPER_ADMIN = "SUPER_ADMIN";

  const superAdminConfig = {
    headers: {
      Authorization: "Bearer " + localStorage.getItem("auth_token"),
      User: SUPER_ADMIN,
    },
  };
  const { isLoading, isError, data } = useFetchAllSchool(superAdminConfig);

  // const isLoading=false;
  // const isError=false;
  // const data=undefined;

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: EditSchoolFunc,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ALL_SCHOOL_FETCH_KEY] });
      setLoaderOpen(false);

      toast.success("Data updated Successfully!", {
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

  const handleOpenModal = (id) => {
    setSelectedSchool(id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedSchool("");
    setIsModalOpen(false);
  };

  const handleSubmit = (formData) => {
    if (formData.schoolName.length == 0) {
      toast.error("school name required!", {
        theme: "dark",
      });
      return;
    }
    if (formData.cityName.length == 0) {
      toast.error("city name required!", {
        theme: "dark",
      });
      return;
    }
    if (formData.adminName.length == 0) {
      toast.error("Admin name required!", {
        theme: "dark",
      });
      return;
    }
    if (formData.email.length == 0) {
      toast.error("Email address required!", {
        theme: "dark",
      });
      return;
    }
    if (!validateEmail(formData.email)) {
      toast.error("Email Id is not valid", {
        theme: "dark",
      });
      return;
    }
    if (formData.mobile.length != 10) {
      toast.error("Mobile number should be 10 digits!", {
        theme: "dark",
      });
      setMobileError(true);
      return;
    }
    if (formData.courseIds.length == 0) {
      toast.error("Courses name required!", {
        theme: "dark",
      });
      return;
    }
    if (formData.boardIds.length == 0) {
      toast.error("Board name required!", {
        theme: "dark",
      });
      return;
    }
    if (formData.classIds.length == 0) {
      toast.error("Class name required!", {
        theme: "dark",
      });
      return;
    }
    if (formData.mediumIds.length == 0) {
      toast.error("Medium name required!", {
        theme: "dark",
      });
      return;
    }

    if (formData.subjectIds.length == 0) {
      toast.error("subject name required!", {
        theme: "dark",
      });
      return;
    }

    if (formData.academicMonthId.length == 0) {
      toast.error("Academic start month is required!", {
        theme: "dark",
      });
      return;
    }

    if (formData.categoryId.length == 0) {
      toast.error("Category is required!", {
        theme: "dark",
      });
      return;
    }

    // {school_name, city_name, admin_name, email, mobile, courses_id, mediums_id, boards_id, classes_id, subjects_id, formData}
    setLoaderOpen(true);
    mutation.mutate({
      school_name: formData.schoolName,
      school_id: selectedSchool,
      city_name: formData.cityName,
      admin_name: formData.adminName,
      email: formData.email,
      mobile: formData.mobile,
      courses_id: formData.courseIds,
      mediums_id: formData.mediumIds,
      boards_id: formData.boardIds,
      classes_id: formData.classIds,
      subjects_id: formData.subjectIds,
      academic_start_month: formData.academicMonthId,
      category_id: formData.categoryId,
    });

    handleCloseModal();
  };

  const handleSelect = (id, category_id) => {
    localStorage.setItem("superadmin_school", id);
    localStorage.setItem("superadmin_school_category", category_id);
    navigate(`/dashboard`);
  };

  let decodeToken = jwt_decode(localStorage.getItem("auth_token"));
  let school_id = decodeToken.result.school_id;

  const viewColumn = [
    {
      field: "view",
      headerName: "School Details",
      width: 200,
      editable: false,
      sortable: false,
      align: "center",
      headerAlign: "center",
      flex: 1,
      disableFilter: true,
      renderCell: (params) => {
        return (
          <div
            className="viewButton"
            style={{
              display: "flex",
              justifyContent: "flex-start",
              margin: "0px",
            }}
          >
            <button
              style={{ marginRight: "5px" }}
              onClick={() =>
                handleSelect(params.row.id, params.row.category_id)
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
      headerName: "School Details",
      width: 200,
      editable: false,
      sortable: false,
      align: "center",
      headerAlign: "center",
      flex: 1,
      disableFilter: true,
      renderCell: (params) => {
        return (
          <div
            className="viewButton"
            style={{
              display: "flex",
              justifyContent: "flex-start",
              margin: "0px",
            }}
          >
            <button
              style={{ marginRight: "5px" }}
              onClick={() => handleOpenModal(params.row.id)}
            >
              Edit
            </button>
          </div>
        );
      },
    },
  ];
  return (
    <div className="superAdmin-container">
      <Sidebar />
      <div className="superAdmin">
        <Navbar adminName={"SuperAdmin"} />
  
        <div className="superAdmin-page page-container">
          <div className="superAdmin-container-search">
            <span>School Details</span>
          </div>
          <div>
            {isLoading ? (
              <Loader open={true} />
            ) : (
              <DataTable
                rows={CapitalLizeFirstLetter(ChangeDataFormat(data?.data?.allSchool))}
                columns={columns.concat(viewColumn)}
                emptyRowsMessage={"No Schools"}
              />
            )}
            {isModalOpen && (
              <EditSchool
                onClose={handleCloseModal}
                onSubmit={handleSubmit}
                school_id={selectedSchool}
              />
            )}
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
  
};

export default SuperAdmin;
