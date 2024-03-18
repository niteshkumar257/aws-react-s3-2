import { useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import "./DashBoard.scss";
import Dashboard from "../../components/Dashboard/Dash";

import jwt_decode from "jwt-decode";
import axios from "axios";

import { useEffect } from 'react'
import { GW_URL } from '../../config'
const DashBoard = (props) => {
  let decodeToken = jwt_decode(localStorage.getItem("auth_token")); 
  const [adminName,setAdminName]=useState("");
  const adminNamehandler=(name)=>
  {
     setAdminName(name);
     props.AdminNameHandler(name);
  }
  const [isExpanded,setExpanded]=useState(false);
  const isExpandedHandler=(value)=>setExpanded(value);

  return (
    <div className="dashboard-container ">
      <Sidebar isExpandedHandler={isExpandedHandler} />
      <div className="dashboard">
        <Navbar adminName={adminName} />
        <div className="dashboard-page ">
          <Dashboard AdminNameHandler={adminNamehandler} />
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
