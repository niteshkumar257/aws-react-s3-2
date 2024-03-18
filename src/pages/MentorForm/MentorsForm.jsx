import React, { useEffect } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { Button } from "@mui/material";
import "react-toastify/dist/ReactToastify.css";
import "./MentorsForm.scss";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ALL_MENTOR_KEY } from "../../hooks/useFetchAllMentor";
import { GW_URL, isEmail, superAdminConfig, validateEmail } from "../../config";
import Loader from "../../components/Loader/Loader";
import { useNavigate } from "react-router-dom";
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

const columns = [
  { field: "id", headerName: "", width: 0, hide: true },
  {
    field: "school_id",
    headerName: "School Id",
    width: 50,
    flex: 1,
    editable: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "school_name",
    flex: 1,
    headerName: "School Name",
    width: 200,
    editable: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "class",
    headerName: "Class",
    width: 50,
    flex: 1,
    editable: true,
    headerAlign: "center",
    align: "center",
  },
  { field: "class id", headerName: "", width: 50, editable: true, hide: true },
];

const addMentor = ({ mentor_name, email, details, mobile, formData }) => {
  return axios.post(
    `${GW_URL}/addMentor?mentor_name=${mentor_name}&gmail=${email}&details=${details}&mobile=${mobile}`,
    formData,
    superAdminConfig
  );
};
const MentorForm = (props) => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [isExpanded, setExpanded] = useState(false);
  const [mentor_name, setMentorName] = useState("");
  const [mentorNameError, setMentorNameError] = useState(false);
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [details, setDetails] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [mobileError, setMobileError] = useState(false);
  const [detaisError, setDetailsError] = useState(false);
  const [openLoader, setOpenLoader] = useState(false);
  const navigate = useNavigate();

  const isExpandedHandler = (value) => {
    setExpanded(value);
  };

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: addMentor,
    onSuccess: () => {
      setOpenLoader(false);
      queryClient.invalidateQueries(ALL_MENTOR_KEY);
      toast.success("Mentor added successfully", {
        theme: "dark",
      });
      setFile(null);
      setFileName("");
      setMobile("");
      setEmail("");
      setDetails("");
      setMentorName("");
      setTimeout(() => {
        navigate("/Mentor");
      }, 2200);
    },
    onError: () => {
      setOpenLoader(false);
      toast.error("Something went wrong!", {
        theme: "dark",
      });
    },
  });

  const AddMentorHandler = async (e) => {
    e.preventDefault();
    mentor_name.trim();
    email.trim();
    mobile.trim();
    details.trim();
    setMentorNameError(false);
    setEmailError(false);
    setDetailsError(false);
    setMobileError(false);

    if (mentor_name.length == 0) {
      setMentorNameError(true);
      toast.error("Please enter mentor name!", {
        theme: "dark",
      });
      return;
    }
    if (email.length == 0) {
      setEmailError(true);
      toast.error("Please enter email!", {
        theme: "dark",
      });
      return;
    }
    if (!validateEmail(email)) {
      setEmailError(true);
      toast.error("Enter valid Email id", {
        theme: "dark",
      });
      return;
    }
    if (mobile.length != 10) {
      setMobileError(true);
      toast.error("Please enter 10 digit mobile number!", {
        theme: "dark",
      });
      return;
    }
    if (details.length == 0) {
      setDetailsError(true);
      toast.error("Please enter details!", {
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
    setOpenLoader(true);
    setEmailError(false);
    mutation.mutate({ mentor_name, email, details, mobile, formData });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    if (e.target.files[0]) {
      setFileName(e.target.files[0].name);
    } else {
      setFileName("");
    }
  };

  // const viewColumn = [
  //   {
  //     field: "view", headerName: "View Curriculum", width: 200, sortable: false,
  //     editable: false,
  //     flex: 1,
  //     renderCell: (params) => {
  //       return (
  //         <div className="viewButton">
  //           <button className='btn' onClick={() => handleViewSelect(params.row.school_id, params.row.class_id)} >View</button>
  //         </div>
  //       );
  //     },
  //   }
  // ]
  return (
    <div className="teachers-container ">
      <Sidebar isExpandedHandler={isExpandedHandler} />
      <div className="teachers">
        <Navbar adminName={props.AdminName} />
        <div className="teachers-page page-container">
          <div className="teacherForm-page-container">
            <div className="teacherForm-page-container-heading">
              {/* header container */}
              <span>Add Mentor</span>
            </div>
            <form noValidate onSubmit={AddMentorHandler}>
              <div className="teachers-info-detail-container">
                <div className="teachers-info-detail-student-container">
                  <div className="teachers-info-detail-student-container-subheading">
                    <span>Mentor Details</span>
                  </div>
                  <div className="teachers-info-detail-student-container-textfield">
                    {/* row one */}
                    <div className="teachers-info-section ">
                      <TextField
                        value={mentor_name}
                        sx={{ flex: 1 }}
                        label="Mentor Name"
                        error={mentorNameError}
                        required
                        helperText="Enter Name"
                        onChange={(e) => setMentorName(e.target.value)}
                      />

                      <TextField
                        value={email}
                        sx={{ flex: 1 }}
                        label="Email"
                        error={emailError}
                        required
                        helperText={
                          emailError ? "Enter valid email" : "Enter email"
                        }
                        onChange={(e) => setEmail(e.target.value)}
                        emailError
                      />
                      <TextField
                        type="number"
                        value={mobile}
                        sx={{ flex: 1 }}
                        label="Mobile"
                        error={mobileError}
                        required
                        helperText="Enter mobile"
                        onChange={(e) => setMobile(e.target.value)}
                      />
                    </div>

                    <div className="teachers-info-section ">
                      <TextField
                        value={details}
                        sx={{ flex: 1 }}
                        label="Mentor Details"
                        error={detaisError}
                        multiline
                        rows={4}
                        required
                        helperText="Enter details"
                        onChange={(e) => setDetails(e.target.value)}
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
          {/* <DataTable rows={rows} columns={columns.concat(viewColumn)}/> */}
        </div>
      </div>
      <ToastContainer />
      <Loader open={openLoader} />
    </div>
  );
};

export default MentorForm;
