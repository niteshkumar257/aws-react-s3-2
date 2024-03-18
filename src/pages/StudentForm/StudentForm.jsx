import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import "./Studentform.scss";
import { useEffect } from "react";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import { useState } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { DatePicker } from "@mui/x-date-pickers";
import { Button } from "@mui/material";
import useSchoolData from "../../hooks/useSchoolData";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ALL_STUDENT_FETCH_KEY } from "../../hooks/useFetchAllStudent";
import { useNavigate } from "react-router-dom";
import {
  GW_URL,
  adminConfig,
  validateEmail,
  allSections,
  allStreams,
  containsNonDigits,
} from "../../config";
import Loader from "../../components/Loader/Loader";
import dayjs from "dayjs";
import useMediumQuery from "../../hooks/useGetMediuIds";
import useBoardIdQuery from "../../hooks/useGetBoard";
import useClassIdsQuery from "../../hooks/useGetSchoolIds";


const Gender = [
  {
    value: "Male",
    label: "Male",
  },
  {
    value: "Female",
    label: "Female",
  },
  {
    value: "Not-disclose",
    label: "Not-disclose",
  },
  {
    value: "Binary",
    label: "Binary",
  },
];
const ChangeFormatOfDropDownValue = (arr1, arr2) => {
  const tempArray = [];
  for (let i = 0; i < arr1.length; i++) {
    tempArray.push({
      id: arr1[i],
      value: arr2[i],
      label: arr2[i],
    });
  }
  return tempArray;
};

const label = { inputProps: { "aria-label": "Checkbox demo" } };

const StudentForm = (props) => {
  let decodeToken = jwt_decode(localStorage.getItem("auth_token"));
  let school_id =
    localStorage.getItem("superadmin_school") === null
      ? decodeToken.result.school_id
      : localStorage.getItem("superadmin_school");


 // classIds,mediumsIds,boardIds

 const { data: mediumIdData, isLoading: mediumIdLoading } =
 useMediumQuery(school_id);

const { data: classIdData, isLoading: classIdLoading } =
 useClassIdsQuery(school_id);

 const { data: boardIdData, isLoading: boardIdLoading }=useBoardIdQuery(school_id);

  // Date maker
  let objectDate = new Date();
  let day = objectDate.getDate();
  let month = objectDate.getMonth() + 1;
  month = month.toString();
  day = day.toString();
  if (month.length == 1) month = "0" + month;
  if (day.length == 1) day = "0" + day;
  let year = objectDate.getFullYear();
  let format = year + "-" + month + "-" + day;

  const [firstInsallMentEta, setFirstInstallMentEta] = useState(null);
  const [secondInsallMentEta, setSecondInstallMentEta] = useState(null);
  const [thirdInsallMentEta, setThirdInstallMentEta] = useState(null);

  const [firstInstallMentStatus, setFirstInstallMentStatus] = useState(0);
  const [secondInstallMentStatus, setSecondInstallMentStatus] = useState(0);
  const [thirdInstallMentStatus, setThirdInstallMentStatus] = useState(0);

  const [firstInstallMentAmount, setFirstInstallMentAmount] = useState("");
  const [secondInstallMentAmount, setSecondInstallMentAmount] = useState("");
  const [thirdInstallMentAmount, setThirdInstallMentAmount] = useState("");

  const [name, setName] = useState("");
  const [gender, setGender] = useState("");
  const [course, setCourse] = useState("");
  const [medium, setMedium] = useState("");
  const [date, setDate] = useState(null);
  const [Class, setClass] = useState("");
  const [stream, setStream] = useState("");
  const [section, setSection] = useState("A");
  const [email, setEmail] = useState("");
  const [Fathername, setFatherName] = useState("");
  const [MotherName, setMotherName] = useState("");
  const [FatherProfession, setFatherProfession] = useState("");
  const [MotherProfession, setMotherProfession] = useState("");
  const [classId, setClassId] = useState("");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const navigate = useNavigate();

  const [PrimaryNumber, setPrimaryNumber] = useState("");
  const [AlternateNumber, setAlternateNumber] = useState("");
  const [AadharNumber, setAadharNumber] = useState("");
  const [Address, setAddress] = useState("");
  const [board, setBoard] = useState("");

  // error handler

  const [nameError, setNameError] = useState(false);
  const [mediumError, setMediumError] = useState(false);
  const [courseError, setCourseError] = useState(false);
  const [boardError, setBoardError] = useState(false);
  const [classError, setClassError] = useState(false);
  const [sectionError, setSectionError] = useState(false);
  const [fatherNameError, setFahterNameError] = useState(false);
  const [motherNameError, setMohterNameError] = useState(false);
  const [fatherProfessionError, setFatherProfessionError] = useState(false);
  const [motherProfessionError, setmotherProfessionError] = useState(false);
  const [altNumberError, setAltNumberError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [genderError, setGenderError] = useState(false);
  const [primaryError, setPrimaryError] = useState(false);
  const [dateError, setDateError] = useState(false);
  const [aadhaError, setAadharError] = useState(false);
  const [addressError, setAddressError] = useState(false);
  const [oneError, setOneError] = useState(false);
  const [twoError, setTwoError] = useState(false);
  const [thirdError, setThirdError] = useState(false);
  const [firstInstallMentError, setFirstInstallMentError] = useState(false);
  const [secondInstallMentError, setSecondInstallMentError] = useState(false);
  const [thirdInstallMentError, setThirdInstallMentError] = useState(false);
  const [streamError, setStreamError] = useState(false);

  const [open, setOpen] = useState(false);
  const [openStream, setOpenStream] = useState(false);

  const [isloading, setIsLoadig] = useState(false);

  useEffect(() => {
    console.log(Class)
    if (Class === "Nursery") {
      setClassId("-3");
    } else if (Class === "KG-1") {
      setClassId("-2");
    } else if (Class === "KG-2") {
      setClassId("-1");
    } else {
      setClassId(Class);
    }

    if (Number(Class) > 10) {
      setOpenStream(true);
    } else {
      setStream("");
      setOpenStream(false);
    }
  }, [Class]);

  const addStudent = ({
    school_id,
    name,
    gender,
    date,
    Address,
    classId,
    course,
    medium,
    board,
    Fathername,
    FatherProfession,
    MotherName,
    MotherProfession,
    PrimaryNumber,
    AlternateNumber,
    firstInstallMentAmount,
    firstInstallMentStatus,
    firstInsallMentEta,
    secondInstallMentStatus,
    secondInsallMentEta,
    secondInstallMentAmount,
    thirdInstallMentAmount,
    thirdInstallMentStatus,
    thirdInsallMentEta,
    AadharNumber,
    first_installment_submit,
    second_installment_submit,
    third_installment_submit,
    email,
    totalFees,
    formData,
    section,
    stream,
  }) => {
    return axios.post(
      `${GW_URL}/schools/${school_id}/addStudent?student_name=${name}&gender=${gender}&dob=${date}&address=${Address}&class_id=${classId}&course_name=${course}&medium=${medium}&board=${board}&father_name=${Fathername}&father_profession=${FatherProfession}&mother_name=${MotherName}&mother_profession=${MotherProfession}&whatsapp_no=${PrimaryNumber}&alternative_mobile=${AlternateNumber}&email=${email}&total_fees=${totalFees}&first_installment=${firstInstallMentAmount}&first_installment_eta=${firstInsallMentEta}&first_installment_status=${firstInstallMentStatus}&second_installment=${secondInstallMentAmount}&second_installment_eta=${secondInsallMentEta}&second_installment_status=${secondInstallMentStatus}&third_installment=${thirdInstallMentAmount}&third_installment_eta=${thirdInsallMentEta}&third_installment_status=${thirdInstallMentStatus}&aadhar_no=${AadharNumber}&first_installment_submit=${first_installment_submit}&second_installment_submit=${second_installment_submit}&third_installment_submit=${third_installment_submit}&section=${section}&stream=${stream}`,
      formData,
      adminConfig
    );
  };

  
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: addStudent,
    onSuccess: () => {
      queryClient.invalidateQueries(ALL_STUDENT_FETCH_KEY);
      setIsLoadig(false);
      setName("");
      setEmail("");
      setGender("");
      setAddress("");
      setClass("");
      setCourse("");
      setMedium("");
      setBoard("");
      setAadharNumber("");
      setFatherName("");
      setMotherName("");
      setFatherProfession("");
      setMotherProfession("");
      setPrimaryNumber("");
      setAlternateNumber("");
      setDate(null);
      setFirstInstallMentAmount("");
      setSecondInstallMentAmount("");
      setThirdInstallMentAmount("");
      setFirstInstallMentEta("");
      setSecondInstallMentEta("");
      setThirdInstallMentEta("");
      setStream("");
      setFirstInstallMentStatus(0);
      setSecondInstallMentStatus(0);
      setThirdInstallMentStatus(0);
      setFile(null);
      setFileName("");
      setOpen(false);
      toast.success("Student Added", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      setTimeout(() => {
        navigate("/Student");
      }, 3000);
    },
    onError: () => {
      setOpen(false);
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

  // if (studentFormError) {
  //   return <div>Error loading data</div>;
  // }

  const handleChange1 = (e) => {
    e.preventDefault();
    if (firstInstallMentStatus == 0) {
      setFirstInstallMentEta(format);
      setFirstInstallMentStatus(1);
    } else {
      setFirstInstallMentEta("");
      setFirstInstallMentStatus(0);
    }
  };
  const handleChange2 = (e) => {
    e.preventDefault();
    if (secondInstallMentStatus == 0) {
      setSecondInstallMentEta(format);
      setSecondInstallMentStatus(1);
    } else {
      setSecondInstallMentEta("");
      setSecondInstallMentStatus(0);
    }
  };
  const handleChange3 = (e) => {
    e.preventDefault();

    if (thirdInstallMentStatus) {
      setThirdInstallMentEta("");
      setThirdInstallMentStatus(0);
    } else {
      setThirdInstallMentEta(format);
      setThirdInstallMentStatus(1);
    }
  };

  const AddStudentHandler = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", fileName);

    setNameError(false);
    setMediumError(false);
    setAltNumberError(false);
    setBoardError(false);
    setClassError(false);
    setCourseError(false);
    setFahterNameError(false);
    setMohterNameError(false);
    setFatherProfessionError(false);
    setmotherProfessionError(false);
    setPrimaryError(false);
    setAltNumberError(false);
    setDateError(false);
    setAddressError(false);
    setOneError(false);
    setTwoError(false);
    setThirdError(false);
    setGenderError(false);
    setEmailError(false);
    setAadharError(false);

    if (name == "") {
      toast.error("Student name is required!", {
        theme: "dark",
      });
      setClassError(true);
      return;
    }
    if (gender == "") {
      toast.error("Gender is required!", {
        theme: "dark",
      });
      setGenderError(true);
      return;
    }
    // if (course == "") {
    //   toast.error("Course name is required!", {
    //     theme: "dark",
    //   });
    //   setCourseError(true);
    //   return;
    // }
    if (date == "") {
      toast.error("Date of birth  is required!", {
        theme: "dark",
      });
      setDateError(true);
      return;
    }
    if (Class == "") {
      toast.error("Class name is required!", {
        theme: "dark",
      });
      setClassError(true);
      return;
    }
    if (medium == "") {
      toast.error("Medium name is required!", {
        theme: "dark",
      });
      setMediumError(true);
      return;
    }
    if (section == "") {
      toast.error("Section is required!", {
        theme: "dark",
      });
      setSectionError(true);
      return;
    }
    if (Address == "") {
      toast.error("Address is required!", {
        theme: "dark",
      });
      setAddressError(true);
      return;
    }
    // if (AadharNumber == "") {
    //   toast.error("Aadhar is required!", {
    //     theme: "dark",
    //   });

    //   setAadharError(true);
    //   return;
    // }
    // if (containsNonDigits(AadharNumber)) {
    //   toast.error("Adhar number Container non-digit number", {
    //     theme: "dark",
    //   });
    //   setAadharError(true);
    //   return;
    // }
    // if (AadharNumber.length != 12) {
    //   toast.error("Adhar number should be 12 digit only", { theme: "dark" });

    //   setAadharError(true);
    //   return;
    // }
    if (board == "") {
      toast.error("Board is required!", {
        theme: "dark",
      });
      setBoardError(true);
      return;
    }

    if (openStream && stream == "") {
      toast.error("Stream Name is required!", {
        theme: "dark",
      });
      setStreamError(true);
      return;
    }

    // if (file == null) {
    //   toast.error("Please select file", {
    //     theme: "dark",
    //   });
    //   return;
    // }

    if (Fathername == "") {
      toast.error("Father name is required!", {
        theme: "dark",
      });
      setFahterNameError(true);
      return;
    }
    // if (FatherProfession == "") {
    //   toast.error("Father Profession is required!", {
    //     theme: "dark",
    //   });
    //   setFahterNameError(true);
    //   return;
    // }

    if (PrimaryNumber.split("")[0] == "0") {
      toast.error("Primay Mobile number is not valid", { theme: "dark" });
      setPrimaryError(true);
      return;
    }

    if (PrimaryNumber.length != 10) {
      toast.error("Primary mobile number should be of 10 digits!", {
        theme: "dark",
      });
      setPrimaryError(true);
      return;
    }

    if (containsNonDigits(PrimaryNumber)) {
      toast.error("Primary mobile number is not valid", {
        theme: "dark",
      });
      return;
    }

    if (MotherName == "") {
      toast.error("Mother name is required!", {
        theme: "dark",
      });
      setMohterNameError(true);
      return;
    }
    // if (MotherProfession == "") {
    //   toast.error("Mother Profession is required!", {
    //     theme: "dark",
    //   });
    //   setmotherProfessionError(true);
    //   return;
    // }

    if (AlternateNumber.length != 0 && AlternateNumber.length != 10) {
      toast.error("Alternate mobile number should be of 10 digits!", {
        theme: "dark",
      });
      setAltNumberError(true);
      return;
    }

    if (AlternateNumber.split("")[0] == "0") {
      toast.error("Alternate mobile number is not valid", { theme: "dark" });
      return;
    }
    if (containsNonDigits(AlternateNumber)) {
      toast.error("Alternate mobile number is not valid", { theme: "dark" });
      return;
    }

    if (AlternateNumber == PrimaryNumber) {
      toast.error(
        "Alternate mobile number should not be same as Primary mobile number!",
        {
          theme: "dark",
        }
      );
      setAltNumberError(true);
      return;
    }

    if (email == "") {
      toast.error("Father Email name is required!", {
        theme: "dark",
      });
      setEmailError(true);
      return;
    }

    if (!validateEmail(email)) {
      toast.error("Father Email is not valid!", {
        theme: "dark",
      });
      setEmailError(true);
      return;
    }

    if (firstInstallMentAmount == "") {
      toast.error("First Installment amount is required!", {
        theme: "dark",
      });
      setOneError(true);
      return;
    }
    if (secondInstallMentAmount == "") {
      toast.error("Second Installment is required!", {
        theme: "dark",
      });
      setTwoError(true);
      return;
    }
    if (thirdInstallMentAmount == "") {
      toast.error("Third Installment is required!", {
        theme: "dark",
      });
      setThirdError(true);
      return;
    }

    if (firstInsallMentEta == "") {
      toast.error("First installment last date is required!", {
        theme: "dark",
      });
      return;
    }
    if (secondInsallMentEta == "") {
      toast.error("Second installment last date is required!", {
        theme: "dark",
      });
      return;
    }
    if (thirdInsallMentEta == "") {
      toast.error("Third installment last date is required!", {
        theme: "dark",
      });
      return;
    }

    setIsLoadig(true);
    setOpen(true);

    var dateObj = new Date();
    let todaydate = dateObj.toJSON();
    todaydate = todaydate.slice(0, 10);
    let first_installment_submit = null,
      second_installment_submit = null,
      third_installment_submit = null;
    if (firstInstallMentStatus == 1) {
      first_installment_submit = todaydate;
    }

    if (secondInstallMentStatus == 1) {
      second_installment_submit = todaydate;
    }

    if (thirdInstallMentStatus == 1) {
      third_installment_submit = todaydate;
    }

    let totalFees =
      parseInt(firstInstallMentAmount) +
      parseInt(secondInstallMentAmount) +
      parseInt(thirdInstallMentAmount);

    mutation.mutate({
      school_id,
      name,
      gender,
      date,
      Address,
      classId,
      section,
      course,
      medium,
      board,
      Fathername,
      FatherProfession,
      MotherName,
      MotherProfession,
      PrimaryNumber,
      AlternateNumber,
      firstInstallMentAmount,
      firstInstallMentStatus,
      firstInsallMentEta,
      secondInstallMentStatus,
      secondInsallMentEta,
      secondInstallMentAmount,
      thirdInstallMentAmount,
      thirdInstallMentStatus,
      thirdInsallMentEta,
      AadharNumber,
      first_installment_submit,
      second_installment_submit,
      third_installment_submit,
      formData,
      email,
      totalFees,
      stream,
    });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    if (e.target.files[0]) {
      setFileName(e.target.files[0].name);
    } else {
      setFileName("");
    }
  };
  return (
    <div className="studentForm-container ">
      <Sidebar />

      <div className="studentForm">
        <Navbar adminName={props.AdminName} />
        <div className="studentForm-page page-container">
          <div className="studentForm-page-container">
            <div className="student-page-container-heading">
              {/* header container */}
              <span>Add Student</span>
            </div>
            <form noValidate onSubmit={AddStudentHandler}>
              <div className="student-info-detail-container">
                <div className="student-info-detail-student-container">
                  <div className="student-info-detail-student-container-subheading">
                    <span>Student Details</span>
                  </div>
                  <div className="student-info-detail-student-container-textfield">
                    {/* row one info */}

                    <div className="student-info-section ">
                      <TextField
                        value={name}
                        error={nameError}
                        sx={{ flex: 1 }}
                        label="Student Name"
                        required
                        helperText="Enter Student Name"
                        onChange={(e) => setName(e.target.value)}
                      />
                      <TextField
                        value={gender}
                        sx={{ flex: 1 }}
                        error={genderError}
                        select
                        label="Gender"
                        required
                        onChange={(e) => setGender(e.target.value)}
                        helperText="Select Gender"
                      >
                        {Gender.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                      {/* <TextField
                        value={course}
                        sx={{ flex: 1 }}
                        error={courseError}
                        select
                        label="Course"
                        required
                        onChange={(e) => setCourse(e.target.value)}
                        helperText="Select Course"
                      >
                        {courseArray.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField> */}
                    </div>
                    <div className="student-info-section ">
                      <DatePicker
                        format="DD/MM/YYYY"
                        sx={{ flex: 1 }}
                        error={dateError}
                        variant="outlined"
                        type="date"
                        disableFuture
                        value={date}
                        slotProps={{
                          textField: {
                            helperText: "Select Date Of Birth",
                          },
                        }}
                        onChange={(e) => setDate(e)}
                      />
                      <TextField
                        value={Class}
                        sx={{ flex: 1 }}
                        error={classError}
                        select
                        label="Class"
                        required
                        onChange={(e) => setClass(e.target.value)}
                        helperText="Select Class"
                      >
                        {classIdData?.map((option) => (
                          <MenuItem key={option.class_id} value={option.class_id}>
                            {option.class_name}
                          </MenuItem>
                        ))}
                      </TextField>

                      <TextField
                        value={medium}
                        sx={{ flex: 1 }}
                        error={mediumError}
                        required
                        select
                        helperText="Select Medium"
                        label="Medium"
                        onChange={(e) => setMedium(e.target.value)}
                      >
                        {mediumIdData?.map((option) => (
                          <MenuItem key={option.medium_id} value={option.medium_id}>
                            {option.medium_name}
                          </MenuItem>
                        ))}
                      </TextField>
                    </div>
                    <div className="student-info-section ">
                      <TextField
                        value={section}
                        sx={{ flex: 1 }}
                        error={classError}
                        select
                        label="Section"
                        required
                        onChange={(e) => setSection(e.target.value)}
                        helperText="Select Section"
                      >
                        {allSections.map((option) => (
                          <MenuItem
                            key={option.section_id}
                            value={option.section_name}
                          >
                            {option.section_name}
                          </MenuItem>
                        ))}
                      </TextField>
                      <TextField
                        value={Address}
                        sx={{ flex: 1 }}
                        error={addressError}
                        helperText="Enter Address"
                        label="Address"
                        type="text"
                        required
                        onChange={(e) => setAddress(e.target.value)}
                      />
                      <TextField
                        value={AadharNumber}
                        sx={{ flex: 1 }}
                        error={aadhaError}
                        label="Aadhar Number"
                        type="text"
                        helperText="Enter Aadhar Number"
                        required
                        onChange={(e) => setAadharNumber(e.target.value)}
                      />
                    </div>
                    <div className="student-info-section ">
                      <TextField
                        value={board}
                        sx={{ flex: 0.325 }}
                        error={boardError}
                        required
                        select
                        label="Board"
                        helperText="Select Board"
                        onChange={(e) => setBoard(e.target.value)}
                      >
                        {boardIdData?.map((option) => (
                          <MenuItem key={option.board_id} value={option.board_id}>
                            {option.board_name}
                          </MenuItem>
                        ))}
                      </TextField>

                      {openStream && (
                        <TextField
                          value={stream}
                          sx={{ flex: 0.325 }}
                          error={streamError}
                          required
                          select
                          helperText="Select Stream"
                          label="Stream"
                          onChange={(e) => setStream(e.target.value)}
                        >
                          {allStreams.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    </div>
                    <div className="student-info-section ">
                      <form>
                        <Button variant="contained" component="label">
                          Upload Photo
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
                <div className="student-info-detail-parent-container">
                  <div className="student-info-detail-parent-container-subheading">
                    <span>Parent Details</span>
                  </div>
                  <div className="student-info-detail-parent-container-textfield">
                    <div className="parent-info-section ">
                      <TextField
                        value={Fathername}
                        sx={{ flex: 1 }}
                        error={fatherNameError}
                        label="Father Name"
                        required
                        helperText="Father Name"
                        onChange={(e) => setFatherName(e.target.value)}
                      />
                      <TextField
                        value={FatherProfession}
                        sx={{ flex: 1 }}
                        error={fatherProfessionError}
                        label="Father profession"
                        helperText="Father Profession"
                        required
                        onChange={(e) => setFatherProfession(e.target.value)}
                      />
                      <TextField
                        type="text"
                        value={PrimaryNumber}
                        sx={{ flex: 1 }}
                        error={primaryError}
                        label="Primary Number"
                        required
                        helperText="Primary Number"
                        onChange={(e) => setPrimaryNumber(e.target.value)}
                      />
                    </div>
                    <div className="parent-info-section ">
                      <TextField
                        value={MotherName}
                        sx={{ flex: 1 }}
                        error={motherNameError}
                        label="Mother Name"
                        required
                        helperText="Mohter Name"
                        onChange={(e) => setMotherName(e.target.value)}
                      />
                      <TextField
                        value={MotherProfession}
                        sx={{ flex: 1 }}
                        error={motherProfessionError}
                        label="Mother profession"
                        helperText="Mother Profession"
                        required
                        onChange={(e) => setMotherProfession(e.target.value)}
                      />
                      <TextField
                        type="text"
                        value={AlternateNumber}
                        sx={{ flex: 1 }}
                        error={altNumberError}
                        label="Alternate Number"
                        helperText="Alternate Number"
                        onChange={(e) => setAlternateNumber(e.target.value)}
                      />
                    </div>
                    <div className="parent-info-section ">
                      <TextField
                        value={email}
                        sx={{ flex: 0.317 }}
                        error={emailError}
                        label="Email"
                        required
                        type="email"
                        helperText={
                          emailError ? "Enter valid email" : "Enter email"
                        }
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* fee details */}
                <div className="student-info-detail-fee-container">
                  <div className="student-info-detail-fee-container-subheading">
                    <span>Fee Details</span>
                  </div>
                  <div className="student-info-detail-fee-container-textfield">
                    <div className="fee-info-section section">
                      <div className="fee-info-section-installment">
                        <TextField
                          type="number"
                          value={firstInstallMentAmount}
                          sx={{
                            height: "7vh",
                          }}
                          error={oneError}
                          required
                          onChange={(e) =>
                            setFirstInstallMentAmount(e.target.value)
                          }
                          id="outlined-basic"
                          label="1st InstallMent"
                          variant="outlined"
                        />
                        <div className="fee-info-section-installment-checkbox-date">
                          <Checkbox
                            checked={firstInstallMentStatus}
                            onChange={(e) => handleChange1(e)}
                            color="success"
                          />
                          {!firstInstallMentStatus && (
                            <DatePicker
                              sx={{
                                height: "5vh",
                              }}
                              variant="outlined"
                              type="date"
                              format="DD/MM/YYYY"
                              required
                              value={firstInsallMentEta}
                              slotProps={{
                                textField: {
                                  helperText: "Select a Date",
                                },
                              }}
                              error={firstInstallMentError}
                              onChange={(e) => setFirstInstallMentEta(e)}
                            />
                          )}
                        </div>
                      </div>
                      <div className="fee-info-section-installment">
                        <TextField
                          type="number"
                          error={twoError}
                          sx={{ height: "7vh" }}
                          value={secondInstallMentAmount}
                          onChange={(e) =>
                            setSecondInstallMentAmount(e.target.value)
                          }
                          id="outlined-basic"
                          label="2nd  InstallMent"
                          required
                          variant="outlined"
                        />
                        <div className="fee-info-section-installment-checkbox-date">
                          <Checkbox
                            checked={secondInstallMentStatus}
                            required
                            onChange={(e) => handleChange2(e)}
                            color="success"
                          />
                          {!secondInstallMentStatus && (
                            <DatePicker
                              sx={{ height: "5vh" }}
                              variant="outlined"
                              value={secondInsallMentEta}
                              type="date"
                              format="DD/MM/YYYY"
                              required
                              slotProps={{
                                textField: {
                                  helperText: "Select a Date",
                                },
                              }}
                              error={secondInstallMentError}
                              onChange={(e) => setSecondInstallMentEta(e)}
                            />
                          )}
                        </div>
                      </div>
                      <div className="fee-info-section-installment">
                        <TextField
                          type="number"
                          error={thirdError}
                          sx={{ height: "7vh" }}
                          value={thirdInstallMentAmount}
                          onChange={(e) =>
                            setThirdInstallMentAmount(e.target.value)
                          }
                          required
                          id="outlined-basic"
                          label="3rd InstallMent"
                          variant="outlined"
                        />
                        <div className="fee-info-section-installment-checkbox-date">
                          <Checkbox
                            checked={thirdInstallMentStatus}
                            onChange={(e) => handleChange3(e)}
                            color="success"
                            {...label}
                            inputProps={{ "aria-label": "controlled" }}
                          />
                          {!thirdInstallMentStatus && (
                            // <DatePicker
                            // variant="outlined"
                            //   value={thirdInsallMentEta}
                            //   format="DD-MM-YYYY"
                            //  />
                            <DatePicker
                              sx={{
                                height: "5vh",
                              }}
                              variant="outlined"
                              type="date"
                              format="DD/MM/YYYY"
                              required
                              value={thirdInsallMentEta}
                              slotProps={{
                                textField: {
                                  helperText: "Select a Date",
                                },
                              }}
                              error={thirdInstallMentError}
                              onChange={(e) => setThirdInstallMentEta(e)}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="buttonSubmit">
                  <button>Submit</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer />
      <Loader open={open} />
    </div>
  );
};

export default StudentForm;
