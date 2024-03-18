import React, { useEffect } from "react";
import "./Studentpage.scss";
// import StudentImage from "../../assest/StudentImage.png";
import { useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import Table from "../../components/Table/TableFee";
import { useParams } from "react-router";
import axios from "axios";
import Chart from "../../components/Chart/Chart";
import Button from "@mui/material/Button";
import { Paper } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import ImageUrl from "../../assest/StudentImage.png";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CheckIcon from "@mui/icons-material/Check";
import CircularProgress from "@mui/material/CircularProgress";
import { Box } from "@mui/material";
import jwt_decode from "jwt-decode";
import FemalePhoto from "../../assest/female.jpg";
import MalePhoto from "../../assest/Male.jpg";
import {
  GW_URL,
  adminConfig,
  StudentInstallMentTable,
  subjects,
  months,
} from "../../config";
import Loader from "../../components/Loader/Loader";
import Fee from "../../assest/SchoolFee.png";
import { margin } from "@mui/system";
import DataLoader from "../../components/Loader/DataLoader";
import StudentInfo from "./StudentInfoContainer";
import StepChart from "../../components/StepChart/StepChart";
import CompareStudentLelvel from "./CompareStudentLelvel";

let MonthArray = [
  "Jan",
  "Feb",
  "March",
  "April",
  "Jan",
  "June",
  "July",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const columns = [
  {
    field: "id",
    headerName: "Installment No",
    width: 150,
    flex: 1,
    headerAlign: "left",
    align: "left",
    flex: 1,
    sortable: false,
  },
  {
    field: "amount",
    flex: 1,
    headerName: "Amount",
    width: 150,
    editable: false,
    headerAlign: "left",
    align: "left",
    sortable: false,
  },
  {
    field: "lastDate",
    headerName: "Last Date",
    width: 150,
    flex: 1,
    editable: false,
    headerAlign: "left",
    align: "left",
    sortable: false,
  },
  {
    field: "status",
    headerName: "Status",
    type: "date",
    width: 150,
    flex: 1,
    editable: false,
    headerAlign: "left",
    sortable: false,
    align: "left",
  },
];
const newString = (headerName) => {
  headerName = headerName.replace(/_/g, " ");
  headerName = headerName
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
  return headerName;
};

const SingleStudentpage = (props) => {
  const params = useParams();
  let student_id = params.student_id;

  // Student Detail state
  const [name, setName] = useState("Nitesh Kumar Reeddy");
  const [StudentImage, setStudentImage] = useState("");
  const [medium, setMedium] = useState("English");
  const [course, setCourse] = useState("JEE");
  const [gender,setGender]=useState("male");
  const [board, setBoard] = useState("ICSE");
  const [Class, setClass] = useState("12th");
  const [section, setSection] = useState("");
  const [fathername, setFathername] = useState("G NagaRaju Reddy");
  const [mothername, setMotherrname] = useState("G Laxmi Reddy");
  const [fatherProfession, setFatherProfession] = useState("Worker");
  const [motherProfession, setMotherProfessin] = useState("Housewife");
  const [childrenCount, setChildrenCount] = useState(3);
  const [altNumber, setAltNumber] = useState("8767856873");
  const [primaryNumber, setPrimaryNumber] = useState("58383432");
  const [email, SetEmail] = useState("niteshredd257@gmail.com");
  const [total_fees, setTotalFees] = useState("");
  const [first_installment_status, setFirstInstallment] = useState(0);
  const [second_installment_status, setSecondInstallment] = useState(0);
  const [third_installment_status, setThirdInstallment] = useState(0);
  const [testDetail, setTestDetail] = useState([{}]);
  const [feeDetails, setFeeDetails] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [installmentId, setInstallmentId] = useState(0);
  const [showPerformance, setShowPerformance] = useState(true);
  const [buttonValue, setButtonValue] = useState("Show");
  const [IsloadingStudentFeeDetails, setIsLoadingStudentFeeDetails] =
    useState(false);
  const [IsloadinStudentPeformanceDetails, setIsloadingPerformanceDetails] =
    useState(false);
  const [subjectListGraph, setSubjectListGraph] = useState();
  const [studentStream, setStudentStream] = useState("");

  const [isLodingStudentDetails, setIsLoadingStudentdetails] = useState(true);
  const [isLoadingParentDetails, setIsLoadingParentsDetails] = useState(true);

  const [loaderOpen, setLoaderOpen] = useState(false);
  const [subjectListCol, setSubjectListCol] = useState([]);
  const [subjectListRow, setSubjectListRow] = useState([]);
  let decodeToken = jwt_decode(localStorage.getItem("auth_token"));

  let school_id =
    localStorage.getItem("superadmin_school") === null
      ? decodeToken.result.school_id
      : localStorage.getItem("superadmin_school");

  let TestTableColumn = [];
  let TestTableRow = [];
  const getColumnsForDifferentPeformanceTable = (subject) => {
    TestTableColumn.push({ field: "test_id" });
    TestTableColumn.push({ field: "serial_no" });
    TestTableColumn.push({ field: "test_date" });
    TestTableColumn.push({ field: "test_name" });

    subject.map((item, index) => {
      let data = {};
      data.field = item.subject_name;
      TestTableColumn.push(data);
    });

    TestTableColumn.push({ field: "percentage" });
    for (let i = 0; i < TestTableColumn.length; i++) {
      TestTableColumn[i].align = "left";

      TestTableColumn[i].sortable = false;
      if (TestTableColumn[i].field == "serial_no") {
      }
      if (
        TestTableColumn[i].field == "test_name" ||
        TestTableColumn[i].field == "test_date"
      ) {
      }

      TestTableColumn[i].hide =
        TestTableColumn[i].field === "test_id" ? true : false;
      TestTableColumn[i].headerName =
        TestTableColumn[i].field === "serial_no"
          ? "S No"
          : newString(TestTableColumn[i].field);
      TestTableColumn[i].valueGetter = (params) =>
        params.row[TestTableColumn[i].field] || "---";

      TestTableColumn[i].width = 150;
    }

    return TestTableColumn;
  };

  const getRowsForDifferentPeformanceTable = (subjects) => {
    subjects.map((item, index) => {
      let temp = Object.entries(item);
      const subjectArray = [];
      const markArray = [];
      temp.map((item, index) => {
        if (item[0] === "subject_name")
          item[1].map((it, index) => {
            subjectArray.push(it);
          });
        if (item[0] === "mark_obtained")
          item[1].map((it, index) => {
            it > 0 ? markArray.push(it) : markArray.push("Absent");
          });
      });

      const result = {};
      temp.map((item, index) => {
        if (
          item[0] === "test_id" ||
          item[0] === "test_date" ||
          item[0] === "percentage"
        )
          result[item[0]] = item[1];

        if (item[0] === "test_id") {
          result["id"] = item[1];
        }
        if (item[0] === "percentage") {
          result[item[0]] = item[1] + "%";
        }
        if (item[0] == "test_date") {
          result[item[0]] = item[1].slice(0, 10);
        }

        if (item[0] == "test_name") {
          result[item[0]] = item[1];
        }
      });

      for (let i = 0; i < markArray.length; i++)
        result[subjectArray[i]] = markArray[i];

      TestTableRow.push(result);
    });
    const rowRowwithSerialNo = TestTableRow.map((item, index) => {
      return { ...item, serial_no: index + 1 };
    });

    return rowRowwithSerialNo;
  };
  const generateRowsWithMissingColumns = (rows) => {
    const missingColumns = columns.map((column) => column.field);

    return rows.map((row) => {
      const newRow = { ...row };

      missingColumns.forEach((column) => {
        if (!newRow.hasOwnProperty(column)) {
          newRow[column] = "";
        }
      });

      return newRow;
    });
  };

  const getSubjectList = () => {
    axios
      .get(
        `${GW_URL}/schools/${school_id}/${Class}/getClassSubjects`,
        adminConfig
      )
      .then((res) => {
        setSubjectListCol(
          getColumnsForDifferentPeformanceTable(res.data.subjects)
        );
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // convert the data to compatibale with the graph structure
  const generateSubjectWiseMarks = (d) => {
    const subjectWiseTest = [];

    d?.forEach((data) => {
      const { test_id, mark_obtained, total_marks, subject_name, test_date } =
        data;

      const [day, month, year] = test_date.split("-").map(Number);
      const foundMonth = months.find((m) => m.month_id === month);

      subject_name?.forEach((subject, i) => {
        const newItem = {
          value: subject,
          lable: subject,
          temp: "TotalMark",
          color: "#82ca9d",
          arr: [
            {
              Month: foundMonth.month_name,
              "Mark obtained": mark_obtained[i],
              "Total mark": total_marks[i],
              Virtual_totalmark: 100,
            },
          ],
        };

        const existingSubject = subjectWiseTest.find(
          (item) => item.value === subject
        );
        if (existingSubject) {
          existingSubject.arr.push(newItem.arr[0]);
        } else {
          subjectWiseTest.push(newItem);
        }
      });
    });

    const subjectIdMap = {};
    subjects.forEach((subject) => {
      subjectIdMap[subject.subject_name] = subject.subject_id;
    });
    subjectWiseTest.map((a) => {});
    subjectWiseTest.sort((a, b) => {
      const subjectIdA = subjectIdMap[a.value];
      const subjectIdB = subjectIdMap[b.value];

      return subjectIdA - subjectIdB;
    });

    const filteredData = subjectWiseTest
      .map((subject) => ({
        ...subject,
        arr: subject.arr.filter((entry) => entry["Mark obtained"] >= 0),
      }))
      .filter((subject) => subject.arr.length > 0);

    return filteredData;
  };

  const renderFees = () => {
    setIsLoadingStudentFeeDetails(true);
    axios
      .get(`${GW_URL}/students/${student_id}/fees`, adminConfig)
      .then((data) => {
        setIsLoadingStudentFeeDetails(false);
        let tot =
          parseInt(data.data.studentFees[0].first_installment) +
          parseInt(data.data.studentFees[0].second_installment) +
          parseInt(data.data.studentFees[0].third_installment);
        setTotalFees(tot);

        let dateString = data.data.studentFees[0].first_installment_eta;
        let date1 =
          dateString.slice(8, 10) +
          "-" +
          dateString.slice(5, 7) +
          "-" +
          dateString.slice(0, 4);
        dateString = data.data.studentFees[0].second_installment_eta;
        let date2 =
          dateString.slice(8, 10) +
          "-" +
          dateString.slice(5, 7) +
          "-" +
          dateString.slice(0, 4);
        dateString = data.data.studentFees[0].third_installment_eta;
        let date3 =
          dateString.slice(8, 10) +
          "-" +
          dateString.slice(5, 7) +
          "-" +
          dateString.slice(0, 4);

        let newFeeDetails = [];
        let arr1 = {
          id: 1,
          amount: data.data.studentFees[0].first_installment,
          lastDate: date1,
          status:
            data.data.studentFees[0].first_installment_status
              .charAt(0)
              .toUpperCase() +
            data.data.studentFees[0].first_installment_status.slice(1),
        };
        let arr2 = {
          id: 2,
          amount: data.data.studentFees[0].second_installment,
          lastDate: date2,
          status:
            data.data.studentFees[0].second_installment_status
              .charAt(0)
              .toUpperCase() +
            data.data.studentFees[0].second_installment_status.slice(1),
        };
        let arr3 = {
          id: 3,
          amount: data.data.studentFees[0].third_installment,
          lastDate: date3,
          status:
            data.data.studentFees[0].third_installment_status
              .charAt(0)
              .toUpperCase() +
            data.data.studentFees[0].third_installment_status.slice(1),
        };
        newFeeDetails.push(arr1);
        newFeeDetails.push(arr2);
        newFeeDetails.push(arr3);
        setFeeDetails(newFeeDetails);

        setFirstInstallment(arr1.status);
        setSecondInstallment(arr2.status);
        setThirdInstallment(arr3.status);
      })
      .catch((err) => {
        alert("Something went wrong");
        setIsLoadingStudentFeeDetails(false);
        console.log(err);
      });
  };

  const updatePayment = (
    first_installment_status,
    second_installment_status,
    third_installment_status
  ) => {
    axios
      .put(
        `${GW_URL}/students/${student_id}/updatepaymentstatus`,
        {
          first_installment_status,
          second_installment_status,
          third_installment_status,
        },
        adminConfig
      )
      .then((data) => {
        setLoaderOpen(false);
        toast.success(data.data.message, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
        renderFees();
      })
      .catch((err) => {
        setLoaderOpen(false);
        alert("Something went wrong");
        console.log(err);
        toast.error(err.error, {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      });
  };

  useEffect(() => {
    let parent_id;
    // axios request for student details
    axios
      .get(`${GW_URL}/students/${student_id}`, adminConfig)
      .then((data) => {
        setIsLoadingStudentdetails(false);
        setName(data.data.studentDetails[0].student_name);
        setSection(data.data.studentDetails[0].section);
        setMedium(data.data.studentDetails[0].medium);
        setGender(data.data.studentDetails.gender);
        setCourse(data.data.studentDetails[0].course_name);
        setBoard(data.data.studentDetails[0].board);
        setClass(data.data.studentDetails[0].class_id);
        setStudentImage(data.data.studentDetails[0].photo_url);
        setStudentStream(data.data.studentDetails[0].stream);

        parent_id = data.data.studentDetails[0].parent_id;
        // axios request for parent details
        axios
          .get(`${GW_URL}/parents/${parent_id}`, adminConfig)
          .then((data) => {
            setIsLoadingParentsDetails(false);
            setPrimaryNumber(data.data.parentDetails.whatsapp_no);
            SetEmail(data.data.parentDetails.email);
            setMotherProfessin(data.data.parentDetails.mother_profession);
            setMotherrname(data.data.parentDetails.mother_name);
            setFathername(data.data.parentDetails.father_name);
            setFatherProfession(data.data.parentDetails.father_profession);
            setAltNumber(data.data.parentDetails.alternative_mobile);
            setChildrenCount(data.data.parentDetails.children);
            // function for request for fee details
            renderFees();
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const handleDialogClose = () => {
    setOpenDialog(false);
  };
  const handleDialogDisagree = () => {
    setOpenDialog(false);
    setInstallmentId(0);
  };
  const handleDialogAgree = () => {
    setLoaderOpen(true);
    if (installmentId == 1) {
      setFirstInstallment("Paid");
      updatePayment(
        "Paid",
        second_installment_status,
        third_installment_status
      );
    } else if (installmentId == 2) {
      setSecondInstallment("Paid");
      updatePayment(first_installment_status, "Paid", third_installment_status);
    } else {
      setThirdInstallment("Paid");
      updatePayment(
        first_installment_status,
        second_installment_status,
        "Paid"
      );
    }
    setInstallmentId(0);
    setOpenDialog(false);
  };
  const InstallmentUpdateHandler = (id) => {
    setOpenDialog(true);
    setInstallmentId(id);
  };

  // Dynamic button InstallMent Status update
  const viewColumn = [
    {
      field: "view",
      headerName: "Update",
      width: 200,
      editable: false,
      sortable: false,
      align: "left",
      headerAlign: "left",
      flex: 1,
      renderCell: (params) => {
        return (
          <div className="InstallmentUpdateHandler">
            {/* <Link   to= {`/Student/${studentId}`} style={{ textDecoration: "none" }}> */}

            {params.row.status === "Unpaid" ? (
              <button onClick={() => InstallmentUpdateHandler(params.row.id)}>
                Update
              </button>
            ) : (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  color: "green",
                  marginLeft: "1rem",
                }}
              >
                <CheckIcon
                  sx={{
                    fontSize: "1.5rem",
                    fontWeight: "300",
                  }}
                />
              </div>
            )}
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
              <DialogTitle id="alert-dialog-title">
                {" InstallMent Updated  ?"}
              </DialogTitle>

              <DialogActions>
                <Button
                  style={{
                    backgroundColor: "#1377C0",
                    color: "white",
                    fontSize: "0.7rem",
                  }}
                  onClick={handleDialogAgree}
                >
                  Confirm
                </Button>
                <Button
                  style={{
                    backgroundColor: "red",
                    color: "white",
                    fontSize: "0.7rem",
                  }}
                  onClick={handleDialogDisagree}
                  autoFocus
                >
                  Cancel
                </Button>
              </DialogActions>
            </Dialog>
          </div>
        );
      },
    },
  ];

  // Sidebar toggle Handler
  const [isExpanded, setExpanded] = useState(false);
  const isExpandedHandler = (value) => {
    setExpanded(value);
  };

  const perFormanceHandler = (e) => {
    e.preventDefault();
    getSubjectList();
    setIsloadingPerformanceDetails(true);
    axios
      .get(`${GW_URL}/students/${student_id}/performance`, adminConfig)
      .then((data) => {
        setIsloadingPerformanceDetails(false);
        for (let i = 0; i < data.data.allmarksDetail.length; i++) {
          let dateString = data.data.allmarksDetail[i].test_date;
          let date1 =
            dateString.slice(8, 10) +
            "-" +
            dateString.slice(5, 7) +
            "-" +
            dateString.slice(0, 4);
          data.data.allmarksDetail[i].test_date = date1;
        }

        setTestDetail(data.data.allmarksDetail);

        setSubjectListRow(
          generateRowsWithMissingColumns(
            getRowsForDifferentPeformanceTable(data.data.allmarksDetail)
          )
        );
        setSubjectListGraph(generateSubjectWiseMarks(data.data.allmarksDetail));
      })
      .catch((err) => {
        setIsloadingPerformanceDetails(false);
        console.log(err);
      });

    if (!showPerformance) {
      setShowPerformance(true);
      setButtonValue("Hide");
    } else {
      setShowPerformance(false);
      setButtonValue("Show");
    }
  };

  return (
    <>
      <div className="SingleStudent-container">
        <Sidebar isExpandedHandler={isExpandedHandler} />
        <div className="singleStudent">
          <Navbar adminName={props.AdminName} />
          {/* main contaiener */}
          <div className="singleStudentPage-container page-container">
            {/* student Details container  */}
            {isLodingStudentDetails ? (
              <div className="student-info-main-container">
                <DataLoader />
              </div>
            ) : (
              <div className="student-info-main-container">
                <div className="student-info-heading">
                  <h1>Student Details</h1>
                </div>
                <div className="section basic-info">
                  <div className="basic-info-left">
                    <div className="studentImageWrapper">
                      <img
                        style={{
                          width: "150px",
                          height: "150px",
                          marginLeft: "0px",
                        }}
                        src={StudentImage ? StudentImage : gender==="male"?MalePhoto:FemalePhoto}
                        alt="profile"
                      ></img>
                    </div>
                  </div>
                  <div className="basic-info-right">
                    <div className="student-Name">
                      <span>{name?.toUpperCase()}</span>
                    </div>
                    <div className="other-info-container">
                      <div className="other-detail-info-container">
                        <div className="student">
                          <span
                            className="label"
                            style={{ color: "#1377C0", fontSize: ".9rem" }}
                          >
                            {" "}
                            Medium:
                          </span>
                          <span>{medium}</span>
                        </div>
                        <div className="student">
                          <span className="lable"> Class:</span>
                          <span>
                            {Class == -3
                              ? "Nursery"
                              : Class == -2
                              ? "KG-1"
                              : Class == -1
                              ? "KG-2"
                              : Class}
                          </span>
                        </div>

                        {Class > 10 && (
                          <div className="student">
                            <span className="lable"> Stream:</span>
                            <span>{studentStream}</span>
                          </div>
                        )}
                      </div>
                      <div className="other-detail-info-container">
                        <div className="student">
                          <span className="lable">Course:</span>
                          <span>
                            {course?.charAt(0).toUpperCase() + course.slice(1)}
                          </span>
                        </div>
                        <div className="student">
                          <span className="lable">Board:</span>
                          <span>
                            {board?.charAt(0).toUpperCase() + board.slice(1)}
                          </span>
                        </div>

                        {Class > 10 && (
                          <div className="student">
                            {/* For maintaining space */}
                          </div>
                        )}
                      </div>
                      <div className="other-detail-info-container">
                        <div className="student">
                          <span className="lable">Student Id:</span>
                          <span>{student_id}</span>
                        </div>
                        <div className="student">
                          <span
                            className="label"
                            style={{ color: "#1377C0", fontSize: ".9rem" }}
                          >
                            {" "}
                            Section:
                          </span>
                          <span>{section}</span>
                        </div>
                        {Class > 10 && (
                          <div className="student">
                            {/* For maintaining space */}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* student Parent detaiils  */}
            <div className="section  parent-info">
              <div className="parent-info-heading">
                <h1>Parent Details</h1>
              </div>
              {isLoadingParentDetails ? (
                <div className="parent-detail-info-container">
                  <DataLoader />
                </div>
              ) : (
                <div className="parent-info-container">
                  <div className="parent-detail-info-container">
                    <div className="parent-detail-info-container-subbox">
                      <span className="lable">Father Name:</span>
                      <span>
                        {fathername?.charAt(0).toUpperCase() +
                          fathername.slice(1)}
                      </span>
                    </div>
                    <div className="parent-detail-info-container-subbox">
                      <span className="lable">Mother Name:</span>
                      <span>
                        {mothername?.charAt(0).toUpperCase() +
                          mothername.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div className="parent-detail-info-container">
                    <div className="parent-detail-info-container-subbox">
                      <span className="lable">Email:</span>
                      <span>{email}</span>
                    </div>
                    <div className="parent-detail-info-container-subbox">
                      <span className="lable">Phone Number:</span>
                      <span>{primaryNumber}</span>
                    </div>
                  </div>
                  <div className="parent-detail-info-container">
                    <div className="parent-detail-info-container-subbox">
                      <span className="lable">Alternate Number:</span>
                      <span>{altNumber}</span>
                    </div>
                    <div className="parent-detail-info-container-subbox">
                      <span className="lable">Total children:</span>
                      <span>{childrenCount}</span>
                    </div>
                  </div>
                  <div className="parent-detail-info-container">
                    <div className="parent-detail-info-container-subbox">
                      <span className="lable">Father Profession :</span>
                      <span>
                        {fatherProfession?.charAt(0).toUpperCase() +
                          fatherProfession.slice(1)}
                      </span>
                    </div>
                    <div className="parent-detail-info-container-subbox">
                      <span className="lable">Mother Profession :</span>
                      <span>
                        {motherProfession?.charAt(0).toUpperCase() +
                          motherProfession.slice(1)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* student Fee details */}
            <div className="section  fee-info">
              <div className="fee-details-heading">
                <h1>Fee Details</h1>
              </div>
              <div className="top-container">
                <div className="total-fee-container">
                  <div className="left">
                    <div className="fee-amount">
                      <span>Total Fees</span>
                      <h1>{total_fees}</h1>
                    </div>
                    <div className="feeIcon">
                      <img src={Fee} alt="fee"></img>
                    </div>
                  </div>
                  <div className="right"></div>
                </div>
              </div>
              <div className="bottom">
                <Table
                  rows={feeDetails}
                  columns={StudentInstallMentTable.concat(viewColumn)}
                  loader={IsloadingStudentFeeDetails}
                />
              </div>
            </div>
            {/* student performance details */}
            <div className="section perfomanceAnalytic-info">
              <div className="performanceAnalytic-heading">
                <h1>Performance Analytic</h1>
              </div>
              <div className="performanceAnalytic-toggle-button">
                {showPerformance && (
                  <button onClick={perFormanceHandler}>{buttonValue}</button>
                )}
              </div>
              {!showPerformance && subjectListCol.length > 0 ? (
                <div className="PerformanceAnalytic-body">
                  <div className="performanceAnalytic-body-content">
                    <div className="perfomanceAnalytic-body-content-table">
                      {subjectListRow.length > 0 ? (
                        <Table
                          rows={subjectListRow}
                          columns={subjectListCol}
                          emptyRowsMessage={"No test Given"}
                          loader={IsloadinStudentPeformanceDetails}
                        />
                      ) : (
                        <Paper
                          elevation={3}
                          sx={{
                            width: "100%",
                            height: 200,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            borderRadius: 4,
                          }}
                        >
                          <span
                            style={{
                              fontSize: 20,
                            }}
                          >
                            No test given
                          </span>
                        </Paper>
                      )}
                    </div>
                    <div className="performanceStudentContainer">
                      <div className="performanceAnalytic-body-content-charts">
                        <div>
                          <span>Mark Details </span>
                        </div>

                        {subjectListGraph?.map((item, index) => (
                          <div key={index} className="container">
                            <div className="heading">
                              <span className="head">{item.value}</span>
                            </div>
                            <div className="content">
                              <Chart
                                color={item.color}
                                temp={item.temp}
                                total_mark={"Total mark"}
                                Mark_obtained={"Mark obtained"}
                                data={item.arr}
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="performanceAnalytic-body-content-charts">
                        <div>
                          <span>Level Details </span>
                        </div>
                        <CompareStudentLelvel
                          school_id={school_id}
                          student_id={student_id}
                          class_id={Class}
                          medium={medium}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                !showPerformance && (
                  <span
                    style={{
                      textAlign: "center",
                    }}
                  >
                    No subject added to Class{" "}
                    {Class == -3
                      ? "Nursery"
                      : Class == -2
                      ? "KG-1"
                      : Class == -1
                      ? "KG-2"
                      : Class}
                  </span>
                )
              )}
            </div>
          </div>
        </div>

        <ToastContainer />
        <Loader open={IsloadinStudentPeformanceDetails} />
      </div>
    </>
  );
};
export default SingleStudentpage;
