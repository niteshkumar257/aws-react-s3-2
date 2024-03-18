import { useState, useEffect } from "react";
import "./TeacherPage.scss";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import axios from "axios";
import { useParams } from "react-router-dom";
import Table from "../../components/Table/TableFee";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogTitle from "@mui/material/DialogTitle";
import Modal from "@mui/material/Modal";
import { TextField, Stack, MenuItem } from "@mui/material";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CircularProgress from "@mui/material/CircularProgress";
import ImageUrl from "../../assest/PlacholderImage.jpg";
import {
  GW_URL,
  adminConfig,
  subjects as allSubjects,
  getIndianDate,
  subjectJson,
} from "../../config";
import Loader from "../.././components/Loader/Loader";
import { classes as Allclasses } from "../../config";
import dayjs from "dayjs";
import AddTeacherClass from "./AddTeacherClass";
import usefetchClassDetails from "../../hooks/useFetchTeacherClassDetails";
import DataTable from "../../components/Table/TableFee";

//  Mnoths data
const Month = [
  {
    year: "2023",
    months: [
      { value: "Jan", lable: "Jan" },
      { value: "Feb", lable: "Feb" },
      { value: "March", lable: "March" },
      { value: "April", lable: "April" },
      { value: "May", lable: "May" },
      { value: "June", lable: "June" },
      { value: "July", lable: "July" },
      { value: "Aug", lable: "Aug" },
      { value: "Sep", lable: "Sep" },
      { value: "Oct", lable: "Oct" },
      { value: "Nov", lable: "Nov" },
      { value: "Dec", lable: "Dec" },
    ],
  },

  {
    year: "2024",
    months: [
      { value: "Jan", lable: "Jan" },
      { value: "Feb", lable: "Feb" },
      { value: "March", lable: "March" },
      { value: "April", lable: "April" },
      { value: "May", lable: "May" },
      { value: "June", lable: "June" },
      { value: "July", lable: "July" },
      { value: "Aug", lable: "Aug" },
      { value: "Sep", lable: "Sep" },
      { value: "Oct", lable: "Oct" },
      { value: "Nov", lable: "Nov" },
      { value: "Dec", lable: "Dec" },
    ],
  },
];

const Year = [
  { value: "2023", label: "2023" },
  { value: "2024", label: "2024" },
];

const columns = [
  {
    field: "id",
    headerName: "SI.No",
    width: 150,
    headerAlign: "left",
    align: "left",
    flex: 1,
    sortable: false,
  },
  {
    field: "month",
    headerName: "Month",
    width: 150,
    editable: false,
    headerAlign: "left",
    align: "left",
    sortable: false,
    flex: 1,
  },
  {
    field: "year",
    headerName: "Year",
    type: "number",
    width: 150,
    editable: false,
    headerAlign: "left",
    sortable: false,
    flex: 1,
    align: "left",
  },
  {
    field: "amount",
    headerName: "Amount",
    type: "number",
    width: 150,
    editable: false,
    headerAlign: "left",
    sortable: false,
    flex: 1,
    align: "left",
  },
];

const classDetailsColumns = [
  {
    field: "id",
    headerName: "SI.No",
    width: 150,
    headerAlign: "left",
    align: "left",
    flex: 1,
    hide: true,
    sortable: false,
  },
  {
    field: "class_id",
    headerName: "Class",
    width: 150,
    editable: false,
    headerAlign: "left",
    align: "left",
    sortable: false,
    flex: 1,
  },
  {
    field: "medium",
    headerName: "Medium",
    type: "text",
    width: 150,
    editable: false,
    headerAlign: "left",
    sortable: false,
    flex: 1,
    align: "left",
  },
  {
    field: "sections",
    headerName: "Section",
    type: "text",
    width: 150,
    editable: false,
    headerAlign: "left",
    sortable: false,
    flex: 1,
    align: "left",
  },
  {
    field: "subjects",
    headerName: "subjects",
    type: "text",
    width: 150,
    editable: false,
    headerAlign: "left",
    sortable: false,
    flex: 1,
    align: "left",
  },
];

const transformData = (input) => {
  return input
    .map((classData) => {
      const transformedData = [];
      classData?.medium_section?.forEach((mediumSection) => {
        Object.keys(mediumSection).forEach((medium, index) => {
          const sections = mediumSection[medium].join(", ");
          transformedData.push({
            class_name: classData.class_name,
            medium: medium,
            section: sections,
          });
        });
      });

      return transformedData;
    })
    .flat();
};

const SingleTeacherPage = (props) => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 500,
    height: 400,
    bgcolor: "background.paper",
    border: "none",
    borderRadius: 3,
    boxShadow: 24,
    p: 4,
  };
  const [openModal, setOpenModal] = useState(false);
  const [openAddClassModal, setopenAddClassModal] = useState(false);
  const handleOpen = () => setOpenModal(true);
  const handleClose = () => setOpenModal(false);
  const handleAddClassOpen = () => setopenAddClassModal(true);
  const handleAddClassClose = () => setopenAddClassModal(false);

  let params = useParams();
  const [name, setName] = useState("");
  const [medium, setMedium] = useState("");
  const [email, SetEmail] = useState("");
  const [age, setAge] = useState(23);
  const [salary, setSalary] = useState(10000);
  const [City, setCity] = useState("");
  const [workExp, setWorkExp] = useState(10);
  const [classes, setClasses] = useState([]);
  const [qualification, setQualification] = useState("");
  const [date, setDate] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [gender, setGender] = useState("Male");
  const [teacherImage, setTeacherImage] = useState("");

  // salary update useState variable
  const [year, setYear] = useState("");
  const [month, setMonth] = useState("");
  const [amount, setAmount] = useState("");
  const [yearError, setYearError] = useState(false);
  const [monthError, setMonthError] = useState(false);
  const [amountError, setAmountError] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [rows, setRows] = useState([]);
  const [teacherClassDetailsRows, setTeacherClassDetailsRows] = useState([]);
  const [dummyMonth, setDummyMonth] = useState(Month);

  const [loaderOpen, setLoaderOpen] = useState(false);

  let teacher_id = params.TeacherId;

  const renderSalary = () => {
    axios
      .get(`${GW_URL}/teacher/${teacher_id}/paymentdetails`, adminConfig)
      .then((data) => {
        let allSalary = data.data.teacherDetails;
        let salary = [];
        for (let i = 0; i < allSalary.length; i++) {
          salary.push({
            id: i + 1,
            amount: allSalary[i].amount,
            year: allSalary[i].year,
            month: allSalary[i].month,
          });
        }
        setRows(salary);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  let MonthSort = [];
  let SalaryRow = Object.entries(rows);
  const todayDate = new Date();
  let curentYear = todayDate.getFullYear();

  SalaryRow.map((value) => {
    if (value[1].year == curentYear) {
      MonthSort.push(value[1].month);
    }
  });
  const [newMonths, setNewMonths] = useState([]);

  const { isLoading, data } = usefetchClassDetails(teacher_id);

  useEffect(() => {
    if (!isLoading) {
      let array_list = data.data.class_medium_section_subject_list;
      let count = 0;
      for (let element of array_list) {
        element.id = count++;
        let subject_list = element?.subjects || [];
        let new_subject_list = [];
        for (let sub of subject_list) {
          new_subject_list.push(subjectJson[sub]);
        }

        element.subjects = new_subject_list;
      }

      setTeacherClassDetailsRows(array_list);
    }
  }, [data]);

  const yearSelectHandler = async (e) => {
    setYear(e.target.value);
    let todayDate = new Date();
    let currentYear = todayDate.getFullYear();
    const parts = date.split("-");
    const day = parseInt(parts[0], 10);
    const monthIndex = parseInt(parts[1], 10) - 1; // Subtract 1 from the month since January is represented by 0
    const year = parseInt(parts[2], 10);
    const date1 = new Date(year, month, day);
    let monthsbBeforeJoining = [];
    const months = [
      "Jan",
      "Feb",
      "March",
      "April",
      "May",
      "June",
      "July",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    for (let i = 0; i < monthIndex; i++) {
      monthsbBeforeJoining.push(months[i]);
    }

    const filteredMonths = dummyMonth.map((yearItem) => {
      const year = yearItem.year;
      const months = yearItem.months;

      const filteredMonths = months.filter((monthItem) => {
        const month = monthItem.value;

        return !rows.some((salaryItem) => {
          return salaryItem.year === year && salaryItem.month === month;
        });
      });

      return { year, months: filteredMonths };
    });

    const newfilteredMonths = filteredMonths.filter((item) => {
      return item.year === e.target.value;
    });

    const MonthfilteredMonths = newfilteredMonths.map((obj) => {
      if (obj.year == year) {
        return {
          ...obj,
          months: obj.months.filter(
            (month) => !monthsbBeforeJoining.includes(month.value)
          ),
        };
      }
      return obj;
    });

    setNewMonths(MonthfilteredMonths[0].months);
    setDummyMonth(Month);
  };
  const salaryAmountHandler = (e) => {
    if (e.target.value < 0) {
      setAmount(-e.target.value);
    } else setAmount(e.target.value);
  };
  const handleAgree = () => {
    setOpenModal(false);
    if (year == "") setYearError(true);
    if (month == "") setMonthError(true);
    if (amount == "") setAmountError(true);
    if (amount > 0) {
      if (year.length != 0 && month.length != 0 && amount.length != 0) {
        setLoaderOpen(true);
        axios
          .post(
            `${GW_URL}/teacher/${teacher_id}/updatepayment`,
            {
              amount,
              month,
              year,
            },
            adminConfig
          )

          .then((data) => {
            setLoaderOpen(false);
            toast.success("Salary Updated Succesfully", {
              position: "top-center",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
            renderSalary();
          })
          .catch((err) => {
            setLoaderOpen(false);
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
        setOpenDialog(false);
        setOpenModal(false);
      }
      setYearError(false);
      setMonthError(false);
      setAmountError(false);
    } else {
      toast.warn("Enter a Valid Salary", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };

  const AddSalaryHandler = (e) => {
    e.preventDefault();
    setOpenDialog(true);
  };

  const AddClassDetailsHandler = (e) => {
    e.preventDefault();
    setOpenDialog(true);
  };

  // new column for update status
  const handleDialogClose = () => {
    setOpenDialog(false);
    setOpenModal(false);
  };

  const getSubjectName = (subjectIds) => {
    let subjectName = [];
    for (let i = 0; i < subjectIds.length; i++) {
      const subject = allSubjects.filter((a) => a.subject_id == subjectIds[i]);
      if (i != subjectIds.length - 1) {
        subjectName.push(subject[0].subject_name + ", ");
      } else {
        subjectName.push(subject[0].subject_name);
      }
    }
    return subjectName;
  };

  useEffect(() => {
    // if(teacher_id) return ;
    axios
      .get(`${GW_URL}/teacher/${teacher_id}`, adminConfig)
      .then((data) => {
        setName(data.data.teacherDetails[0].teacher_name);
        SetEmail(data.data.teacherDetails[0].email);
        setAge(data.data.teacherDetails[0].age);
        setSalary(data.data.teacherDetails[0].salary);
        setCity(data.data.teacherDetails[0].city);
        setQualification(data.data.teacherDetails[0].qualification);
        let dateString = dayjs(
          data.data.teacherDetails[0].date_of_joining
        ).format("YYYY-MM-DD");
        let date =
          dateString.slice(8, 10) +
          "-" +
          dateString.slice(5, 7) +
          "-" +
          dateString.slice(0, 4);
        setDate(date.slice(0, 10));
        setClasses(
          data.data.teacherDetails[0].class_ids.map(
            (a) => Allclasses.filter((c) => c.class_id == a)[0].class_name
          )
        );
        setWorkExp(data.data.teacherDetails[0].experience);
        setGender(data.data.teacherDetails[0].gender);
        setMedium(data.data.teacherDetails[0].medium);

        setTeacherImage(data.data.teacherDetails[0].photo_url);
        setSubjects(getSubjectName(data.data.teacherDetails[0].subject_id));
      })
      .catch((err) => {
        console.log(err);
      });
    renderSalary();
  }, []);
  const [isExpanded, setExpanded] = useState(false);
  const isExpandedHandler = (value) => {
    setExpanded(value);
  };

  return (
    <div className="SingleTeacherPage-container ">
      <Sidebar isExpandedHandler={isExpandedHandler} />
      <div className="SingleTeacher">
        <Navbar adminName={props.AdminName} />
        <div className="SingleTeacher-page page-container">
          <div className="student-info-main-container">
            <div className="student-info-heading">
              <h1> Teachers Details</h1>
            </div>
            <div className="section basic-info">
              <div>
                <img
                  style={{ width: "200px", height: "200px" }}
                  src={teacherImage ? teacherImage : ImageUrl}
                  alt=""
                />
              </div>
              <div className="basic-info-right">
                <div className="student-Name">
                  <span>{name}</span>
                </div>
                <div className="other-info-container">
                  <div className="other-detail-info-container">
                    <div className="student">
                      <span className="lable">Qualification :</span>
                      <span>{qualification}</span>
                    </div>
                    <div className="student">
                      <span className="lable"> Email :</span>
                      <span>{email}</span>
                    </div>
                    <div className="student">
                      <span className="lable"> Work-Experinece :</span>
                      <span>{workExp}</span>
                    </div>
                  </div>
                  <div className="other-detail-info-container">
                    <div className="student">
                      <span className="lable">Age :</span>
                      <span>{age}</span>
                    </div>
                    <div className="student">
                      <span className="lable">Gender :</span>
                      <span>{gender}</span>
                    </div>
                    <div className="student">
                      <span className="lable">Salary :</span>
                      <span>{salary}</span>
                    </div>
                  </div>
                  <div className="other-detail-info-container">
                    <div className="student">
                      <span className="lable">Start Date :</span>
                      <span>{date}</span>
                    </div>
                    <div className="student">
                      <span className="lable">City :</span>
                      <span>
                        {City?.charAt(0).toUpperCase() + City?.slice(1)}
                      </span>
                    </div>
                    <div className="student"></div>
                  </div>
                  <div className="other-detail-info-container">
                    <div className="student">
                      <span className="lable">Subjects :</span>
                      {subjects.map((sub) => {
                        return <span>{sub}</span>;
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Class subjects */}
            <div className="student-salary-container" style={{ width: "98%" }}>
              <div className="student-salary-container-heading">
                <h1>Class Details</h1>
              </div>
              <div className="student-info-container-body">
                <DataTable
                  rows={teacherClassDetailsRows}
                  columns={classDetailsColumns}
                  emptyRowsMessage={"No class details"}
                  loader={isLoading}
                />
              </div>
              {
                <div className="btn">
                  <button onClick={handleAddClassOpen}>
                    Add Class Details
                  </button>
                  {openAddClassModal && (
                    <AddTeacherClass
                      teacher_id={teacher_id}
                      open={openAddClassModal}
                      setOpen={setopenAddClassModal}
                    />
                  )}
                </div>
              }
            </div>

            <div className="student-salary-container" style={{ width: "98%" }}>
              <div className="student-salary-container-heading">
                <h1>Salary Details</h1>
              </div>
              <div className="student-info-container-body">
                <Table
                  rows={rows}
                  columns={columns}
                  emptyRowsMessage={"No Salary details"}
                />
              </div>
              {
                <div className="btn">
                  <button onClick={handleOpen}>Update Salary</button>
                  {openModal && (
                    <Modal
                      open={openModal}
                      onClose={handleClose}
                      aria-labelledby="modal-modal-title"
                      aria-describedby="modal-modal-description"
                    >
                      <form onSubmit={AddSalaryHandler}>
                        <Box sx={style}>
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              rowGap: 20,
                            }}
                          >
                            <div>
                              <Stack spacing={3}>
                                <div>
                                  <span>Salary update</span>
                                </div>
                                <TextField
                                  sx={{ flex: 1 }}
                                  defaultValue=""
                                  error={yearError}
                                  required
                                  select
                                  label="year"
                                  onChange={yearSelectHandler}
                                  helperText="Select year"
                                >
                                  {Year.map((option) => (
                                    <MenuItem
                                      key={option.value}
                                      value={option.value}
                                    >
                                      {option.label}
                                    </MenuItem>
                                  ))}
                                </TextField>
                                <TextField
                                  defaultValue=""
                                  sx={{ flex: 1 }}
                                  error={monthError}
                                  required
                                  select
                                  label="Month"
                                  onChange={(e) => setMonth(e.target.value)}
                                  helperText="Select Month"
                                >
                                  {newMonths?.map((option) => (
                                    <MenuItem
                                      key={option.value}
                                      value={option.value}
                                    >
                                      {option.lable}
                                    </MenuItem>
                                  ))}
                                </TextField>
                                <TextField
                                  type="number"
                                  sx={{ flex: 1 }}
                                  error={amountError}
                                  required
                                  label="Amount"
                                  onChange={salaryAmountHandler}
                                  helperText="Enter Amount"
                                />
                              </Stack>
                            </div>
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "flex-end",
                              }}
                            >
                              <button
                                style={{
                                  width: 150,
                                  height: 54,
                                  backgroundColor: "#08B3F3",
                                  border: "none",
                                  borderRadius: 9,
                                  fontSize: "1.1rem",
                                  backgroundColor: "#1377C0",
                                  color: "white",
                                  textDecoration: "none",
                                  cursor: "pointer",
                                }}
                              >
                                Submit
                              </button>
                            </div>
                          </div>
                        </Box>
                      </form>
                    </Modal>
                  )}
                </div>
              }
            </div>
          </div>
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
          <DialogTitle id="alert-dialog-title">{"Salary Update?"}</DialogTitle>

          <DialogActions>
            <Button
              style={{
                backgroundColor: "#1377C0",
                color: "white",
                fontSize: "0.7rem",
              }}
              onClick={handleAgree}
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
      <Loader open={loaderOpen} />
    </div>
  );
};

export default SingleTeacherPage;
