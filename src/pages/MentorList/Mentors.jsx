import React from "react";
import "./Mentors.scss";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import DataTable from "../../components/DataTable/DataTable";
import Box from "@mui/material/Box";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
// import Mentor from "../Mentor/Mentor.js"
import MentorSchedule from "../MentorParentSchedule/MentorParentSchedule";
import useFetchAllMentor from "../../hooks/useFetchAllMentor";
import { GW_URL } from "../../config";

// columns  of the teacher Details table
const columns = [
  {
    field: "id",
    headerName: "S No.",
    flex: 1,
    editable: false,
    align: "left",
    headerAlign: "left",
  },
  {
    field: "mentor_id",
    headerName: "Mentor Id",
    flex: 1,
    editable: false,
    align: "left",
    headerAlign: "left",
  },
  {
    field: "mentor_name",
    headerName: "Mentor Name",
    flex: 1,
    editable: false,
    headerAlign: "left",
    align: "left",
  },
  {
    field: "gmail",
    headerName: "Gmail",
    editable: true,
    flex: 1,
    editable: false,
    headerAlign: "left",
    align: "left",
  },
  {
    field: "mobile",
    headerName: "Mobile Number",
    flex: 1,
    editable: false,
    headerAlign: "left",
    align: "left",
  },
];
const Mentors = (props) => {
  const { isLoading, isError, data } = useFetchAllMentor();
  const [rows, setRows] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    if (isError) {
      console.log("error");
    }

    if (!isLoading) {
      let allMentors = [];
      for (let i = 0; i < data?.data?.mentors.length; i++) {
        let mentor = {
          id: i + 1,
          mentor_id: data.data.mentors[i].mentor_id,
          mentor_name:
            data.data.mentors[i].mentor_name.charAt(0).toUpperCase() +
            data.data.mentors[i].mentor_name.slice(1),
          gmail: data.data.mentors[i].gmail,
          mobile: data.data.mentors[i].mobile,
          photo: data.data.mentors[i].photo,
        };
        allMentors.push(mentor);
      }
      setRows(allMentors);
    }
  }, [data]);

  const getBase64FromUrl = async (url) => {
    const data = await fetch(url);
    const blob = await data.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(blob);
      reader.onloadend = () => {
        const base64data = reader.result;
        resolve(base64data);
      };
    });
  };

  const handleSelect = (mentor_id) => {
    navigate(`/Mentor/${mentor_id}`);
    // const newTab = window.open();
    // let base64File = await getBase64FromUrl(data);
    // newTab?.document.write(
    // `<!DOCTYPE html><head><title>Profile image</title></head><body  margin="0px" width="1000px" height="948px"><img src="${base64File}"  marigin= "0px" width="1000px"   height="948px"></body></html>`);
    // newTab?.document.close();
  };
  const viewColumn = [
    {
      field: "view",
      headerName: "Mentor Details",
      width: 200,
      sortable: false,
      editable: false,
      flex: 1,
      renderCell: (params) => {
        return (
          <div className="viewButton">
            <button
              className="btn"
              onClick={() => handleSelect(params.row.mentor_id)}
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
    <div className="teachers-container ">
      <Sidebar />
      <div className="teachers">
        <Navbar adminName={props.AdminName} />
        <div className="teachers-page page-container">
          <div className="teacher-detail-heading">
            <span>Mentor Details</span>
            {/* <div className='teacher-detail-search'>
              <input type='number' placeholder='Search by id... ' />
              <input type='text' placeholder='Search by Name... ' />
              <input type='phone' placeholder='Search by Phone.. ' />
              <div className='teacher-detail-search-btn'>
                <button>
                  SEARCH
                </button>
              </div>
            </div> */}
          </div>
          <div className="table">
            {/* <Box sx={{
              display: "flex",
              width: "100%",
              marginBottom: 5
            }}> */}
            {
              <DataTable
                expandHandler={isExpanded}
                width={100}
                rows={rows}
                columns={columns.concat(viewColumn)}
                loader={isLoading}
                emptyRowsMessage={"No Mentors"}
              />
            }

            {/* </Box> */}
            <div
              className="newButton"
              style={{
                position: "relative",
                marginBottom: "35px",
                marginTop: "10px",
              }}
            >
              <Link
                to="/AddMentor"
                style={{ position: "absolute", right: "0px" }}
              >
                <button>Add new Mentor</button>
              </Link>
            </div>
          </div>
          <MentorSchedule />
        </div>
      </div>
    </div>
  );
};

export default Mentors;
