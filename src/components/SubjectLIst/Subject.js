import React, { useEffect, useRef } from "react";
import Sidebar from "../Sidebar/Sidebar";
import Navbar from "../Navbar/Navbar";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import MenuItem from "@mui/material/MenuItem";
import { ToastContainer, toast } from "react-toastify";
import { Button } from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import DataTable from "../SuperAdminTable/SuperAdminTable";

import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import { FileDownload, Sort } from "@mui/icons-material";
import { GW_URL, adminConfig, superAdminConfig } from "../../config";
import "./SubjectList.scss";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const columns = [
  {
    field: "id",
    headerName: "Class",
    editable: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "subject",
    headerName: "Subject Name",
    width:200,
    flex: 1,
    editable: true,
    headerAlign: "left",
    align: "left",
  },

  // { field: 'id',headerName:"", width:0,hide:true },
  // { field: 'school_id', headerName: 'School Id', width: 50, flex: 1, editable: true, headerAlign: "center", align: "center", },
  // { field: 'school_name', flex: 1, headerName: 'School Name', width: 200, editable: true, headerAlign: "center", align: "center" },
  // { field: 'class', headerName: 'Class', width: 50, flex: 1, editable: true, headerAlign: "center", align: "center" },
  // { field: 'class id', headerName: '', width: 50,editable: true,hide:true },
];

const constSubjectss = [
  {
    subject_id: 1,
    subject_name: "Physics",
  },
  {
    subject_id: 2,
    subject_name: "Chemistry",
  },
  {
    subject_id: 3,
    subject_name: "Math",
  },
  {
    subject_id: 4,
    subject_name: "Biology",
  },
  {
    subject_id: 5,
    subject_name: "Hindi",
  },
  {
    subject_id: 6,
    subject_name: "English",
  },
  {
    subject_id: 7,
    subject_name: "SST",
  },
  {
    subject_id: 8,
    subject_name: "Sanskrit",
  },
  {
    subject_id: 9,
    subject_name: "Mental Ability",
  },
  {
    subject_id: 10,
    subject_name: "Spoken English",
  },
  {
    subject_id: 11,
    subject_name: "Arts",
  },
  {
    subject_id: 12,
    subject_name: "Commerce",
  },
  {
    subject_id: 13,
    subject_name: "Agriculture",
  },
  {
    subject_id: 14,
    subject_name: "Science",
  },
];

const AddSubject = (props) => {
  const [classs, setClasss] = useState("");
  const [schools, setSchools] = useState([]);
  const [classes, setClasses] = useState([]);
  const [rows, setRows] = useState([]);
  const [subjectId, setSubjectId] = useState([]);
  const [subject, setSubject] = useState([]);
  const [constSubjects, setConstSubjects] = useState(constSubjectss);
  const [subjects, setSubjects] = useState(constSubjectss);
  const inputRef = useRef(null);
  const [open, setOpen] = useState(false);

  const [subjectIdError, setSubjectIdError] = useState(false);

  const [isExpanded, setExpanded] = useState(false);
  const isExpandedHandler = (value) => {
    setExpanded(value);
  };
  let decodeToken = jwt_decode(localStorage.getItem("auth_token"));
  let school_id =
    localStorage.getItem("superadmin_school") === null
      ? decodeToken.result.school_id
      : localStorage.getItem("superadmin_school");

  useEffect(() => {
    axios
      .get(`${GW_URL}/school/${school_id}/getSubjectIds`, adminConfig)
      .then((data) => {
        let subjectArr = [];
        for (let i = 0; i < data.data.subject_id.length; i++) {
          subjectArr.push({
            subject_id: data.data.subject_id[i],
            subject_name: data.data.subject_name[i],
          });
        }
        setConstSubjects(subjectArr);
        setSubjects(subjectArr);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    axios
      .get(`${GW_URL}/schools`, superAdminConfig)
      .then((data) => {
        let allSchools = [];
        for (let i = 0; i < data.data.allSchool.length; i++) {
          allSchools.push({
            school_id: data.data.allSchool[i].id,
            school_name: data.data.allSchool[i].school_name,
          });
        }
        setSchools(allSchools);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  // useEffect(() => {
  //   axios
  //     .get(`${GW_URL}/schools/${school_id}/getClassId`, adminConfig)
  //     .then((data) => {
  //       let allClasses = [];
  //       for (let i = 0; i < data.data.class_id.length; i++) {
  //         allClasses.push({
  //           class_id: data.data.class_id[i],
  //           class_name: data.data.class_name[i],
  //         });
  //       }
  //       setClasses(allClasses);
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }, []);

  const { data: classIdData, isLoading: classIdLoading } = useQuery(
    ["classId", school_id],
    () =>
      axios
        .get(`${GW_URL}/schools/${school_id}/getClassId`, adminConfig)
        .then((res) => {
          
          return res.data?.class_id;
})
  );
  if(!classIdLoading)
  {
    console.log(classIdData);
  }

  useEffect(() => {
    renderSubjects();
  }, []);

  // in class change the subjects should be changed
  useEffect(() => {
    const checkClass = (obj) => obj.id == classs;
    if (rows.some(checkClass)) {
      function search(nameKey, myArray) {
        for (let i = 0; i < myArray.length; i++) {
          if (myArray[i].id == nameKey) {
            return myArray[i];
          }
        }
      }
      const classSubjectsExists = search(classs, rows).subject.split(", ");

      const classSubjects = constSubjects.filter(
        ({ subject_name: id1 }) =>
          !classSubjectsExists.some((id2) => id2 == id1)
      );
      setSubjects(classSubjects);
    } else {
      setSubjects(constSubjects);
    }
  }, [classs]);

  const renderSubjects = () => {
    axios
      .get(`${GW_URL}/school/${school_id}/getSchoolSubject`, adminConfig)
      .then((data) => {
        let allRows = [];
        for (const [key, value] of Object.entries(data.data.subjects)) {
          let val = value.subject_name.slice(0, value.subject_name.length - 2);
          allRows.push({ id: key, subject: val });
        }
        setRows(allRows);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const AddSubjectHandler = async (e) => {
    e.preventDefault();

    if (classs.length == 0) {
      toast.error("Please select class");
      return;
    }

    if (subject.length == 0) {
      toast.error("Please select subject");
      return;
    }
    if (classs && subject) {
      axios
        .post(
          `${GW_URL}/school/${school_id}/addSchoolSubject`,
          {
            class_id: classs,
            subject_id: subjectId,
          },
          adminConfig
        )
        .then((data) => {
          toast.success("Subject added successfully!", {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          renderSubjects();
          setClasss("");
          setSubject([]);
        })
        .catch((err) => {
          toast.error("Something went wrong!", {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
        });
    } else {
      toast.error("All field are required!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  const handleClassChange = (e) => {
    setClasss(e.target.value);
  };

  const handleSubjectChange = (event) => {
    const {
      target: { value },
    } = event;

    let duplicateRemoved = [];
    let dataIds = [];
    value.forEach((item) => {
      if (
        duplicateRemoved.findIndex((o) => o.subject_id === item.subject_id) >= 0
      ) {
        duplicateRemoved = duplicateRemoved.filter(
          (x) => x.subject_id === item.subject_id
        );
      } else {
        duplicateRemoved.push(item);
      }
    });

    duplicateRemoved.forEach((item) => {
      dataIds.push(item.subject_id);
    });
    setSubjectId(dataIds);
    setSubject(duplicateRemoved);
  };
  const inputFocushandler = (class_details) => {
    const { id } = class_details;
    inputRef.current.focus();
    setClasss(id);
  };

  const EditColumn = [
    {
      field: "edit",
      headerName: "Edit",

      editable: false,
      sortable: false,
      align: "center",
      headerAlign: "center",
     width:200,
      disableFilter: true,
      renderCell: (params) => {
        return (
          <div className="viewButton">
            <button
              style={{ marginRight: "5px" }}
              onClick={() => inputFocushandler(params.row)}
            >
              Edit
            </button>
          </div>
        );
      },
    },
  ];

  return (
    <div className="teachers-container ">
      <div className="teachers">
        <div className="teachers-page page-container">
          <div className="teacherForm-page-container">
            <div className="teacherForm-page-container-heading">
              {/* header container */}
              <span>Subject List</span>
            </div>
            <form noValidate onSubmit={AddSubjectHandler}>
              <div className="teachers-info-detail-container">
                <div className="teacher-info-detail-student-container">
                  <div className="subject-info-detail-student-container-subheading">
                    <span>Subjects Details</span>
                  </div>
                  <div className="teachers-info-detail-student-container-textfield">
                    {/* row one */}
                    <div className="subjects-info-section ">
                      <FormControl fullWidth>
                        <InputLabel
                          id="demo-simple-select-label"
                          ref={inputRef}
                          required
                        >
                          Class
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={classs}
                          label="Class"
                          onChange={handleClassChange}
                        >
                          {classes?.map((val) => {
                            return (
                              <MenuItem key={val.class_id} value={val.class_id}>
                                {val.class_name}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                      {/*  */}
                      <FormControl error={subjectIdError} fullWidth>
                        <InputLabel required id="demo-multiple-checkbox-label">
                          Subjects
                        </InputLabel>
                        <Select
                          labelId="demo-multiple-checkbox-label"
                          id="demo-multiple-checkbox"
                          multiple
                          required
                          value={subject}
                          onChange={handleSubjectChange}
                          input={<OutlinedInput label="Tag" />}
                          renderValue={(selected) =>
                            selected.map((x) => x.subject_name).join(", ")
                          }
                          MenuProps={MenuProps}
                        >
                          {subjects?.map((variant) => (
                            <MenuItem key={variant.course_id} value={variant}>
                              <Checkbox
                                checked={
                                  subject?.findIndex(
                                    (item) =>
                                      item.subject_id === variant.subject_id
                                  ) >= 0
                                }
                              />
                              <ListItemText primary={variant.subject_name} />
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
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
          <DataTable rows={rows} columns={columns.concat(EditColumn)} />
          {/* <ToastContainer /> */}
        </div>
      </div>
    </div>
  );
};

export default AddSubject;
