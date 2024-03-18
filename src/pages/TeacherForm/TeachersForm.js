import React, { useEffect } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import "./TeachersForm.scss";
import axios from "axios";
import jwt_decode from "jwt-decode";
import MenuItem from "@mui/material/MenuItem";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import ListItemText from "@mui/material/ListItemText";
import Select from "@mui/material/Select";
import Checkbox from "@mui/material/Checkbox";
import { Sort } from "@mui/icons-material";
import { DatePicker } from "@mui/x-date-pickers";
import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import { useAddTeacher } from "../../hooks/useAddTeacher";
import { ALL_TEACHER_FETCH_KEY } from "../../hooks/useFetchTeacher";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useQuery } from "@tanstack/react-query";
import { GW_URL, adminConfig, isEmail } from "../../config";
import Loader from "../.././components/Loader/Loader";

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

const Gender = [
  { value: "Male", label: "Male" },
  { value: "Female", label: "Female" },
  { value: "Binary", label: "Binary" },
  { value: "Not Disclose", label: "Not Disclose" },
];

const addTeacher = ({
  school_id,
  teacher_name,
  age,
  mobile,
  email,
  gender,
  date,
  subject_id,
  city,
  formData,
  experience,
  salary,
  qualification,
}) => {
  return axios.post(
    `${GW_URL}/schools/${school_id}/addtecher?teacher_name=${teacher_name}&age=${age}&mobile=${mobile}&email=${email}&gender=${gender}&date=${date}&experience=${experience}&salary=${salary}&subject_id=${subject_id}&city=${city}&qualification=${qualification}`,
    formData,
    adminConfig
  );
};
const TeachersForm = (props) => {
  const navigate = useNavigate();

  const [teacher_name, setName] = useState("");
  const [age, setAge] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [city, setCity] = useState("");
  const [experience, setWorkExp] = useState("");
  const [salary, setSalary] = useState("");
  const [subjects, setSubject] = useState([]);
  const [address, setAddress] = useState("");
  const [qualification, setQualification] = useState("");
  const [date, setDate] = useState(null);
  const [classes, setClasses] = useState([]);
  const [classs, setClasss] = useState([]);
  const [subjectIds, setSubjectIds] = useState([]);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");

  const [teacher_nameError, setTeachernameError] = useState(false);
  const [ageError, setAgeError] = useState(false);
  const [mobileError, setMobileError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [cityError, setCityError] = useState(false);
  const [experienceError, setExperinecError] = useState(false);
  const [salaryError, setSalaryError] = useState(false);
  const [addresError, setAddressError] = useState(false);
  const [dateError, setDateError] = useState(false);
  const [genderError, setGenderError] = useState(false);
  const [subjectError, setSubjectError] = useState(false);
  const [open, setOpen] = useState(false);

  let decodeToken = jwt_decode(localStorage.getItem("auth_token"));
  let school_id =
    localStorage.getItem("superadmin_school") === null
      ? decodeToken.result.school_id
      : localStorage.getItem("superadmin_school");

  let allSubjects = [];
  const [subject_list, setSubjectList] = useState([]);
  subject_list?.map((item) => {
    const data = {
      subject_name: item.subject_name,
      subject_id: item.subject_id,
    };
    allSubjects.push(data);
  });

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
  const {
    data: course,
    isLoading: courseLoading,
    isError: courseError,
    error: courseErrormsg,
  } = useQuery({
    queryKey: ["course-list", school_id],
    queryFn: () => {
      return axios.get(
        `${GW_URL}/school/${school_id}/getSubjectIds`,
        adminConfig
      );
    },
  });
  useEffect(() => {
    if (!courseLoading) {
      let subjectArr = [];
      for (let i = 0; i < course?.data?.subject_id.length; i++) {
        subjectArr.push({
          subject_id: course.data.subject_id[i],
          subject_name: course.data.subject_name[i],
        });
      }
      setSubjectList(subjectArr);
    }
    if (courseError) {
      console.log(courseErrormsg.message);
    }
  }, [course]);

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: addTeacher,
    onSuccess: () => {
      queryClient.invalidateQueries(ALL_TEACHER_FETCH_KEY);
      setName("");
      setAge("");
      setGender("");
      setAddress("");
      setCity("");
      setEmail("");
      setSalary("");
      setDate(null);
      setQualification("");
      setWorkExp("");
      setAddress("");
      setMobile("");
      setSubject([]);
      setSubjectIds([]);
      setClasss([]);
      setFile(null);
      setFileName("");
      setOpen(false);
      setTimeout(() => {
        navigate("/Teachers");
      }, 2000);
      toast.success("Teacher Added", {
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
      setOpen(false);
      toast.error("Something went wrong!", {
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

  const AddTeacherHandler = (e) => {
    e.preventDefault();
    setTeachernameError(false);
    setMobileError(false);
    setDateError(false);
    setSalaryError(false);
    setCityError(false);
    setAddressError(false);
    setAgeError(false);
    setCityError(false);
    setEmailError(false);
    setExperinecError(false);
    setGenderError(false);
    setSubjectError(false);

    if (teacher_name.trim() == "") {
      setTeachernameError(true);
      return toast.error("Teacher name is required");
    }
    if (mobile.length == 0) {
      setMobileError(true);
      return toast.error("Mobile is required");
    }
    if (mobile.length != 10) {
      setMobileError(true);
      return toast.error("Mobile number should be 10digits");
    }

    // if (email.trim() == "") {
    //   setEmailError(true);
    //   return toast.error("Email is required");
    // }
    if (email.trim()!=" "  && !isEmail(email)) {
      setEmailError(true);
      return toast.error("Enter a valid email id");
    }
    if (subjects.length == 0) {
      setSubjectError(true);
      return toast.error("Subject is Required");
    }
    // if (experience.trim() == "") {
    //   setExperinecError(true);
    //   return toast.error("work experience  is required");
    // }
    if (gender.trim() == "") {
      setGenderError(true);
      return toast.error("gender is reuried");
    }

    if (salary == "") {
      setSalaryError(true);
      return toast.error("salary is requried");
    }
    // if (city.trim() == "") {
    //   setCityError(true);
    //   return toast.error("city is required");
    // }
    if (age == "" || age == 0) {
      setAgeError(true);
      return toast.error("age is required");
    }

    if (date == "") {
      setDateError(true);
      return toast.error("joining date is required");
    }
    if (address.trim() == "") {
      setAddressError(true);
      return toast.error("Address is required");
    }

    // if (qualification.trim() == "" || qualification.length > 60) {
    //   return toast.error("Qualification length should be in between 1 to 60");
    // }

    // if (file == null) {
    //   toast.error("Please select file", {
    //     theme: "dark",
    //   });
    //   return;
    // }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", fileName);

    let subject_id = encodeURIComponent(JSON.stringify(subjectIds));
    if (
      teacher_name &&
      address &&
      age &&
      city &&
      mobile &&
      experience &&
      gender &&
      salary &&
      date &&
      file &&
      isEmail(email)
    ) {
      setOpen(true);

      mutation.mutate({
        school_id,
        teacher_name,
        age,
        mobile,
        email,
        gender,
        date,
        subject_id,
        city,
        formData,
        salary,
        experience,
        qualification,
      });
    }
  };
  const [isExpanded, setExpanded] = useState(false);
  const isExpandedHandler = (value) => {
    setExpanded(value);
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
    dataIds.sort();
    setSubjectIds(dataIds);
    setSubject(duplicateRemoved);
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
    <div className="teachers-container ">
      <Sidebar isExpandedHandler={isExpandedHandler} />
      <div className="teachers">
        <Navbar adminName={props.AdminName} />
        <div className="teachers-page page-container">
          <div className="teacherForm-page-container">
            <div className="teacherForm-page-container-heading">
              {/* header container */}
              <span>Add Teacher</span>
            </div>
            <form noValidate onSubmit={AddTeacherHandler}>
              <div className="teachers-info-detail-container">
                <div className="teachers-info-detail-student-container">
                  <div className="teachers-info-detail-student-container-subheading">
                    <span>Teacher Details</span>
                  </div>
                  <div className="teachers-info-detail-student-container-textfield">
                    {/* row one */}
                    <div className="teachers-info-section ">
                      <TextField
                        value={teacher_name}
                        sx={{ flex: 1 }}
                        label="Teacher Name"
                        error={teacher_nameError}
                        required
                        helperText="Enter Name"
                        onChange={(e) => setName(e.target.value)}
                      />
                      <TextField
                        type="number"
                        value={mobile}
                        sx={{ flex: 1 }}
                        label="Mobile"
                        error={mobileError}
                        required
                        helperText="Enter Mobile"
                        onChange={(e) => setMobile(e.target.value)}
                      />
                      <TextField
                        value={email}
                        sx={{ flex: 1 }}
                        label="Email"
                        helperText={
                          emailError ? "Enter Valid email" : "Enter email"
                        }
                        error={emailError}
                        required
                        type="email"
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                    {/* row two */}

                    <div className="teachers-info-section ">
                      <FormControl error={subjectError} sx={{ m: 0, flex: 1 }}>
                        <InputLabel id="demo-multiple-checkbox-label">
                          Subjects
                        </InputLabel>
                        <Select
                          labelId="demo-multiple-checkbox-label"
                          id="demo-multiple-checkbox"
                          multiple
                          value={subjects}
                          placeholder="select subject"
                          onChange={handleSubjectChange}
                          input={<OutlinedInput label="Tag" />}
                          renderValue={(selected) =>
                            selected.map((x) => x.subject_name).join(", ")
                          }
                          MenuProps={MenuProps}
                        >
                          {allSubjects?.map((variant) => (
                            <MenuItem key={variant.subject_id} value={variant}>
                              <Checkbox
                                checked={
                                  subjects?.findIndex(
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

                      <TextField
                        type="number"
                        value={experience}
                        sx={{ flex: 1 }}
                        error={experienceError}
                        helperText="Enter Work-experience in years"
                        required
                        label="Work-Exp"
                        onChange={(e) => setWorkExp(e.target.value)}
                      />

                      <TextField
                        type="text"
                        value={qualification}
                        sx={{ flex: 1 }}
                        helperText="Enter Qualification"
                        required
                        label="Qualification"
                        onChange={(e) => setQualification(e.target.value)}
                      />
                    </div>

                    {/* { third row} */}
                    <div className="teachers-info-section ">
                      <TextField
                        value={gender}
                        sx={{ flex: 1 }}
                        error={genderError}
                        required
                        select
                        label="Gender"
                        onChange={(e) => setGender(e.target.value)}
                        helperText="Select Gender"
                      >
                        {Gender.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                      <TextField
                        value={salary}
                        sx={{ flex: 1 }}
                        error={salaryError}
                        label="Salary"
                        type="number"
                        helperText="Enter Salary"
                        required
                        onChange={(e) => setSalary(e.target.value)}
                      />
                      <TextField
                        value={city}
                        sx={{ flex: 1 }}
                        error={cityError}
                        label="City"
                        required
                        helperText="Enter City"
                        onChange={(e) => setCity(e.target.value)}
                      />
                    </div>

                    {/* 4 th row */}
                    <div className="teachers-info-section ">
                      {" "}
                      <TextField
                        value={age}
                        sx={{ flex: 1 }}
                        error={ageError}
                        label="Age"
                        type="number"
                        equired
                        helperText="Enter Age"
                        onChange={(e) => setAge(e.target.value)}
                      />
                      <DatePicker
                        value={date}
                        sx={{ flex: 1 }}
                        error={dateError}
                        format="DD/MM/YYYY"
                        type="date"
                        required
                        slotProps={{
                          textField: {
                            helperText: "Enter the starting Date",
                          },
                        }}
                        onChange={(e) => setDate(e)}
                      />
                      <TextField
                        value={address}
                        sx={{ flex: 1 }}
                        error={addresError}
                        label="Address"
                        required
                        helperText="Enter the Address"
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </div>

                    <div className="teachers-info-section ">
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
                <div className="buttonSubmit">
                  {" "}
                  <button>Submit</button>{" "}
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

export default TeachersForm;
