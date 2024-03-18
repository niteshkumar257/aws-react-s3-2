import React, { useEffect } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./CreatePTM.scss";
import { DatePicker } from "@mui/x-date-pickers";
import { GW_URL, adminConfig } from "../../config";
import Loader from "../.././components/Loader/Loader";
import jwt_decode from "jwt-decode";
import useSchoolData from "../../hooks/useSchoolData";
import {
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
import useFetchAllClassTeacher from "../../hooks/useFetchAllClassTeacher";
import useFetchTeacher from "../../hooks/useFetchTeacher";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import PTMSchedule from "./PTMSchedule";

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

const addPTMDetails = ({
  school_id,
  class_ids,
  schedule_date,
  ptm_name,
  teacher_ids,
  medium,
}) => {
  return axios.post(
    `${GW_URL}/admin/${school_id}/addPTM`,
    { class_ids, schedule_date, ptm_name, teacher_ids, medium },
    adminConfig
  );
};

const displayError = (message) => {
  toast.error(message, {
    position: "top-center",
    autoClose: 2000,
    theme: "dark",
  });
};

function isValidIndianDate(dateString) {
  const dateRegex = /^(\d{2})-(\d{2})-(\d{4})$/;

  const match = dateString.match(dateRegex);

  if (!match) {
    return false;
  }

  const day = parseInt(match[1], 10);
  const month = parseInt(match[2], 10);
  const year = parseInt(match[3], 10);

  if (
    day < 1 ||
    day > 31 ||
    month < 1 ||
    month > 12 ||
    year < 1000 ||
    year > 9999
  ) {
    return false;
  }

  return true;
}

const PTMDetailsPage = (props) => {
  const [ptmDetails, setPTMDetails] = useState({
    schedule_date: "",
    ptmName: "",
    medium: "",
  });

  const [classsId, setClasssId] = useState([]);
  const [classs, setClasss] = useState([]);
  const [teacherDetails, setTeacherDetails] = useState([]);

  let decodeToken = jwt_decode(localStorage.getItem("auth_token"));
  let school_id =
    localStorage.getItem("superadmin_school") === null
      ? decodeToken.result.school_id
      : localStorage.getItem("superadmin_school");

  const {
    isLoading: classArrayLoading,
    classArray,
    mediumArray,
  } = useSchoolData(school_id);
  const { data: allTeacher } = useFetchTeacher(school_id);
  const {
    isLoading,
    isError,
    data: classTeacherData,
  } = useFetchAllClassTeacher(school_id);

  useEffect(() => {
    let allDetails = [];
    for (let i = 0; i < classsId?.length; i++) {
      let data = classTeacherData.data.allClassTeacher.find(
        (teacher) =>
          teacher.class_id == classsId[i] && teacher.medium == teacher.medium
      );
      let teacher = allTeacher.data.teacherDetails.find(
        (teacher) => teacher.id == data.teacher_id
      );
      allDetails.push({
        class_id: classsId[i],
        id: teacher.teacher_id,
        teacher_name: teacher.teacher_name,
      });
    }
    setTeacherDetails(allDetails);
  }, [classsId]);

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: addPTMDetails,
    onSuccess: () => {
      // queryClient.invalidateQueries({ queryKey: [ALL_SCHOOL_FETCH_KEY] });
      toast.success("PTM added Successfully!", {
        position: "top-center",
        autoClose: 2000,
        theme: "dark",
      });
      setPTMDetails({
        schedule_date: "",
        ptmName: "",
        medium: "",
      });
      setClasssId([]);
      setClasss([]);
      setTeacherDetails([]);
    },
    onError: (err) => {
      displayError(
        err.response?.data?.error
          ? err.response?.data?.error
          : "Something went wrong"
      );
    },
  });

  const AddPTMhandler = (e) => {
    e.preventDefault();

    if (ptmDetails.ptmName.length == 0) {
      displayError("PTM name is required!");
      return;
    }
    let ptmNameSplite = ptmDetails.ptmName.split("#");

    if (
      ptmNameSplite.length != 2 ||
      !isValidIndianDate(ptmNameSplite[1].trim())
    ) {
      displayError("PTM name should be in given format!");
      return;
    }

    if (classsId.length == 0) {
      displayError("Class is required!");
      return;
    }

    if (ptmDetails.medium.length == 0) {
      displayError("Medium is required!");
      return;
    }

    if (ptmDetails.schedule_date.length == 0) {
      displayError("Schedule date is required!");
      return;
    }
    let allTeacher = [];
    for (let i = 0; i < classsId.length; i++) {
      allTeacher.push(
        teacherDetails.filter((teacher) => teacher.class_id == classsId[i])[0]
          ?.id
      );
    }

    mutation.mutate({
      school_id: school_id,
      schedule_date: ptmDetails.schedule_date,
      medium: ptmDetails.schedule_date,
      class_ids: classsId,
      ptm_name: ptmDetails.ptmName,
      teacher_ids: allTeacher,
    });
  };

  const handleClassChange = (event) => {
    const {
      target: { value },
    } = event;

    let duplicateRemoved = [];
    let dataIds = [];
    value.forEach((item) => {
      if (duplicateRemoved.findIndex((o) => o.id == item.id) >= 0) {
        duplicateRemoved = duplicateRemoved.filter((x) => x.id != item.id);
      } else {
        duplicateRemoved.push(item);
      }
    });

    duplicateRemoved.forEach((item) => {
      dataIds.push(item.id);
    });
    setClasssId(dataIds);
    setClasss(duplicateRemoved);
  };

  const handleTeacherChange = (e, class_id, value) => {
    e.preventDefault();
    let teachers = teacherDetails?.map((teacher) => {
      if (teacher.class_id == class_id) {
        return {
          class_id: class_id,
          id: value.id,
          teacher_name: value.teacher_name,
        };
      } else {
        return teacher;
      }
    });

    setTeacherDetails(teachers);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPTMDetails((prevData) => ({ ...prevData, [name]: value }));
  };

  const [isExpanded, setExpanded] = useState(false);
  const isExpandedHandler = (value) => {
    setExpanded(value);
  };

  return (
    <div className="ptm-container ">
      <Sidebar isExpandedHandler={isExpandedHandler} />
      <div className="ptm">
        <Navbar adminName={props.AdminName} />
        <div className="ptm-page page-container">
          <div className="ptm-page-container">
            <div className="ptm-page-container-heading">
              {/* header container */}
              <span>Add PTM</span>
            </div>
            <form noValidate onSubmit={AddPTMhandler}>
              <div className="ptm-info-detail-container">
                <div className="ptm-info-detail-student-container">
                  <div className="ptm-info-detail-student-container-subheading">
                    <span>Schedule Student Parent Meeting</span>
                  </div>
                  <div className="ptm-info-detail-student-container-textfield">
                    {/* row one */}
                    <div className="ptm-info-section ">
                      <TextField
                        sx={{ m: 0, flex: 1 }}
                        name="ptmName"
                        value={ptmDetails.ptmName}
                        onChange={handleChange}
                        variant="outlined"
                        helperText="Add name of ptm with date. Ex - name # 20-10-2023"
                        label="PTM name"
                        required
                      />
                      <TextField
                        value={ptmDetails.medium}
                        sx={{ flex: 1 }}
                        required
                        select
                        helperText="Select Medium"
                        label="Medium"
                        onChange={(e) =>
                          setPTMDetails((prev) => ({
                            ...prev,
                            medium: e.target.value,
                          }))
                        }
                      >
                        {mediumArray.map((option) => (
                          <MenuItem key={option.value} value={option.value}>
                            {option.label}
                          </MenuItem>
                        ))}
                      </TextField>
                      {ptmDetails.medium.length > 0 && (
                        <FormControl required sx={{ m: 0, flex: 1 }}>
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
                              selected.map((x) => x.label).join(", ")
                            }
                            MenuProps={MenuProps}
                          >
                            {classArray?.map((variant) => (
                              <MenuItem key={variant.id} value={variant}>
                                <Checkbox
                                  checked={
                                    classs?.findIndex(
                                      (item) => item.id == variant.id
                                    ) >= 0
                                  }
                                />
                                <ListItemText primary={variant.label} />
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      )}
                      <DatePicker
                        value={ptmDetails.schedule_date}
                        sx={{ flex: 1 }}
                        variant="outlined"
                        format="DD/MM/YYYY"
                        slotProps={{
                          textField: {
                            helperText: "Enter Test Date",
                          },
                        }}
                        disablePast
                        type="date"
                        onChange={(e) =>
                          setPTMDetails((prev) => ({
                            ...prev,
                            schedule_date: e,
                          }))
                        }
                      />
                    </div>

                    <div className="grid-value">
                      {classs?.map((val) => (
                        <div className="subject-values">
                          <h3>{val.label}</h3>
                          <TextField
                            name="teacher_name"
                            value={
                              teacherDetails?.find(
                                (teacher) => teacher.class_id == val.id
                              )?.teacher_name
                            }
                            disabled
                            fullWidth
                            margin="normal"
                          ></TextField>
                          <TextField
                            name="teacher"
                            label="Change Teacher"
                            select
                            value={teacherDetails?.find(
                              (teacher) => teacher.class_id == val.id
                            )}
                            onChange={(e) =>
                              handleTeacherChange(e, val.id, e.target.value)
                            }
                            fullWidth
                            margin="normal"
                            sx={{ marginLeft: "10%" }}
                          >
                            {allTeacher?.data?.teacherDetails?.map((option) => (
                              <MenuItem key={option.id} value={option}>
                                {option.teacher_name}
                              </MenuItem>
                            ))}
                          </TextField>
                        </div>
                      ))}
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
        <PTMSchedule />
      </div>
      <ToastContainer />
      <Loader />
    </div>
  );
};

export default PTMDetailsPage;
