import { useEffect, useState } from "react";
import "./PTMSchedule.scss";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import DataTable from "../../components/DataTable/DataTable";
import Box from "@mui/material/Box";
import jwt_decode from "jwt-decode";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  GW_URL,
  adminConfig,
  validateEmail,
  StudentListColumn,
} from "../../config";
import Loader from "../../components/Loader/Loader";
import { TextField, MenuItem } from "@mui/material";
import useFetchAllPerformanceReport from "../../hooks/useFetchAllPerformanceReport";
import usefetchAllPTM from "../../hooks/useFetchAllPTM";
import axios from "axios";
import EachPTMReport from "./EachPTMReport";

const CapitalLizeFirstLetter = (arr) => {
  const modifiedArray = arr.map((item) => {
    const modifiedItem = {
      id: item.id,
      student_name: capitalizeFirstLetter(item.student_name),
      class_id: item.class_id,
      medium: item.medium,
      student_id: item.student_id,
      section: item.section,
    };
    return modifiedItem;
  });
  return modifiedArray;
};

function capitalizeFirstLetter(string) {
  if (typeof string !== "string") {
    return string; // Return the input value if it's not a string
  }
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const emptyRowsMessage = "No data available";

const PTMSchedule = (props) => {
  const [ptmDetails, setPTMDetails] = useState();
  const [rows, setRows] = useState([]);
  const [loaderOpen, setLoaderOpen] = useState(false);
  const [selectedPTMId, setSelectedPTMId] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [isPopupOpen, setPopupOpen] = useState(false);

  let decodeToken = jwt_decode(localStorage.getItem("auth_token"));
  let school_id =
    localStorage.getItem("superadmin_school") === null
      ? decodeToken.result.school_id
      : localStorage.getItem("superadmin_school");

  const { data } = usefetchAllPTM(school_id);

  const handleLowerClass = (rows) => {
    const modifiedRows = rows.map((row) => {
      if (row.class_id === -3) {
        return { ...row, class_id: "Nursery" };
      } else if (row.class_id === -2) {
        return { ...row, class_id: "KG-1" };
      } else if (row.class_id === -1) {
        return { ...row, class_id: "KG-2" };
      } else {
        return row;
      }
    });
    return modifiedRows;
  };
  useEffect(() => {
    if (selectedPTMId != "") {
      setLoaderOpen(true);
      axios
        .get(
          `${GW_URL}/admin/${selectedPTMId}/getAllPTMReport?school_id=${school_id}`,
          adminConfig
        )
        .then((res) => {
          let allPTMReport = res.data.allPTMReport;
          let allRows = [];
          for (let i = 0; i < allPTMReport?.length; i++) {
            allRows.push({ ...allPTMReport[i], id: i + 1 });
          }
          setLoaderOpen(false);
          setRows(allRows);
        })
        .catch((err) => {
          toast.error("Couldn't fetch PTM details!");
        });
    }
  }, [selectedPTMId]);

  const handleClose = () => {
    setPopupOpen(false);
  };

  const handleSelect = (data) => {
    setPopupOpen(true);
    setSelectedStudentId(data.student_id);
  };

  // view button of the student table
  const viewColumn = [
    {
      field: "view",
      headerName: "PTM Report",
      width: 200,
      editable: false,
      sortable: false,
      align: "center",
      headerAlign: "center",
      flex: 1,
      disableFilter: true,
      renderCell: (params) => {
        return (
          <div className="viewButton">
            <button
              style={{ marginRight: "5px" }}
              onClick={() => handleSelect(params.row)}
            >
              View
            </button>
          </div>
        );
      },
    },
  ];

  const [isExpanded, setExpanded] = useState(false);
  const isExpandedHandler = (value) => {
    setExpanded(value);
  };
  return (
    <div className="ptm-report-container">
      <div className="ptm-report">
        <div className="ptm-report-page page-container">
          <div className="ptm-report-detail-heading">
            <span>PTM Reports</span>
          </div>
          <TextField
            value={ptmDetails}
            required
            select
            helperText="Select PTM Name"
            label="PTM Name"
            onChange={(e) => setSelectedPTMId(e.target.value)}
          >
            {data?.data?.allPTMList?.map((option) => (
              <MenuItem key={option.ptm_id} value={option.ptm_id}>
                {option.ptm_name}
              </MenuItem>
            ))}
          </TextField>
          <Box>
            {
              <DataTable
                rows={rows}
                columns={StudentListColumn.concat(viewColumn)}
                emptyRowsMessage={"No report till now"}
                loader={loaderOpen}
              />
            }
          </Box>
        </div>
        {
          <EachPTMReport
            isOpen={isPopupOpen}
            onClose={handleClose}
            studentId={selectedStudentId}
            selectedPTM={selectedPTMId}
          />
        }
      </div>
      <ToastContainer />
      {/* <Loader open={loaderOpen} /> */}
    </div>
  );
};

export default PTMSchedule;
