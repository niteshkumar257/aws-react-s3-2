import React from "react";
import "./Navbar.scss";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";

const Navbar = (props) => {
  return (
    <div className="navbar gradient curve-box">
      <div className="wrapper">
        {/* <div className='search'>
            <input type='text' placeholder='search..'></input>
            <div className='search-icon'>
            <SearchOutlinedIcon className='searchIcon'/>
            </div>
         </div> */}
        <div className="navbar-items">
          <div className="navbar-items-item">
            <span>
              {props.adminName &&
                "Hi, " +
                  props.adminName
                    .replace(/_/g, " ")
                    .replace(/(^\w{1})|(\s+\w{1})/g, (letter) =>
                      letter.toUpperCase()
                    )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
