import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  CircularProgress,
  MenuItem,
  FormControl,
  InputLabel,
  ListItemText,
  Select,
  Checkbox,
} from "@mui/material";
import axios from "axios";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import useSchoolData from "../../hooks/useSchoolData";
import useFetchTeacher from "../../hooks/useFetchTeacher";
import { GW_URL, genderArray, classes, adminConfig } from "../../config";
import DataLoader from "../../components/Loader/DataLoader";
import Loader from "../../components/Loader/Loader";

const EditTeacher = ({ onClose, onSubmit, teacher_id, school_id }) => {
  const [loading, setLoading] = useState(true);
  const [allClasses, setAllClasses] = useState([]);
  const [loaderOpen, setLoaderOpen] = useState(false);
  const [formData, setFormData] = useState({
    teacherName: "",
    age: "",
    mobile: "",
    email: "",
    gender: "",
    medium: "",
    date: "",
    allSubjects: [],
    subjects: [],
    subjectIds: [],
    city: "",
    classes: [],
    classIds: [],
    experience: "",
    salary: "",
    qualification: "",
  });
  const {
    isLoading: studentFormData,
    isError: studentFormError,
    courseArray,
    mediumArray,
    boardArray,
    classArray,
  } = useSchoolData(school_id);

  useEffect(() => {
    let allArray = [];
    classArray.map((classes) => {
      allArray.push({ class_id: classes.id, class_name: classes.value });
      return classes;
    });
    setAllClasses(allArray);
  }, [teacher_id]);

  useEffect(() => {
    let subject_list = [];
    axios
      .get(`${GW_URL}/school/${school_id}/getSubjectIds`, adminConfig)
      .then((data) => {
        for (let i = 0; i < data.data.subject_id?.length; i++) {
          subject_list.push({
            subject_id: data.data.subject_id[i],
            subject_name: data.data.subject_name[i],
          });
        }
        setFormData((prevData) => ({
          ...prevData,
          allSubjects: subject_list,
        }));
        axios
          .get(`${GW_URL}/teacher/${teacher_id}`, adminConfig)
          .then((data) => {
            setFormData((prevData) => ({
              ...prevData,
              teacherName: data.data.teacherDetails[0].teacher_name,
              email: data.data.teacherDetails[0].email,
              age: data.data.teacherDetails[0].age,
              mobile: data.data.teacherDetails[0].mobile,
              gender: data.data.teacherDetails[0].gender,
              medium: data.data.teacherDetails[0].medium,
              date: dayjs(data.data.teacherDetails[0].date_of_joining),
              subjects: subject_list.filter((a) =>
                data.data.teacherDetails[0].subject_id.find(
                  (subject) => subject == a.subject_id
                )
              ),
              subjectIds: data.data.teacherDetails[0].subject_id,
              city: data.data.teacherDetails[0].city,
              classes: classes.filter((a) =>
                data.data.teacherDetails[0].class_ids.find(
                  (classs) => classs == a.class_id
                )
              ),
              classIds: data.data.teacherDetails[0].class_ids,
              experience: data.data.teacherDetails[0].experience,
              salary: data.data.teacherDetails[0].salary,
              qualification: data.data.teacherDetails[0].qualification,
            }));
            setLoading(false);
          })
          .catch((err) => {
            console.log(err);
          });
      });
  }, []);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
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

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    setFormData((prevData) => ({ ...prevData, photo: file }));
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };
  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>Edit Teacher</DialogTitle>
      <DialogContent>
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
              name="teacherName"
              label="Teacher Name"
              value={formData.teacherName}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="age"
              label="Age"
              type="number"
              value={formData.age}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="mobile"
              label="Mobile"
              type="number"
              value={formData.mobile}
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
              name="city"
              label="City"
              value={formData.city}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="experience"
              label="Experience in years"
              type="number"
              value={formData.experience}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="qualification"
              label="Qualification"
              type="text"
              value={formData.qualification}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="salary"
              label="Salary"
              type="number"
              value={formData.salary}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="gender"
              label="Gender"
              select
              value={formData.gender}
              onChange={handleChange}
              fullWidth
              margin="normal"
            >
              {genderArray.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              name="medium"
              label="Medium"
              select
              value={formData.medium}
              onChange={handleChange}
              fullWidth
              margin="normal"
            >
              {mediumArray.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <DatePicker
              name="date"
              variant="outlined"
              type="date"
              format="DD/MM/YYYY"
              style={{
                width: "300px",
                height: "300px",
                fontSize: "16px",
                padding: "10px",
              }}
              required
              value={formData.date}
              slotProps={{
                textField: {
                  helperText: "Select Date of joining",
                },
              }}
              onChange={(e) =>
                setFormData((prevData) => ({ ...prevData, ["date"]: e }))
              }
            />
            {/* <TextField
              name="subject"
              label="Subject"
              select 
              value={formData.subject}
              onChange={handleChange}
              fullWidth
              margin="normal"   
            >
                {formData.allSubjects.map((option) => (
                  <MenuItem key={option.subject_id} value={option}>
                    {option.subject_name}
                  </MenuItem>
                ))}
            </TextField> */}
            <FormControl fullWidth margin="normal">
              <InputLabel>Subjects</InputLabel>
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
                {formData.allSubjects.map((subjectItem) => (
                  <MenuItem key={subjectItem.subject_id} value={subjectItem}>
                    <Checkbox
                      checked={
                        formData.subjects?.findIndex(
                          (item) => item.subject_id === subjectItem.subject_id
                        ) >= 0
                      }
                    />
                    <ListItemText primary={subjectItem.subject_name} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Classes</InputLabel>
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
                {allClasses.map((classItem) => (
                  <MenuItem key={classItem.class_id} value={classItem}>
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

export default EditTeacher;
