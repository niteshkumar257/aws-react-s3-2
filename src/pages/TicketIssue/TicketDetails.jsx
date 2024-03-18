import React from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import "./TicketDetails.scss";
import Paper from "@mui/material/Paper";
import { useParams, useSearchParams } from "react-router-dom";
import ChatContainer from "./ChatContainer";
import jwt_decode from "jwt-decode";

const allStatus = [
  {
    status_id: 1,
    status_name: "Pending at admin",
  },
  {
    status_id: 2,
    status_name: "Pending at superadmin",
  },
  {
    status_id: 3,
    status_name: "Resolved",
  },
  {
    status_id: 4,
    status_name: "Revoked",
  },
];
const TicketDetails = () => {
  let {
    id,
    school_id,
    school_name,
    father_name,
    parents_id,
    teacher_id,
    teacher_name,
    title,
    description,
    created_on,
    status,
    admin_id,
  } = useParams();
  let decodeToken = jwt_decode(localStorage.getItem("auth_token"));

  const getStatusClass = (status) => {
    switch (status) {
      case 1:
        return "orange-status";
      case 2:
        return "orange-status";
      case 3:
        return "green-status";
      case 4:
        return "red-status";
      default:
        return "";
    }
  };
  console.log(getStatusClass(1));

  return (
    <div className="ticketDetails-container ">
      <Sidebar />
      <div className="ticketDetails">
        <Navbar />
        <div className="ticketDetails-page page-container">
          <div className="ticketDetailsContainer">
            <Paper
              elevation={3}
              sx={{
                width: "100%",
                padding: "10px",
              }}
            >
              {/* <div className='firstContainer'>Ticket Details</div>
              <div className='seconContainer'>ticket info</div>
              <div className='thirdContainer'>ticket status</div> */}
              <div className="ticket-details">
                <div className="ticket-info-details">
                  <div className="ticket-details-row">
                    <h3 className="ticket-details-label">Ticket Id:</h3>
                    <h3 className="ticket-details-value">{id}</h3>
                  </div>
                  <div className="ticket-details-row">
                    <h3 className="ticket-details-label">School Name:</h3>
                    <h3 className="ticket-details-value">{school_name}</h3>
                  </div>
                  <div className="ticket-details-row">
                    <h3 className="ticket-details-label">Parent's Name:</h3>
                    <h3 className="ticket-details-value">{father_name}</h3>
                  </div>
                </div>

                <div className="ticket-details-row">
                  <h3 className="ticket-details-label">Title:</h3>
                  <h3 className="ticket-details-value">{title}</h3>
                </div>
                <div className="ticket-details-row">
                  <h3 className="ticket-details-label">Description:</h3>
                  <h3 className="ticket-details-value">{description}</h3>
                </div>
                <div className="ticket-details-row">
                  <h3 className="ticket-details-label">Created On:</h3>
                  <h3 className="ticket-details-value">{created_on}</h3>
                </div>
                <div className="ticket-details-row">
                  <h3 className="ticket-details-label">Status:</h3>
                  <h3
                    className={`ticket-details-value ${getStatusClass(status)}`}
                  >
                    {allStatus[status - 1].status_name}
                  </h3>
                </div>
              </div>
            </Paper>
          </div>
          <div className="ticketConversionContainer">
            <Paper
              elevation={3}
              sx={{
                width: "100%",
                height: 430,
              }}
            >
              {/* <div className='chatContainer'> chatInformation</div>
              <div className='statusContainer'>StatusContainer</div> */}
              <h4 style={{ marginLeft: "10px" }}>Chats</h4>
              <div style={{ width: "90%", margin: "auto" }}>
                <ChatContainer
                  ticket_id={id}
                  parents_id={parents_id}
                  teacher_id={teacher_id}
                  sender={decodeToken.result.admin_id}
                  receiver={admin_id}
                  currenUser={decodeToken.result.admin_id}
                  role={decodeToken.result.role}
                />
              </div>
            </Paper>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TicketDetails;
