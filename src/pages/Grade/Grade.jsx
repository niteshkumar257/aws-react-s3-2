import React from "react";
import "./Grade.scss";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import DataTable from "../../components/DataTable/DataTable";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { MenuItem } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import useFetchAllStudent from "../../hooks/useFetchAllStudent";
import { ALL_STUDENT_FETCH_KEY } from "../../hooks/useFetchAllStudent";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GW_URL, Modalstyle, adminConfig } from "../../config";
import DataLoader from "../../components/Loader/DataLoader";
import Loader from "../../components/Loader/Loader";

// to modify the rows values ,capital lize the row values
const CapitalLizeFirstLetter = (arr) => {
  const modifiedArray = arr.map((item) => {
    const modifiedItem = {
      id: item.id,
      student_name: capitalizeFirstLetter(item.student_name),
      class_id: item.class_id,
      medium: item.medium,
      student_id: item.student_id,
      section: item.section,
    };
    return modifiedItem;
  });
  return modifiedArray;
};

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
const Studentcolumns = [
  {
    field: "id",
    headerName: "S No.",
    flex: 1,
    align: "left",
    headerAlign: "left",
  },
  {
    field: "student_id",
    hide: true,
    headerName: "Student Id",
    flex: 1,
    align: "left",
    headerAlign: "left",
  },
  {
    field: "student_name",
    headerName: "Name",
    editable: false,
    flex: 1,
    headerAlign: "left",
    align: "left",
  },
  {
    field: "class_id",
    headerName: "Class",
    type: "number",
    editable: false,
    flex: 1,
    headerAlign: "left",
    align: "left",
  },
  {
    field: "medium",
    headerName: "Medium",
    editable: false,
    align: "left",
    headerAlign: "left",
    flex: 1,
  },
  {
    field: "section",
    headerName: "Section",
    editable: false,
    align: "left",
    headerAlign: "left",
    flex: 1,
  },
];

const Grade = (props) => {
  const navigate = useNavigate();
  const [Studentrows, setStudentRows] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [test, setTest] = useState([]);
  const [student_id, setStudentId] = useState("");
  const [showButton, setShowButton] = useState(0);
  const [studenName, setStudentName] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [subject_list, setSubjectList] = useState([]);
  const [loading, setLoading] = useState(1);
  const [isLoadingStudentInfo, setIsloadingStudentInfo] = useState(false);
  const [dataLoaderOpen, setDataLoaderOpen] = useState(false);
  const [updateTestLoading, setUpdateLoading] = useState(false);
  const handleLowerClass = (rows) => {
    const modifiedRows = rows.map((row) => {
      if (row.class_id === -3) {
        return { ...row, class_id: "Nursery" };
      } else if (row.class_id === -2) {
        return { ...row, class_id: "KG-1" };
      } else if (row.class_id === -1) {
        return { ...row, class_id: "KG-2" };
      } else {
        return row;
      }
    });
    return modifiedRows;
  };
  const [test_id, setTestid] = useState(0);
  const [tempRow, setTempRow] = useState([]);
  const markUploadHandler = (e) => {
    e.preventDefault();
    pushMarks(test_id);
  };
  const [inputField, setInputField] = useState([]);
  let decodeToken = jwt_decode(localStorage.getItem("auth_token"));
  let school_id =
    localStorage.getItem("superadmin_school") === null
      ? decodeToken.result.school_id
      : localStorage.getItem("superadmin_school");

  const { isLoading, isError, data, error } = useFetchAllStudent(school_id);

  useEffect(() => {
    if (isError) {
      console.log(error);
    }
    if (!isLoading) {
      let allStudents = [];
      for (let i = 0; i < data?.data?.allStudent.length; i++) {
        allStudents.push({
          ...data?.data?.allStudent[i],
          id: i + 1,
          student_id: data?.data?.allStudent[i].id,
        });
      }
      setStudentRows(CapitalLizeFirstLetter(handleLowerClass(allStudents)));
    }
  }, [data]);

  const [classId, setClassId] = useState("");
  const handleOpen = (row) => {
    setOpenModal(true);
    setStudentId(row.student_id);
    setStudentName(row.student_name);

    if (row.class_id === "Nursery") {
      setClassId("-3");
    } else if (row.class_id === "KG-1") {
      setClassId("-2");
    } else if (row.class_id === "KG-2") {
      setClassId("-1");
    } else {
      setClassId(row.class_id);
    }

    axios
      .get(`${GW_URL}/schools/${school_id}/tests`, adminConfig)
      .then((data) => {
        setTest(data.data.testDetails);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleClose = (e) => {
    e.preventDefault();
    setShowButton(0);
    setInputField([]);
    setTestid(0);
    setStudentId("");
    setTempRow([]);
    setOpenModal(false);
    setSubjectList([]);
    setOpenDialog(false);
  };

  const updateGrade = ({ student_id, test_id }) => {
    return axios.post(
      `${GW_URL}/students/${student_id}/tests/${test_id}/uploadmarks`,
      {
        inputField,
      },
      adminConfig
    );
  };
  const queryClient = useQueryClient();
  const mutataion = useMutation({
    mutationFn: updateGrade,
    onSuccess: () => {
      queryClient.invalidateQueries(ALL_STUDENT_FETCH_KEY);
      setUpdateLoading(false);
      toast.success("Grade update successfully", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      setInputField([]);
      setTestid(0);
      setStudentId("");
      setTempRow([]);
      setOpenModal(false);
      setSubjectList([]);
      setOpenDialog(false);
    },
    onError: () => {
      setUpdateLoading(false);
      toast.error("Something went wrong", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      setInputField([]);
      setTestid(0);
      setStudentId("");
      setTempRow([]);
      setOpenModal(false);
      setSubjectList([]);
      setOpenDialog(false);
    },
  });

  const handleDialogConfirm = (e) => {
    setDataLoaderOpen(true);
    setUpdateLoading(true);
    mutataion.mutate({
      student_id,
      test_id,
    });
  };
  const handleDialogClose = (e) => {
    e.preventDefault();
    setOpenDialog(false);
    setSubjectList([]);
    setOpenModal(false);
  };
  const pushMarks = () => {
    setOpenDialog(true);
  };

  // for getting all testmarks
  useEffect(() => {
    if (test_id != 0) {
      let student_mark_obtained = [];
      setDataLoaderOpen(true);
      setSubjectList([]);
      setInputField([]);
      setTempRow([]);
      axios
        .get(`${GW_URL}/student/${student_id}/test/${test_id}`, adminConfig)
        .then((result) => {
          for (
            let i = 0;
            i < result.data.allMarksDetails?.subject_id?.length;
            i++
          ) {
            student_mark_obtained.push({
              test_id: test_id,
              subject_id: result.data.allMarksDetails.subject_id[i],
              subject_marks: result.data.allMarksDetails.mark_obtained[i],
            });
          }
          axios
            .get(
              `${GW_URL}/schools/${school_id}/${classId}/${test_id}/getTestTotalMarks`,
              adminConfig
            )
            .then((data) => {
              let testTotalMarks = data.data.allTestData;
              let tempRowData = [];
              axios
                .get(`${GW_URL}/student/${student_id}/getSubjects`, adminConfig)
                .then((data) => {
                  setDataLoaderOpen(false);
                  let allRequiredSubject = [];
                  setShowButton(1);
                  data.data?.allSubjects?.map((item) => {
                    if (
                      testTotalMarks?.subject_marks[item.subject_id] !=
                      undefined
                    ) {
                      const markData = {
                        mark_obtained:
                          student_mark_obtained.length > 0
                            ? student_mark_obtained.filter(
                                (a) =>
                                  a.test_id == test_id &&
                                  a.subject_id == item.subject_id
                              )[0]?.subject_marks
                            : "",
                        total_marks:
                          testTotalMarks.subject_marks[item.subject_id],
                        subject_id: item.subject_id,
                      };
                      allRequiredSubject.push(item);
                      tempRowData.push(markData);
                    }
                  });
                  setTempRow(tempRowData);
                  setSubjectList(allRequiredSubject);

                  setInputField(tempRowData);

                  setLoading(0);
                })
                .catch((err) => {
                  setDataLoaderOpen(false);
                });
            });
        });
    } else {
      setLoading(1);
    }
  }, [test_id]);

  const changeHandler = (index, e) => {
    e.preventDefault();
    let data = [...inputField];
    data[index][e.target.name] = e.target.value;
    setInputField(data);
    setTempRow([]);
  };
  // mark upload handler

  const UpdateColumn = [
    {
      field: "view",
      headerName: "Student Details",
      width: 200,
      sortable: false,
      // align:"center",
      // headerAlign:"center",
      disableColumnMenu: true,
      renderCell: (params) => {
        return (
          <div>
            <div className="UpdateButton">
              <button
                onClick={() => {
                  handleOpen(params.row);
                }}
              >
                Update
              </button>
            </div>
            {openModal && (
              <Modal
                open={openModal}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
                BackdropProps={{
                  style: { backgroundColor: "rgba(255, 255, 255, 0)" },
                }}
                sx={{ backdropFilter: "blur(.25px)" }}
              >
                <form onSubmit={markUploadHandler}>
                  <Box sx={Modalstyle}>
                    <div className="form-container">
                      <div className="heading">
                        <span>Mark Upload</span>
                      </div>
                      <div className="student-info">
                        <div className="student-info-modal">
                          <label>ID:</label>
                          <span>{student_id}</span>
                        </div>
                        <div className="student-info-modal">
                          <label>Name : </label>
                          <span>{studenName}</span>
                        </div>
                      </div>
                      <div className="test_id_select">
                        <TextField
                          sx={{ flex: 1 }}
                          select
                          label="Test ID"
                          required
                          defaultValue=""
                          onChange={(e) => {
                            setTestid(e.target.value);
                          }}
                        >
                          {test.length != 0 ? (
                            test?.map((option) => (
                              <MenuItem
                                key={option.test_id}
                                value={option.test_id}
                              >
                                {option.test_name}
                              </MenuItem>
                            ))
                          ) : (
                            <MenuItem>No test was happend</MenuItem>
                          )}
                        </TextField>
                      </div>
                      <div
                        className="modal-subject-main-container"
                        style={{
                          maxHeight: 300,
                          overflowY: "scroll",
                          right: 10,
                        }}
                      >
                        {!dataLoaderOpen &&
                          subject_list?.map((item, index) => (
                            <div
                              key={index}
                              className="modal-subject-container"
                            >
                              <div className="container">
                                <span>{item.subject_name}:</span>
                              </div>
                              <div>
                                <TextField
                                  defaultValue=""
                                  name="mark_obtained"
                                  value={tempRow[index]?.mark_obtained}
                                  onChange={(e) => changeHandler(index, e)}
                                  required
                                  helperText="Mark Obtained"
                                  variant="outlined"
                                />
                              </div>
                              <div>
                                <TextField
                                  name="total_marks"
                                  value={tempRow[index]?.total_marks}
                                  disabled
                                  onChange={(e) => changeHandler(index, e)}
                                  required
                                  helperText="Total Mark"
                                  variant="outlined"
                                />
                              </div>
                            </div>
                          ))}
                        {!loading &&
                          test_id != 0 &&
                          subject_list.length == 0 &&
                          !dataLoaderOpen && (
                            <h3 style={{ color: "red" }}>
                              This test is not conducted on class{" "}
                              {classId == -3
                                ? "Nursery"
                                : (classId == -2 ? "KG-2" : classId == -1)
                                ? "KG-1"
                                : classId}
                            </h3>
                          )}
                        {dataLoaderOpen && test_id != 0 && (
                          <DataLoader open={dataLoaderOpen} width={60} />
                        )}
                        {showButton == 1 && subject_list.length != 0 && (
                          <div className="form-button-submit">
                            {" "}
                            <button>Submit</button>{" "}
                          </div>
                        )}
                      </div>
                    </div>
                  </Box>
                </form>
              </Modal>
            )}
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
    <div className="grade-container ">
      <Sidebar isExpandedHandler={isExpandedHandler} />
      <div className="grade">
        <Navbar adminName={props.AdminName} />
        <div className="grade-page page-container">
          <div className="grade-detail-heading">
            <span>Mark Details</span>
            {/* <div className="grade-detail-search">
              <input type='number' placeholder='search by class-wise ....' />
              <div className="grade-detail-search-btn">
                <button className='btn'>SEARCH</button>
              </div>
            </div> */}
          </div>
          {
            <Box sx={{ Modalstyle }}>
              <DataTable
                rows={Studentrows}
                columns={Studentcolumns}
                emptyRowsMessage={"No grade available"}
              />
            </Box>
          }
        </div>
      </div>
      {openDialog && (
        <Dialog
          sx={{
            "& .MuiDialog-container": {
              justifyContent: "center",
              alignItems: "flex-start",
            },
          }}
          PaperProps={{
            sx: {
              width: "25%",
              height: "20%",
              justifyContent: "center",
              alignItems: "center",
            },
          }}
          open={openDialog}
          onClose={handleDialogClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Grade Update?"}</DialogTitle>

          <DialogActions>
            <Button
              style={{
                backgroundColor: "#1377C0",
                color: "white",
                fontSize: "0.7rem",
              }}
              onClick={handleDialogConfirm}
            >
              confirm
            </Button>
            <Button
              style={{
                backgroundColor: "red",
                color: "white",
                fontSize: "0.7rem",
              }}
              onClick={handleDialogClose}
              autoFocus
            >
              Cancel
            </Button>
          </DialogActions>
        </Dialog>
      )}
      <ToastContainer />
      <Loader open={updateTestLoading} />
    </div>
  );
};

export default Grade;
