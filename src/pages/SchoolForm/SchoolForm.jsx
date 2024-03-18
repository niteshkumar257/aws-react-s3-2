import React, { useEffect } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import "./SchoolForm.scss";
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
import { Button, Paper } from "@mui/material";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { ALL_SCHOOL_FETCH_KEY } from "../../hooks/useFetchAllSchool.js";
import {
  GW_URL,
  months,
  classes,
  mediums,
  courses,
  Board,
  subjects,
  isEmail,
  superAdminConfig,
} from "../../config";
import Loader from "../../components/Loader/Loader";
import { allSchoolCategory } from "../../config.js";

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

const addSchool = ({
  school_name,
  city_name,
  admin_name,
  email,
  mobile,
  courses_id,
  mediums_id,
  boards_id,
  classes_id,
  subjects_id,
  start_month,
  category_id,
  formData,
}) => {
  return axios.post(
    `${GW_URL}/addSchool?school_name=${school_name}&city_name=${city_name}&admin_name=${admin_name}&email=${email}&mobile=${mobile}&course_id=${courses_id}&medium_id=${mediums_id}&board_id=${boards_id}&class_id=${classes_id}&subject_id=${subjects_id}&start_month=${start_month}&category=${category_id}`,
    formData,
    superAdminConfig
  );
};

const SchoolForm = (props) => {
  {
    /* school_name, city_name, admin_name, email, mobile, course_id, medium_id, board_id, class_id */
  }
  // const { mutate: addSchool, isLoading, isError, isSuccess } = useAddSchool();
  const [school_name, setSchoolName] = useState("");
  const [city_name, setCityName] = useState("");
  const [admin_name, setAdminName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [startMonth, setStartMonth] = useState("");
  const [startMonthId, setStartMonthId] = useState("");
  const [course, setCourse] = useState([]);
  const [medium, setMedium] = useState([]);
  const [board, setBoard] = useState([]);
  const [classs, setClasss] = useState([]);
  const [courseId, setCourseId] = useState([]);
  const [mediumId, setMediumId] = useState([]);
  const [boardId, setBoardId] = useState([]);
  const [classsId, setClasssId] = useState([]);
  const [subjectId, setSubjectId] = useState([]);
  const [subject, setSubject] = useState([]);
  const [category, setCategory] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");

  const [schoolnameError, setSchoolnameError] = useState(false);
  const [citynameError, setCityNameError] = useState(false);
  const [adminnameError, setAdminNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [mobileError, setMobileError] = useState(false);
  const [courseIdError, setCourseIdError] = useState(false);
  const [mediumIdError, setMediumIdError] = useState(false);
  const [boardIdError, setBoardIdWError] = useState(false);
  const [classsIdError, setClasssIdError] = useState(false);
  const [subjectIdError, setSubjectIdError] = useState(false);
  const [startMonthError, setStartMonthError] = useState(false);

  const [openLoader, setOpenLoader] = useState(false);

  const [isExpanded, setExpanded] = useState(false);
  const isExpandedHandler = (value) => {
    setExpanded(value);
  };

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: addSchool,
    onSuccess: () => {
      setOpenLoader(false);
      queryClient.invalidateQueries({ queryKey: [ALL_SCHOOL_FETCH_KEY] });
      toast.success("School added Successfully!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      setAdminName("");
      setSchoolName("");
      setCityName("");
      setEmail("");
      setMobile("");
      setBoard([]);
      setBoardId([]);
      setMedium([]);
      setMediumId([]);
      setClasss([]);
      setClasssId([]);
      setCourse([]);
      setCourseId([]);
      setSubjectId([]);
      setSubject([]);
      setFile(null);
      setFileName("");
      setStartMonth("");
      setStartMonthId("");
      setCategory("");
      setCategoryId("");
    },
    onError: (err) => {
      setOpenLoader(false);
      toast.error(
        err.response?.data?.error
          ? err.response?.data?.error
          : "Something went wrong",
        {
          position: "top-center",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        }
      );
    },
  });

  const handleMediumChange = (event) => {
    const {
      target: { value },
    } = event;

    let duplicateRemoved = [];
    let dataIds = [];
    value.forEach((item) => {
      if (
        duplicateRemoved.findIndex((o) => o.medium_id === item.medium_id) >= 0
      ) {
        duplicateRemoved = duplicateRemoved.filter(
          (x) => x.medium_id === item.medium_id
        );
      } else {
        duplicateRemoved.push(item);
      }
    });
    duplicateRemoved.forEach((item) => {
      dataIds.push(item.medium_id);
    });
    setMediumId(dataIds);
    setMedium(duplicateRemoved);
  };

  const handleBoardChange = (event) => {
    const {
      target: { value },
    } = event;

    let duplicateRemoved = [];
    let dataIds = [];
    value.forEach((item) => {
      if (
        duplicateRemoved.findIndex((o) => o.board_id === item.board_id) >= 0
      ) {
        duplicateRemoved = duplicateRemoved.filter(
          (x) => x.board_id === item.board_id
        );
      } else {
        duplicateRemoved.push(item);
      }
    });

    duplicateRemoved.forEach((item) => {
      dataIds.push(item.board_id);
    });
    setBoardId(dataIds);

    setBoard(duplicateRemoved);
  };

  const handleClassChange = (event) => {
    const {
      target: { value },
    } = event;

    let duplicateRemoved = [];
    let dataIds = [];
    value.forEach((item) => {
      if (
        duplicateRemoved.findIndex((o) => o.class_id === item.class_id) >= 0
      ) {
        duplicateRemoved = duplicateRemoved.filter(
          (x) => x.class_id === item.class_id
        );
      } else {
        duplicateRemoved.push(item);
      }
    });

    duplicateRemoved.forEach((item) => {
      dataIds.push(item.class_id);
    });
    setClasssId(dataIds);
    setClasss(duplicateRemoved);
  };

  const handleCourseChange = (event) => {
    const {
      target: { value },
    } = event;

    let duplicateRemoved = [];
    let dataIds = [];
    value.forEach((item) => {
      if (
        duplicateRemoved.findIndex((o) => o.course_id === item.course_id) >= 0
      ) {
        duplicateRemoved = duplicateRemoved.filter(
          (x) => x.course_id === item.course_id
        );
      } else {
        duplicateRemoved.push(item);
      }
    });

    duplicateRemoved.forEach((item) => {
      dataIds.push(item.course_id);
    });
    setCourseId(dataIds);
    setCourse(duplicateRemoved);
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

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    if (e.target.files[0]) {
      setFileName(e.target.files[0].name);
    } else {
      setFileName("");
    }
  };

  const handleMonthChange = (e) => {
    const {
      target: { value },
    } = e;
    setStartMonthId(value.month_id);
    setStartMonth(value);
  };

  const handleCategoryChange = (e) => {
    const {
      target: { value },
    } = e;
    setCategoryId(value.category_id);
    setCategory(value);
  };
  // API CALLS

  const AddSchoolHandler = (e) => {
    e.preventDefault();
    setClasssIdError(false);
    setBoardIdWError(false);
    setMediumIdError(false);
    setCourseIdError(false);
    setAdminNameError(false);
    setCityNameError(false);
    setSchoolnameError(false);
    setEmailError(false);
    setMobileError(false);
    setSubjectIdError(false);
    setStartMonthError(false);

    school_name.trim();
    city_name.trim();
    admin_name.trim();
    email.trim();
    classsId.sort();

    if (school_name.length == 0) {
      toast.error("school name required!", {
        theme: "dark",
      });
      setSchoolnameError(true);
      return;
    }
    if (city_name.length == 0) {
      toast.error("city name required!", {
        theme: "dark",
      });
      setCityNameError(true);
      return;
    }
    if (admin_name.length == 0) {
      toast.error("Admin name required!", {
        theme: "dark",
      });
      setAdminNameError(true);
      return;
    }
    if (email.length == 0) {
      toast.error("Email address required!", {
        theme: "dark",
      });
      setEmailError(true);
      return;
    }
    if (!isEmail(email)) {
      setEmailError(true);
      toast.error("Email Id is not valid", {
        theme: "dark",
      });

      return;
    }
    if (mobile.length != 10) {
      toast.error("Mobile number should be 10 digits!", {
        theme: "dark",
      });
      setMobileError(true);
      return;
    }
    // if (courseId.length == 0) {
    //   toast.error("Courses name required!", {
    //     theme: "dark",
    //   });
    //   setCourseIdError(true);
    //   return;
    // }
    if (boardId.length == 0) {
      toast.error("Board name required!", {
        theme: "dark",
      });
      setBoardIdWError(true);
      return;
    }
    if (classsId.length == 0) {
      toast.error("Class name required!", {
        theme: "dark",
      });
      setClasssIdError(false);
      return;
    }
    if (mediumId.length == 0) {
      toast.error("Medium name required!", {
        theme: "dark",
      });
      setMediumIdError(true);
      return;
    }

    if (startMonthId.length == 0) {
      toast.error("Academic start month is required!", {
        theme: "dark",
      });
      setStartMonthError(true);
      return;
    }

    if (categoryId.length == 0) {
      toast.error("Category is required!", {
        theme: "dark",
      });
      return;
    }
    if (file == null) {
      toast.error("Please select file", {
        theme: "dark",
      });

      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", fileName);
    let courses_id = encodeURIComponent(JSON.stringify(courseId));
    let mediums_id = encodeURIComponent(JSON.stringify(mediumId));
    let boards_id = encodeURIComponent(JSON.stringify(boardId));
    let classes_id = encodeURIComponent(JSON.stringify(classsId));
    let subjects_id = encodeURIComponent(JSON.stringify(subjectId));
    // {school_name, city_name, admin_name, email, mobile, courses_id, mediums_id, boards_id, classes_id, subjects_id, formData}
    setOpenLoader(true);
    mutation.mutate({
      school_name,
      city_name,
      admin_name,
      email,
      mobile,
      courses_id,
      mediums_id,
      boards_id,
      classes_id,
      subjects_id,
      start_month: startMonthId,
      category_id: categoryId,
      formData,
    });
  };
  return (
    <Paper elevation={3}>
      <div className="teachers-container ">
        <Sidebar isExpandedHandler={isExpandedHandler} />
        <div className="teachers">
          <Navbar adminName={props.AdminName} />
          <div className="teachers-page page-container">
            <div className="teacherForm-page-container">
              <div className="teacherForm-page-container-heading">
                {/* header container */}
                <span>Add School</span>
              </div>
              <form noValidate onSubmit={AddSchoolHandler}>
                <div className="teachers-info-detail-container">
                  <div className="teachers-info-detail-student-container">
                    <div className="teachers-info-detail-student-container-subheading">
                      <span>Schools Details</span>
                    </div>
                    <div className="teachers-info-detail-student-container-textfield">
                      {/* row one */}
                      <div className="teachers-infos-section ">
                        <TextField
                          value={school_name}
                          sx={{ flex: 1 }}
                          label="School Name"
                          error={schoolnameError}
                          required
                          helperText="Enter School Name"
                          onChange={(e) => setSchoolName(e.target.value)}
                        />
                        <TextField
                          value={city_name}
                          sx={{ flex: 1 }}
                          label="City Name"
                          helperText="Enter City name"
                          error={citynameError}
                          required
                          type="text"
                          onChange={(e) => setCityName(e.target.value)}
                        />
                        <TextField
                          value={admin_name}
                          sx={{ flex: 1 }}
                          label="Admin Name"
                          error={adminnameError}
                          required
                          helperText="Enter Admin Name"
                          onChange={(e) => setAdminName(e.target.value)}
                        />
                      </div>
                      {/* row two */}

                      {/* school_name, city_name, admin_name, email, mobile, course_id, medium_id, board_id, class_id */}

                      <div className="teachers-infos-section">
                        <TextField
                          value={email}
                          sx={{ flex: 1 }}
                          error={emailError}
                          helperText={
                            emailError ? "Enter Valid email" : "Enter email"
                          }
                          required
                          label="Email"
                          type="email"
                          onChange={(e) => setEmail(e.target.value)}
                        />
                        <TextField
                          value={mobile}
                          sx={{ flex: 1 }}
                          error={mobileError}
                          helperText="Enter mobile"
                          required
                          label="Mobile"
                          type="number"
                          onChange={(e) => setMobile(e.target.value)}
                        />

                        {/* Start */}
                        {/* <FormControl
                          error={courseIdError}
                          sx={{ m: 0, flex: 1 }}
                        >
                          <InputLabel
                            required
                            id="demo-multiple-checkbox-label"
                          >
                            Course
                          </InputLabel>
                          <Select
                            labelId="demo-multiple-checkbox-label"
                            id="demo-multiple-checkbox"
                            multiple
                            required={true}
                            value={course}
                            onChange={handleCourseChange}
                            input={<OutlinedInput label="Tag" />}
                            renderValue={(selected) =>
                              selected.map((x) => x.course_name).join(", ")
                            }
                            MenuProps={MenuProps}
                          >
                            {courses?.map((variant) => (
                              <MenuItem key={variant.course_id} value={variant}>
                                <Checkbox
                                  checked={
                                    course?.findIndex(
                                      (item) =>
                                        item.course_id === variant.course_id
                                    ) >= 0
                                  }
                                />
                                <ListItemText primary={variant.course_name} />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl> */}
                        {/* end */}
                      </div>

                      {/* row three */}

                      <div className="teachers-info-section">
                        <FormControl
                          error={boardIdError}
                          sx={{ m: 0, flex: 1 }}
                        >
                          <InputLabel
                            required
                            id="demo-multiple-checkbox-label"
                          >
                            Board
                          </InputLabel>
                          <Select
                            labelId="demo-multiple-checkbox-label"
                            id="demo-multiple-checkbox"
                            multiple
                            value={board}
                            required
                            onChange={handleBoardChange}
                            input={<OutlinedInput label="Tag" />}
                            renderValue={(selected) =>
                              selected.map((x) => x.board_name).join(", ")
                            }
                            MenuProps={MenuProps}
                          >
                            {Board?.map((variant) => (
                              <MenuItem key={variant.board_id} value={variant}>
                                <Checkbox
                                  checked={
                                    board?.findIndex(
                                      (item) =>
                                        item.board_id === variant.board_id
                                    ) >= 0
                                  }
                                />
                                <ListItemText primary={variant.board_name} />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>

                        <FormControl
                          required
                          error={classsIdError}
                          sx={{ m: 0, flex: 1 }}
                        >
                          <InputLabel id="demo-multiple-checkbox-label">
                            Class
                          </InputLabel>
                          <Select
                            labelId="demo-multiple-checkbox-label"
                            id="demo-multiple-checkbox"
                            multiple
                            required
                            value={classs}
                            onChange={handleClassChange}
                            input={<OutlinedInput label="Tag" />}
                            renderValue={(selected) =>
                              selected.map((x) => x.class_name).join(", ")
                            }
                            MenuProps={MenuProps}
                          >
                            {classes?.map((variant) => (
                              <MenuItem key={variant.class_id} value={variant}>
                                <Checkbox
                                  checked={
                                    classs?.findIndex(
                                      (item) =>
                                        item.class_id === variant.class_id
                                    ) >= 0
                                  }
                                />
                                <ListItemText primary={variant.class_name} />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        <FormControl
                          error={mediumIdError}
                          sx={{ m: 0, flex: 1 }}
                        >
                          <InputLabel
                            size="large"
                            required
                            id="demo-multiple-checkbox-label"
                          >
                            Medium
                          </InputLabel>
                          <Select
                            labelId="demo-multiple-checkbox-label"
                            id="demo-multiple-checkbox"
                            multiple
                            value={medium}
                            required={true}
                            onChange={handleMediumChange}
                            input={<OutlinedInput label="Tag" />}
                            renderValue={(selected) =>
                              selected.map((x) => x.medium_name).join(", ")
                            }
                            MenuProps={MenuProps}
                          >
                            {mediums?.map((variant) => (
                              <MenuItem key={variant.medium_id} value={variant}>
                                <Checkbox
                                  checked={
                                    medium?.findIndex(
                                      (item) =>
                                        item.medium_id === variant.medium_id
                                    ) >= 0
                                  }
                                />
                                <ListItemText primary={variant.medium_name} />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </div>

                      {/* fouth row */}
                      <div className="teachers-infos-section ">
                        <FormControl
                          error={subjectIdError}
                          sx={{ m: 0, flex: 1 }}
                        >
                          <InputLabel
                            required
                            id="demo-multiple-checkbox-label"
                          >
                            Subject
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
                            style={{ marginTop: "0.5rem" }}
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
                        <FormControl
                          error={subjectIdError}
                          sx={{ m: 0, flex: 1 }}
                        >
                          <InputLabel required id="demo-simple-checkbox-label">
                            Academics Start Month
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            required
                            error={startMonthError}
                            value={startMonth}
                            onChange={handleMonthChange}
                            input={<OutlinedInput label="Tag" />}
                            MenuProps={MenuProps}
                            style={{ marginTop: "0.5rem" }}
                          >
                            {months?.map((variant) => (
                              <MenuItem key={variant.month_id} value={variant}>
                                {variant.month_name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        <FormControl sx={{ m: 0, flex: 1 }}>
                          <InputLabel required id="demo-simple-checkbox-label">
                            Category
                          </InputLabel>
                          <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            required
                            value={category}
                            onChange={handleCategoryChange}
                            input={<OutlinedInput label="Tag" />}
                            MenuProps={MenuProps}
                            style={{ marginTop: "0.5rem" }}
                          >
                            {allSchoolCategory?.map((variant) => (
                              <MenuItem
                                key={variant.category_id}
                                value={variant}
                              >
                                {variant.category_name}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      </div>

                      <div className="teachers-infos-section ">
                        <form>
                          <Button variant="contained" component="label">
                            Upload Admin Photo
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
        <Loader open={openLoader} />
      </div>
    </Paper>
  );
};

export default SchoolForm;
