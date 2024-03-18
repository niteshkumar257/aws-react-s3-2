import React, { useEffect } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./TestForm.scss";
import { DatePicker } from "@mui/x-date-pickers";
import AddTestSubjectForm from "../AddTestSubjectForm/AddTestSubjectForm";
import { GW_URL, adminConfig } from "../../config";
import Loader from "../.././components/Loader/Loader";
import jwt_decode from "jwt-decode";
import TestList from "./TestList";
import useClassIdsQuery from "../../hooks/useGetSchoolIds";


const TestForm = (props) => {
  const [testName, setTestName] = useState("");
  const [testDate, setTestDate] = useState(null);

  const [testNameError, setTestNameError] = useState(false);
  const [testDateError, setTestDateError] = useState(false);

  const [testLoading, setTestLaoding] = useState(false);

  const [isExpanded, setExpanded] = useState(false);
  const isExpandedHandler = (value) => {
    setExpanded(value);
  };

  let decodeToken = jwt_decode(localStorage.getItem("auth_token"));
  let school_id =
    localStorage.getItem("superadmin_school") === null
      ? decodeToken.result.school_id
      : localStorage.getItem("superadmin_school");

      

  const AddTestHandler = (e) => {
    e.preventDefault();
    setTestNameError(false);
    setTestDateError(false);

    testName.trim();
    if (testName == "") {
      setTestNameError(true);
      return toast.error("TestName is required!", {
        theme: "dark",
      });
    }
    if (testDate == "") {
      setTestDateError(true);
      return toast.error("Test Date is required!", {
        theme: "dark",
      });
    }

    if (testDate != "" && testName != "") {
      setTestLaoding(true);
      axios
        .post(
          `${GW_URL}/schools/${school_id}/tests`,
          {
            test_name: testName,
            test_date: testDate,
          },
          adminConfig
        )
        .then((data) => {
          setTestLaoding(false);
          toast.success("Test Added Successfully", {
            position: "top-center",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
          });
          setTestName("");
          setTestDate(null);
          setTestNameError(false);
          setTestDateError(false);
        })
        .catch((err) => {
          setTestLaoding(false);
          toast.error("Database error!", {
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
    } else {
      toast.error("All fields are required!", {
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

  return (
    <div className="teachers-container ">
      <Sidebar isExpandedHandler={isExpandedHandler} />
      <div className="teachers">
        <Navbar adminName={props.AdminName} />
        <div className="teachers-page page-container">
          <div className="teacherForm-page-container">
            <div className="teacherForm-page-container-heading">
              {/* header container */}
              <span>Add Test</span>
            </div>
            <form noValidate onSubmit={AddTestHandler}>
              <div className="teachers-info-detail-container">
                <div className="teachers-info-detail-student-container">
                  <div className="teachers-info-detail-student-container-subheading">
                    <span>Test Details</span>
                  </div>
                  <div className="teachers-info-detail-student-container-textfield">
                    {/* row one */}
                    <div className="teachers-info-section ">
                      <TextField
                        value={testName}
                        sx={{ flex: 1 }}
                        label="Test Name"
                        error={testNameError}
                        required
                        helperText="Enter Test Name"
                        onChange={(e) => setTestName(e.target.value)}
                      />
                      <DatePicker
                        value={testDate}
                        sx={{ flex: 1 }}
                        error={testDateError}
                        variant="outlined"
                        format="DD/MM/YYYY"
                        slotProps={{
                          textField: {
                            helperText: "Enter Test Date",
                          },
                        }}
                        type="date"
                        onChange={(e) => setTestDate(e)}
                      />
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
        <AddTestSubjectForm />
       
      </div>
      <ToastContainer />
      <Loader open={testLoading} />
    </div>
  );
};

export default TestForm;
