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
} from "@mui/material";
import axios from "axios";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import useSchoolData from "../../hooks/useSchoolData";
import {
  GW_URL,
  adminConfig,
  allSections,
  allStreams,
  genderArray,
} from "../../config";
import DataLoader from "../../components/Loader/DataLoader";
import Loader from "../../components/Loader/Loader";

const EditStudent = ({
  onClose,
  onSubmit,
  student_id,
  school_id,
  class_id,
}) => {
  const [loading, setLoading] = useState(true);
  const [pastParentNumber, setPastParentNumber] = useState("");
  const [streamOpen, setStreamOpen] = useState(false);
  const [formData, setFormData] = useState({

    studentName: '',
    gender: '',
    course: '',
    dob: '',
    classs: '',
    stream:'',
    medium: '',  
    board: '',     
    address: '',
    aadhar_no: '',

    photo: null,
    parent_id: "",
    fatherName: "",
    fatherProfession: "",
    primaryNumber: "",
    motherName: "",
    motherProfession: "",
    alternateNumber: "",
    email: "",
    firstInstallment: "",
    firstInstallmentEta: "",
    secondInstallment: "",
    secondInstallmentEta: "",
    thirdInstallment: "",
    thirdInstallmentEta: "",
    section: "",
    stream: "",
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
    axios
      .get(`${GW_URL}/students/${student_id}`, adminConfig)
      .then((data) => {
        setFormData((prevData) => ({
          ...prevData,
          studentName: data.data.studentDetails[0]?.student_name,
          dob: dayjs(data.data.studentDetails[0]?.dob),
          gender: data.data.studentDetails[0]?.gender,
          course: data.data.studentDetails[0]?.course_name,
          classs:
            data.data.studentDetails[0]?.class_id == -3
              ? "Nursery"
              : data.data.studentDetails[0].class_id == -2
              ? "KG-1"
              : data.data.studentDetails[0]?.class_id == -1
              ? "KG-2"
              : data.data.studentDetails[0].class_id,
          medium: data.data.studentDetails[0]?.medium,
          board: data.data.studentDetails[0]?.board,
          address: data.data.studentDetails[0]?.address,
          aadhar_no: data.data.studentDetails[0]?.aadhar_no,
          parent_id: data.data.studentDetails[0]?.parent_id,
          section: data.data.studentDetails[0]?.section,
          stream: data.data.studentDetails[0]?.stream,
        }));

        if (data.data.studentDetails[0]?.class_id > 10) {
          setStreamOpen(true);
        } else {
          setStreamOpen(false);
        }

        let parent_id = data.data.studentDetails[0]?.parent_id;
        axios
          .get(`${GW_URL}/parents/${parent_id}`, adminConfig)
          .then((data) => {
            setFormData((prevData) => ({
              ...prevData,
              primaryNumber: data.data.parentDetails?.whatsapp_no,
              email: data.data.parentDetails?.email,
              fatherName: data.data.parentDetails?.father_name,
              fatherProfession: data.data.parentDetails?.father_profession,
              motherName: data.data.parentDetails?.mother_name,
              motherProfession: data.data.parentDetails?.mother_profession,
              alternateNumber: data.data.parentDetails?.alternative_mobile,
            }));

            setPastParentNumber(data.data.parentDetails?.whatsapp_no);


            axios.get(`${GW_URL}/students/${student_id}/fees`, adminConfig)
            .then((data) => { 
           

                setFormData((prevData) => ({
                  ...prevData,
                  firstInstallment: data.data.studentFees[0]?.first_installment,
                  firstInstallmentEta: dayjs(
                    data.data.studentFees[0]?.first_installment_eta
                  ),
                  secondInstallment:
                    data.data.studentFees[0]?.second_installment,
                  secondInstallmentEta: dayjs(
                    data.data.studentFees[0]?.second_installment_eta
                  ),
                  thirdInstallment: data.data.studentFees[0]?.third_installment,
                  thirdInstallmentEta: dayjs(
                    data.data.studentFees[0]?.third_installment_eta
                  ),
                }));
                setLoading(false);
              })
              .catch((err) => {
                alert("Something went wrong");
                console.log(err);
                setLoading(false);
              });
          })
          .catch((err) => {
            alert("Something went wrong");
            console.log(err);
            setLoading(false);
          });
      })
      .catch((err) => {
        alert("Something went wrong");
        console.log(err);
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name == "classs") {
      if (value > 10) {
        setStreamOpen(true);
      } else {
        setStreamOpen(false);
      }
    }
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    setFormData((prevData) => ({ ...prevData, photo: file }));
  };

  const handleSubmit = () => {
    onSubmit(formData, pastParentNumber, streamOpen);
  };

  return (
    <Dialog open onClose={onClose}>
      <DialogTitle>Edit Student</DialogTitle>
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
              name="studentName"
              label="Student Name"
              value={formData.studentName}
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
              name="course"
              label="Course Name"
              select
              value={formData.course}
              onChange={handleChange}
              fullWidth
              margin="normal"
            >
              {courseArray.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <DatePicker
              name="dob"
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
              value={formData.dob}
              slotProps={{
                textField: {
                  helperText: "Select Date of birth",
                },
              }}
              onChange={(e) =>
                setFormData((prevData) => ({ ...prevData, ["dob"]: e }))
              }
            />
            <TextField
              name="classs"
              label="Class"
              select
              value={formData.classs}
              onChange={handleChange}
              fullWidth
              margin="normal"
            >
              {classArray.map((option) => (
                <MenuItem key={option.id} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>

            {streamOpen && (
              <TextField
                name="stream"
                label="Stream"
                select
                value={formData.stream}
                onChange={handleChange}
                fullWidth
                margin="normal"
              >
                {allStreams.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
            )}

            <TextField
              name="section"
              label="Section"
              select
              value={formData.section}
              onChange={handleChange}
              fullWidth
              margin="normal"
            >
              {allSections.map((option) => (
                <MenuItem key={option.section_id} value={option.section_name}>
                  {option.section_name}
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
            <TextField
              name="board"
              label="Board"
              select
              value={formData.board}
              onChange={handleChange}
              fullWidth
              margin="normal"
            >
              {boardArray.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              name="address"
              label="Address"
              value={formData.address}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="aadhar_no"
              label="Aadhar Number"

              type='text'

              value={formData.aadhar_no}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="fatherName"
              label="Father Name"
              value={formData.fatherName}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="fatherProfession"
              label="Father Profession"
              value={formData.fatherProfession}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="primaryNumber"
              label="Primary Number"
              type="text"
              value={formData.primaryNumber}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="motherName"
              label="Mother Name"
              value={formData.motherName}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              name="motherProfession"
              label="Mother Profession"
              value={formData.motherProfession}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />

            <TextField
              name="alternateNumber"
              label="Alternate Number"
              type="text"
              value={formData.alternateNumber}
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
              name="firstInstallment"
              label="First Installment"
              type="number"
              value={formData.firstInstallment}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <DatePicker
              name="firstInstallmentEta"
              variant="outlined"
              type="date"
              format="DD/MM/YYYY"
              required
              value={formData.firstInstallmentEta}
              slotProps={{
                textField: {
                  helperText: "Select first installment Date",
                },
              }}
              onChange={(e) =>
                setFormData((prevData) => ({
                  ...prevData,
                  ["firstInstallmentEta"]: e,
                }))
              }
            />
            <TextField
              name="secondInstallment"
              label="Second Installment"
              type="number"
              value={formData.secondInstallment}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <DatePicker
              name="secondInstallmentEta"
              variant="outlined"
              type="date"
              format="DD/MM/YYYY"
              required
              value={formData.secondInstallmentEta}
              slotProps={{
                textField: {
                  helperText: "Select second installment Date",
                },
              }}
              onChange={(e) =>
                setFormData((prevData) => ({
                  ...prevData,
                  ["secondInstallmentEta"]: e,
                }))
              }
            />
            <TextField
              name="thirdInstallment"
              label="Third Installment"
              type="number"
              value={formData.thirdInstallment}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <DatePicker
              name="thirdInstallmentEta"
              variant="outlined"
              type="date"
              format="DD/MM/YYYY"
              fullWidth
              required
              value={formData.thirdInstallmentEta}
              slotProps={{
                textField: {
                  helperText: "Select third installment Date",
                },
              }}
              onChange={(e) =>
                setFormData((prevData) => ({
                  ...prevData,
                  ["thirdInstallmentEta"]: e,
                }))
              }
            />

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

export default EditStudent;
