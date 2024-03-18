import React, { useRef, useState } from "react";
import "./TransferCertificate.css";
import logo from "../../assest/gaanvwala.png";
import { Button, TextField } from "@mui/material";
import moment from "moment";
import { DatePicker } from "@mui/x-date-pickers";
import { ToastContainer, toast } from "react-toastify";

const TransferCertificate = ({ handleSubmit, schoolData }) => {
  const inputRef = React.createRef();
  const [formData, setFormData] = useState({
    student_name: "",
    father_name: "",
    birth: "",
    classPassed: "",
  });
  const [openCertificate, setOpenCertificate] = useState(false);

  let indian_date = new Date().toLocaleString("en-Us", {
    timeZone: "Asia/Kolkata",
  });
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const errorCheck = () => {
    if (formData.student_name.trim() == "") {
      toast.error("Student name is required!", {
        theme: "dark",
      });
      return true;
    }
    if (formData.father_name.trim() == "") {
      toast.error("Father name is required!", {
        theme: "dark",
      });
      return true;
    }
    if (formData.birth == "") {
      toast.error("Date of birth is required!", {
        theme: "dark",
      });
      return true;
    }
    if (formData.classPassed.trim() == "") {
      toast.error("Class is required!", {
        theme: "dark",
      });
      return true;
    }
    return false;
  };

  const generateTicketSubmit = (e) => {
    e.preventDefault();
    if (errorCheck()) {
      return;
    }
    setOpenCertificate(!openCertificate);
  };
  const handleDownLoadCertificate = (e) => {
    e.preventDefault();
    if (errorCheck()) {
      return;
    }
    handleSubmit({
      inputRef,
      setFormData,
      formField: {
        student_name: "",
        father_name: "",
        birth: "",
        classPassed: "",
      },
    });
    setOpenCertificate(!openCertificate);
  };
  return (
    <div className="certificate-container-2">
      <form onSubmit={generateTicketSubmit}>
        <div className="row">
          <TextField
            disabled={openCertificate}
            name="student_name"
            fullWidth
            value={formData.student_name}
            label="Student Name"
            required
            helperText="Enter Student Name"
            onChange={handleFormChange}
          />
          <TextField
            disabled={openCertificate}
            name="father_name"
            fullWidth
            value={formData.father_name}
            label="Father Name"
            required
            helperText="Enter Father Name"
            onChange={handleFormChange}
          />
        </div>
        <div className="row">
          <DatePicker
            disabled={openCertificate}
            format="DD/MM/YYYY"
            sx={{ flex: 1 }}
            name="birth"
            variant="outlined"
            type="date"
            disableFuture
            value={formData.birth}
            slotProps={{
              textField: {
                helperText: "Select Date Of Birth",
              },
            }}
            onChange={(e) => setFormData((prev) => ({ ...prev, ["birth"]: e }))}
          />
          <TextField
            disabled={openCertificate}
            type="number"
            name="classPassed"
            sx={{ flex: 1 }}
            value={formData.classPassed}
            label="Class"
            required
            helperText="Enter Passed Class"
            onChange={handleFormChange}
          />
        </div>
        <div className="row">
          {openCertificate && (
            <Button
              fullWidth
              variant="contained"
              onClick={handleDownLoadCertificate}
              style={{ padding: "1.3em" }}
            >
              Download
            </Button>
          )}
          <Button
            fullWidth
            variant="contained"
            type="submit"
            style={{ padding: "1.3em" }}
          >
            {openCertificate ? "Close" : "Generate"}
          </Button>
        </div>
      </form>
      {openCertificate && (
        <div
          className="certificate-section"
          id="certificate-section"
          ref={inputRef}
        >
          <div className="water-mark-overlay"></div>
          <div className="certificate-header">
            <img src={logo} className="logo" alt="" />
          </div>
          <div className="certificate-body">
            <p className="certificate-title">
              <strong>{schoolData.school_name}</strong>
            </p>
            <h1>School Leaving Certificate</h1>
            <div className="certificate-content">
              <p
                style={{ width: "100%", fontSize: "1.5em", fontWeight: "700" }}
              >
                It is certified that{" "}
                <span className="input-data">{formData.student_name}</span> C/O{" "}
                <span className="input-data">{formData.father_name}</span> is a
                bonafide student of this school. His Date of Birth per school
                record us{" "}
                <span className="input-data">
                  {moment(new Date(formData.birth)).format("DD/MM/YYYY")}
                </span>
                . He/She has passed class{" "}
                <span className="input-data">{formData.classPassed}</span>. U
                wish him/her a very bright future. This is certificate is being
                issued upon the request of the above-named student fir whatever
                legal purpose it may serve.
              </p>
            </div>
            <div className="certificate-footer">
              <div className="date">
                <p>{moment(indian_date).format("DD/MM/YYYY")}</p>
                <p>Date</p>
              </div>
              <div className="signature">
                <p>Swayam Prakash Barik</p>
                <p>Signature</p>
              </div>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default TransferCertificate;
