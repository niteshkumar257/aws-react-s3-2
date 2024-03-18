import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  CircularProgress,
} from "@mui/material";
import usefetchStudentPerformanceReport from "../../hooks/useFetchEachStudentPTMReport";
import "./EachPTMReport.scss";

const EachPTMReport = ({ isOpen, onClose, studentId, selectedPTM }) => {
  const [studentDetails, setStudentDetails] = useState({
    student_name: "",
    father_name: "",
    mother_name: "",
    section: "",
    medium: "",
    class: "",
    subject_status: [],
    performance_reason: [],
    parents_suggestion: [],
    subject_names: "",
  });

  const [performanceReport, setPerformanceReport] = useState({
    details: "",
  });

  const [poorPerformance, setPoorPerformance] = useState({
    reason: "",
  });

  const [parentSuggestion, setParentSuggestion] = useState({
    suggestion: "",
  });
  let { isLoading, isError, data } = usefetchStudentPerformanceReport(
    studentId,
    selectedPTM
  );

  useEffect(() => {
    if (isError) {
      toast.error("Couldn't fetch report!");
      return;
    }
    if (!isLoading) {
      let allDetails = data.data.ptmReport;

      setStudentDetails({
        ...allDetails,
        subject_status: allDetails.status,
        class:
          allDetails.class_id == -3
            ? "Nursery"
            : allDetails.class_id == -2
            ? "KG-2"
            : allDetails.class_id == -1
            ? "KG-1"
            : allDetails.class_id,
      });
    }
  }, [data]);

  return (
    <Dialog open={isOpen} onClose={onClose} maxWidth="lg">
      <DialogTitle>PTM REPORT</DialogTitle>
      <DialogContent>
        {isLoading ? (
          <div className="loader">
            <CircularProgress />
          </div>
        ) : (
          <>
            <div className="section">
              <h2>Student Details</h2>
              <div className="content">
                <div className="first">
                  <p>
                    Student Name:{" "}
                    <span className="details">
                      {studentDetails.student_name}
                    </span>
                  </p>
                  <p>
                    Father Name:{" "}
                    <span className="details">
                      {studentDetails.father_name}
                    </span>
                  </p>
                  <p>
                    Mother Name:{" "}
                    <span className="details">
                      {studentDetails.mother_name}
                    </span>
                  </p>
                </div>

                <div className="second">
                  <p>
                    Class:{" "}
                    <span className="details">{studentDetails.class}</span>
                  </p>
                  <p>
                    Medium:{" "}
                    <span className="details">{studentDetails.medium}</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="section">
              <h2>Performance Report</h2>
              {studentDetails?.subject_status.map((index, data) => (
                <div className="content">
                  <p style={{ width: "30%" }}>
                    {studentDetails.subject_names[index - 1]}
                  </p>
                  <p className="details"> Level {data}</p>
                </div>
              ))}
            </div>

            <div className="section">
              <h2>Reason for Poor Performance</h2>
              {studentDetails?.performance_reason.map((data, index) => (
                <div className="content" style={{ width: "100%" }}>
                  <p>{index + 1}.</p>
                  <p className="details">{data}</p>
                </div>
              ))}
            </div>

            <div className="section">
              <h2>Suggestion from Parents</h2>
              {studentDetails?.parents_suggestion.map((data, index) => (
                <div className="content" style={{ width: "100%" }}>
                  <p>{index + 1}.</p>
                  <p className="details">{data}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EachPTMReport;
