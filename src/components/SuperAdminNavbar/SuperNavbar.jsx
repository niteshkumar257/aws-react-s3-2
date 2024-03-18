import React from "react";
import "./SuperNavbar.scss";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import logo from "../../assest/Img1.png";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const logoutHandler = (e) => {
    e.preventDefault();
    localStorage.removeItem("auth_token");
    localStorage.removeItem("superadmin_school");
    localStorage.clear();

    navigate("/");
  };
  return (
    <div className="navbar gradient curve-box">
      <div className="wrapper">
        <div className="logo">
          <img src={logo} alt="image"></img>
          <span>Gw Techies</span>
        </div>
        <div className="section">
          <div className="search">
            <input type="text" placeholder="search.."></input>
            <div className="search-icon">
              <SearchOutlinedIcon className="searchIcon" />
            </div>
          </div>
          <div className="navbar-items">
            <div className="navbar-items-item">
              <button className="btn" onClick={logoutHandler}>
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
