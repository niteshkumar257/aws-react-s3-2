import React, { useEffect } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import { useState } from "react";
import axios from "axios";
import MenuItem from "@mui/material/MenuItem";
import { ToastContainer, toast } from "react-toastify";
import { Button } from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import DataTable from "../../components/SuperAdminTable/SuperAdminTable";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import "./AddCurriculum.scss";
import useFetchAllCurriculum from "../../hooks/useFetchAllCurriculum";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ALL_CURRICULUM_KEY } from "../../hooks/useFetchAllCurriculum";

import {
  GW_URL,
  adminConfig,
  getAdminDetails,
  months,
  superAdminConfig,
} from "../../config";

import Loader from "../.././components/Loader/Loader";
import useSchoolData from "../../hooks/useSchoolData";

const columns = [
  { field: "id", headerName: "S No. ", width: 200 },
  {
    field: "class",
    headerName: "Class",
    width: 200,
    flex: 1,
    editable: true,
    headerAlign: "center",
    align: "center",
  },
  { field: "class_id", headerName: "", width: 0, editable: true, hide: true },
  {
    field: "medium_id",
    flex: 1,
    headerName: "Medium",
    width: 0,
    editable: true,
    headerAlign: "center",
    align: "center",
    hide: true,
  },
  {
    field: "medium",
    flex: 1,
    headerName: "Medium",
    width: 200,
    editable: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "month",
    headerName: "Month",
    width: 200,
    editable: true,
    hide: false,
  },
  {
    field: "month_id",
    headerName: "Month",
    width: 50,
    editable: true,
    hide: true,
  },
];

const addCurriculum = async ({
  school_id,
  classs,
  formData,
  mediumId,
  monthId,
}) => {
  return await axios.post(
    `${GW_URL}/schools/${school_id}/updateCurriculum?class_id=${classs}&medium_id=${mediumId}&month=${monthId}`,
    formData,
    adminConfig
  );
};

const AddCurriculum = (props) => {
  const [classs, setClasss] = useState("");
  const [monthId, setMonthId] = useState("");
  const [mediumId, setMediumId] = useState("");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [classes, setClasses] = useState([]);
  const [mediums, setMediums] = useState([]);
  const [rows, setRows] = useState([]);
  const [isExpanded, setExpanded] = useState(false);
  const [openLoader, setOpenLoader] = useState(false);

  const { school_id } = getAdminDetails();

  const { isLoading, isError, data } = useFetchAllCurriculum(school_id);
  const {
    classArray,
    mediumArray,
    isLoading: schoolDataLoading,
  } = useSchoolData(school_id);

  const isExpandedHandler = (value) => {
    setExpanded(value);
  };
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: addCurriculum,
    onSuccess: () => {
      setOpenLoader(false);
      queryClient.invalidateQueries({ queryKey: [ALL_CURRICULUM_KEY] });
      toast.success("Timetable added successfully", {
        theme: "dark",
      });
      setClasss("");
      setMediumId("");
      setMonthId("");
      setFile(null);
      setFileName("");
    },
    onError: () => {
      setOpenLoader(false);
      toast.error("Something went wrong", {
        theme: "dark",
      });
    },
  });

  useEffect(() => {
    if (!schoolDataLoading) {
      let allClasses = [];
      for (let i = 0; i < classArray.length; i++) {
        allClasses.push({
          class_id: classArray[i].id,
          class_name: classArray[i].label,
        });
      }
      let allMediums = [];
      for (let i = 0; i < mediumArray.length; i++) {
        allMediums.push({
          medium_id: mediumArray[i].id,
          medium_name: mediumArray[i].label,
        });
      }
      setClasses(allClasses);
      setMediums(allMediums);
    }
  }, [schoolDataLoading]);

  useEffect(() => {
    if (isError) {
      console.log(isError);
    }
    if (!isLoading) {
      let allRows = [];
      for (let i = 0; i < data.data.allCurriculum.length; i++) {
        data.data.allCurriculum[i].id = i + 1;
        let monthName = months.filter(
          (m) => m.month_id == data.data.allCurriculum[i].month
        )[0].month_name;
        allRows.push({
          ...data.data.allCurriculum[i],
          month: monthName,
          medium: data.data.allCurriculum[i].medium_name,
          month_id: data.data.allCurriculum[i].month,
        });
      }
      setRows(allRows);
    }
  }, [data]);

  const AddCurriculumHandler = async (e) => {
    e.preventDefault();
    if (classs.length == 0) {
      toast.error("Please select class");
      return;
    }

    if (mediumId.length == 0) {
      toast.error("Please select medium");
      return;
    }

    if (monthId.length == 0) {
      toast.error("Please select month");
      return;
    }

    if (file == null) {
      toast.error("Please select file");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", fileName);
    setOpenLoader(true);
    mutation.mutate({ school_id, classs, formData, mediumId, monthId });
  };

  const handleMonthChange = (e) => {
    setMonthId(e.target.value);
  };

  const handleMediumChange = (e) => {
    setMediumId(e.target.value);
  };

  const handleClassChange = (e) => {
    setClasss(e.target.value);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    if (e.target.files[0]) {
      setFileName(e.target.files[0].name);
    } else {
      setFileName("");
    }
  };

  const handleViewSelect = (class_id, mediumId, monthId) => {
    axios
      .get(
        `${GW_URL}/viewCurriculum?school_id=${school_id}&class_id=${class_id}&medium_id=${mediumId}&month=${monthId}`,
        adminConfig
      )
      .then(async (data) => {
        const urlParts = data.data.url.split(".");
        const extension = urlParts[urlParts.length - 1]
          .toLowerCase()
          .split("?")[0];
        await axios
          .get(data.data.url, {
            responseType: "blob",
          })
          .then((data) => {
            let mimeType = "application/octet-stream";
            if (extension === "pdf") {
              mimeType = "application/pdf";
            } else if (extension === "jpg" || extension === "jpeg") {
              mimeType = "image/jpeg";
            } else if (extension === "png") {
              mimeType = "image/png";
            }
            const file = new Blob([data.data], { type: mimeType });
            const fileURL = URL.createObjectURL(file);
            const pdfWindow = window.open();
            pdfWindow.location.href = fileURL;
          });
      });
  };

  const viewColumn = [
    {
      field: "view",
      headerName: "View Timetable",
      width: 200,
      sortable: false,
      editable: false,
      flex: 1,
      renderCell: (params) => {
        return (
          <div className="viewButton">
            <button
              className="btn"
              onClick={() =>
                handleViewSelect(
                  params.row.class_id,
                  params.row.medium_id,
                  params.row.month_id
                )
              }
            >
              View
            </button>
          </div>
        );
      },
    },
  ];
  return (
    <div className="teachers-container ">
      <Sidebar isExpandedHandler={isExpandedHandler} />
      <div className="teachers">
        <Navbar adminName={props.AdminName} />
        <div className="teachers-page page-container">
          <div className="teacherForm-page-container">
            <div className="teacherForm-page-container-heading">
              {/* header container */}
              <span>Add Timetable</span>
            </div>
            <form noValidate onSubmit={AddCurriculumHandler}>
              <div className="teachers-info-detail-container">
                <div className="teachers-info-detail-student-container">
                  <div className="teachers-info-detail-student-container-subheading">
                    <span>Timetable Details</span>
                  </div>
                  <div className="teachers-info-detail-student-container-textfield">
                    {/* row one */}
                    <div className="teachers-info-section ">
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                          Class
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={classs}
                          label="Curriculum"
                          onChange={handleClassChange}
                        >
                          {classes?.map((val) => {
                            return (
                              <MenuItem value={val.class_id}>
                                {val.class_name}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>

                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                          Medium
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={mediumId}
                          label="Curriculum"
                          onChange={handleMediumChange}
                        >
                          {mediums?.map((val) => {
                            return (
                              <MenuItem value={val.medium_id}>
                                {val.medium_name}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>

                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                          Month
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={monthId}
                          label="Curriculum"
                          onChange={handleMonthChange}
                        >
                          {months?.map((val) => {
                            return (
                              <MenuItem value={val.month_id}>
                                {val.month_name}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                    </div>

                    <div className="teachers-info-section ">
                      <form>
                        <Button variant="contained" component="label">
                          Upload File
                          <input
                            onChange={handleFileChange}
                            type="file"
                            hidden
                          />
                        </Button>{" "}
                        {fileName}
                      </form>
                    </div>
                  </div>
                </div>
                <div className="buttonSubmit">
                  {" "}
                  <button>Submit</button>{" "}
                </div>
              </div>
            </form>
          </div>
          <DataTable
            rows={rows}
            columns={columns.concat(viewColumn)}
            emptyRowsMessage={"No Curriculum yet"}
            loader={isLoading}
          />
        </div>
      </div>
      <ToastContainer />
      <Loader open={openLoader} />
    </div>
  );
};

export default AddCurriculum;
