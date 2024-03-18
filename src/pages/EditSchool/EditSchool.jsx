import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  Button,
  CircularProgress,
  ListItemText,
} from "@mui/material";
import axios from "axios";
import {
  GW_URL,
  courses,
  months,
  Board,
  classes,
  mediums,
  subjects,
  allSchoolCategory,
  superAdminConfig,
} from "../../config";
import DataLoader from "../../components/Loader/DataLoader";

const EditSchool = ({ onClose, onSubmit, school_id }) => {
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    schoolName: "",
    cityName: "",
    adminName: "",
    email: "",
    mobile: "",
    mediums: [],
    mediumIds: [],
    courses: [],
    courseIds: [],
    boards: [],
    boardIds: [],
    classes: [],
    classIds: [],
    subjects: [],
    subjectIds: [],
    photo: null,
    academicMonth: null,
    academicMonthId: "",
    category: null,
    categoryId: "",
  });

  useEffect(() => {
    // Fetch the data for the fields from the API
    axios
      .get(`${GW_URL}/schools/${school_id}/getAllDetails`, superAdminConfig)
      .then((response) => {
        const {
          school_name,
          city_name,
          admin_name,
          email,
          mobile,
          courses,
          mediums,
          boards,
          classes,
          subjects,
          photo,
          academic_start_month,
          category_id,
        } = response.data;
        setFormData((prevData) => ({
          ...prevData,
          schoolName: school_name,
          cityName: city_name,
          adminName: admin_name,
          email: email,
          mobile: mobile,
          courses: courses,
          courseIds: courses.map((a) => a.course_id),
          mediums: mediums,
          mediumIds: mediums.map((a) => a.medium_id),
          boards: boards,
          boardIds: boards.map((a) => a.board_id),
          classes: classes,
          classIds: classes.map((a) => a.class_id),
          subjects: subjects,
          subjectIds: subjects.map((a) => a.subject_id),
          photo: null,
          academicMonth: months.find(
            (a) => a.month_id === academic_start_month
          ),
          academicMonthId: academic_start_month,
          category: allSchoolCategory.find(
            (a) => a.category_id === category_id
          ),
          categoryId: category_id,
        }));
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleMediumChange = (event) => {
    event.preventDefault();
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
          (x) => x.medium_id !== item.medium_id
        );
      } else {
        duplicateRemoved.push(item);
      }
    });
    duplicateRemoved.forEach((item) => {
      dataIds.push(item.medium_id);
    });
    setFormData((prevData) => ({
      ...prevData,
      mediums: duplicateRemoved,
      mediumIds: dataIds,
    }));
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
          (x) => x.board_id !== item.board_id
        );
      } else {
        duplicateRemoved.push(item);
      }
    });

    duplicateRemoved.forEach((item) => {
      dataIds.push(item.board_id);
    });
    setFormData((prevData) => ({
      ...prevData,
      boards: duplicateRemoved,
      boardIds: dataIds,
    }));
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
          (x) => x.class_id !== item.class_id
        );
      } else {
        duplicateRemoved.push(item);
      }
    });

    duplicateRemoved.forEach((item) => {
      dataIds.push(item.class_id);
    });
    setFormData((prevData) => ({
      ...prevData,
      classes: duplicateRemoved,
      classIds: dataIds,
    }));
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
          (x) => x.course_id !== item.course_id
        );
      } else {
        duplicateRemoved.push(item);
      }
    });

    duplicateRemoved.forEach((item) => {
      dataIds.push(item.course_id);
    });
    setFormData((prevData) => ({
      ...prevData,
      courses: duplicateRemoved,
      courseIds: dataIds,
    }));
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
          (x) => x.subject_id !== item.subject_id
        );
      } else {
        duplicateRemoved.push(item);
      }
    });

    duplicateRemoved.forEach((item) => {
      dataIds.push(item.subject_id);
    });
    setFormData((prevData) => ({
      ...prevData,
      subjects: duplicateRemoved,
      subjectIds: dataIds,
    }));
  };

  const handleMonthChange = (event) => {
    const {
      target: { value },
    } = event;
    setFormData((prevData) => ({
      ...prevData,
      academicMonth: months.find((a) => a.month_id === value.month_id),
      academicMonthId: value.month_id,
    }));
  };

  const handleCategoryChange = (event) => {
    const {
      target: { value },
    } = event;
    setFormData((prevData) => ({
      ...prevData,
      category: allSchoolCategory.find(
        (a) => a.category_id === value.category_id
      ),
      categoryId: value.category_id,
    }));
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    setFormData((prevData) => ({ ...prevData, photo: file }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>Edit School</DialogTitle>
      <DialogContent
        sx={
          {
            // display:'flex',
            // justifyContent:'center',
            // alignItems:'center',
            // flexDirection:"column",
          }
        }
      >
        {loading ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <DataLoader />
          </div>
        ) : (
          <>
            <TextField
              name="schoolName"
              label="School Name"
              value={formData.schoolName}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="cityName"
              label="City Name"
              value={formData.cityName}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="adminName"
              label="Admin Name"
              value={formData.adminName}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="email"
              label="Email"
              value={formData.email}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="mobile"
              label="Mobile"
              value={formData.mobile}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Medium</InputLabel>
              <Select
                name="mediums"
                value={formData.mediums}
                onChange={handleMediumChange}
                multiple
                style={{ marginTop: "0.5rem" }}
                renderValue={(selected) =>
                  selected.map((item) => item.medium_name).join(", ")
                }
              >
                {mediums.map((medium) => (
                  <MenuItem key={medium.medium_id} value={medium}>
                    {/* <Checkbox checked={formData.mediumIds.includes(medium.medium_id)} />
                    {medium.medium_name} */}
                    <Checkbox
                      checked={
                        formData.mediums?.findIndex(
                          (item) => item.medium_id === medium.medium_id
                        ) >= 0
                      }
                    />
                    <ListItemText primary={medium.medium_name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Board</InputLabel>
              <Select
                name="boards"
                value={formData.boards}
                onChange={handleBoardChange}
                multiple
                style={{ marginTop: "0.5rem" }}
                renderValue={(selected) =>
                  selected.map((item) => item.board_name).join(", ")
                }
              >
                {Board.map((board) => (
                  <MenuItem key={board.board_id} value={board}>
                    {/* <Checkbox checked={formData.boardIds.includes(board.board_id)} />
                    {board.board_name} */}
                    <Checkbox
                      checked={
                        formData.boards?.findIndex(
                          (item) => item.board_id === board.board_id
                        ) >= 0
                      }
                    />
                    <ListItemText primary={board.board_name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Class</InputLabel>
              <Select
                name="classes"
                value={formData.classes}
                onChange={handleClassChange}
                multiple
                style={{ marginTop: "0.5rem" }}
                renderValue={(selected) =>
                  selected.map((item) => item.class_name).join(", ")
                }
              >
                {classes.map((classItem) => (
                  <MenuItem key={classItem.class_id} value={classItem}>
                    {/* <Checkbox checked={formData.classIds.includes(classItem.class_id)} />
                    {classItem.class_name} */}
                    <Checkbox
                      checked={
                        formData.classes?.findIndex(
                          (item) => item.class_id === classItem.class_id
                        ) >= 0
                      }
                    />
                    <ListItemText primary={classItem.class_name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Course</InputLabel>
              <Select
                name="courses"
                value={formData.courses}
                onChange={handleCourseChange}
                multiple
                style={{ marginTop: "0.5rem" }}
                renderValue={(selected) =>
                  selected.map((item) => item.course_name).join(", ")
                }
              >
                {courses.map((course) => (
                  <MenuItem key={course.course_id} value={course}>
                    {/* <Checkbox checked={formData.courseIds.includes(course.course_id)} />
                    {course.course_name} */}
                    <Checkbox
                      checked={
                        formData.courses?.findIndex(
                          (item) => item.course_id === course.course_id
                        ) >= 0
                      }
                    />
                    <ListItemText primary={course.course_name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Subject</InputLabel>
              <Select
                name="subjects"
                value={formData.subjects}
                onChange={handleSubjectChange}
                multiple
                style={{ marginTop: "0.5rem" }}
                renderValue={(selected) =>
                  selected.map((item) => item.subject_name).join(", ")
                }
              >
                {subjects.map((subject) => (
                  <MenuItem key={subject.subject_id} value={subject}>
                    {/* <Checkbox checked={formData.subjectIds.includes(subject.subject_id)} />
                    {subject.subject_name} */}
                    <Checkbox
                      checked={
                        formData.subjects?.findIndex(
                          (item) => item.subject_id === subject.subject_id
                        ) >= 0
                      }
                    />
                    <ListItemText primary={subject.subject_name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Academics Start Month</InputLabel>
              <Select
                required
                value={formData.academicMonth}
                onChange={handleMonthChange}
                style={{ marginTop: "0.5rem" }}
              >
                {months?.map((variant) => (
                  <MenuItem key={variant.month_id} value={variant}>
                    {variant.month_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Category</InputLabel>
              <Select
                required
                value={formData.category}
                onChange={handleCategoryChange}
                style={{ marginTop: "0.5rem" }}
              >
                {allSchoolCategory?.map((variant) => (
                  <MenuItem key={variant.category_id} value={variant}>
                    {variant.category_name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {/* <input type="file" onChange={handlePhotoChange} /> */}
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} color="primary">
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditSchool;
