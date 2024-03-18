import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import TransferCertificate from "../../components/Certificate/TransferCertificate";
import {
  FormControl,
  InputLabel,
  Paper,
  Select,
  MenuItem,
  TextField,
} from "@mui/material";
import { jsPDF } from "jspdf";
import jwt_decode from "jwt-decode";
import axios from "axios";
import html2canvas from "html2canvas";
import "./Certificate.scss";
import { GW_URL, adminConfig } from "../../config";

const allCertificate = [
  {
    id: 1,
    name: "School Leaving Certificate",
  },
  {
    id: 2,
    name: "Certificate of completion",
  },
];

const Certificate = (props) => {
  const [selectedCertificate, setSelectedCertificate] = useState("");
  const [schoolData, setSchoolData] = useState();

  let decodeToken = jwt_decode(localStorage.getItem("auth_token"));
  let school_id =
    localStorage.getItem("superadmin_school") === null
      ? decodeToken.result.school_id
      : localStorage.getItem("superadmin_school");

  useEffect(() => {
    axios.get(`${GW_URL}/schools/${school_id}`, adminConfig).then((res) => {
      setSchoolData(res?.data.schoolDetail);
    });
  }, [school_id]);

  const handleCertificateChange = (e) => {
    e.preventDefault();

    setSelectedCertificate(e.target.value);
  };

  const handleSubmit = ({ inputRef, setFormData, formField }) => {
    html2canvas(inputRef.current).then((canvas) => {
      // const imgData = canvas.toDataURL("image/png");
      // const pdf = new jsPDF();
      // const imgProps= pdf.getImageProperties(imgData);
      // const pdfWidth = pdf.internal.pageSize.getWidth();
      // const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
      // pdf.addImage(imgData, 'PNG', 0, pdfHeight/2,pdfWidth, pdfHeight);
      // pdf.save("certificate.pdf");
      canvas.style.display = "none";
      var image = canvas.toDataURL("png");
      var a = document.createElement("a");
      a.setAttribute("download", "certificate.png");
      a.setAttribute("href", image);
      a.click();
      setFormData(formField);
    });
  };

  return (
    <div className="certificate-container">
      <Sidebar />
      <div className="certificate">
        <Navbar adminName={props.AdminName} />
        <div className="all-certificate">
          <h2>Certificate Generate</h2>
          <Paper
            elevation={3}
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
            }}
          >
            <div className="form-container" style={{ margin: "auto" }}>
              <p style={{ fontSize: "18px", fontWeight: "600" }}>
                Enter certificate type
              </p>
              <FormControl sx={{ marginBottom: "20px" }}>
                <InputLabel id="demo-simple-select-label">
                  Certificate Type
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={selectedCertificate}
                  label="Installment No."
                  onChange={handleCertificateChange}
                >
                  {allCertificate?.map((val) => {
                    return <MenuItem value={val.id}>{val.name}</MenuItem>;
                  })}
                </Select>
              </FormControl>
              {selectedCertificate == 1 && (
                <TransferCertificate
                  handleSubmit={handleSubmit}
                  schoolData={schoolData}
                />
              )}
            </div>
          </Paper>
        </div>
      </div>
    </div>
  );
};

export default Certificate;
