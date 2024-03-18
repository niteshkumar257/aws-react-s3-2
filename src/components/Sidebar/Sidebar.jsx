import React from "react";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import logo from "../../assest/Img1.png";
import { Link, NavLink, useNavigate } from "react-router-dom";
import SchoolOutlinedIcon from "@mui/icons-material/SchoolOutlined";
import DashboardOutlinedIcon from "@mui/icons-material/DashboardOutlined";
import GradeOutlinedIcon from "@mui/icons-material/GradeOutlined";
import LogoutIcon from "@mui/icons-material/Logout";
import { FaChalkboardTeacher } from "react-icons/fa";
import MenuIcon from "@mui/icons-material/Menu";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import "./Sidebar.scss";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import ArticleIcon from "@mui/icons-material/Article";
import { useState, useEffect } from "react";
import jwt_decode from "jwt-decode";
import Person4Icon from "@mui/icons-material/Person4";
import DvrIcon from "@mui/icons-material/Dvr";
import VideoCameraFrontIcon from "@mui/icons-material/VideoCameraFront";
import FeedbackIcon from "@mui/icons-material/Feedback";
import LocalActivitySharpIcon from "@mui/icons-material/LocalActivitySharp";
import CardMembershipIcon from "@mui/icons-material/CardMembership";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import ClassIcon from "@mui/icons-material/Class";
import TaskIcon from "@mui/icons-material/Task";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import HolidayVillageIcon from "@mui/icons-material/HolidayVillage";
import AssignmentReturnedIcon from "@mui/icons-material/AssignmentReturned";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import VpnKeyIcon from "@mui/icons-material/VpnKey";
import { getAdminDetails } from "../../config";
import { getAllRoutes } from "../../config";

// all routes for admin
const allAdminMenuItem = [
  {
    id: 1,
    path: "/dashBoard",
    name: "Dashboard",
    icon: <DashboardOutlinedIcon className="icon" />,
  },
  {
    id: 2,
    path: "/Student",
    name: "Students",
    icon: <SchoolOutlinedIcon className="icon" />,
  },
  {
    id: 3,
    path: "/Grade",
    name: "Marks",
    icon: <GradeOutlinedIcon className="icon" />,
  },
  {
    id: 4,
    path: "/Teachers",
    name: "Teachers",
    icon: <FaChalkboardTeacher />,
  },
  {
    id: 5,
    path: "/AddStudent",
    name: "New Student",
    icon: <AddCircleOutlineOutlinedIcon className="icon" />,
  },
  {
    id: 11,
    path: "/addTest",
    name: "Add Test",
    icon: <NoteAltIcon className="icon" />,
  },
  // {
  //   id: 6,
  //   path: "/notification",
  //   name: "Notification",
  //   icon: <NotificationsNoneIcon className="icon" />,
  // },

  {
    id: 12,
    path: "/classTeacher",
    name: "Class Teacher",
    icon: <ClassIcon className="icon" />,
  },

  // {
  //   id: 13,
  //   path: "/AddCurriculum",
  //   name: "Timetable",
  //   icon: <ArticleIcon className="icon" />,
  // },

  {
    id: 7,
    path: "/attendance",
    name: "Attendance",
    icon: <DvrIcon className="icon" />,
  },
  {
    id: 8,
    path: "/ticketAdmin",
    name: "Tickets",
    icon: <ConfirmationNumberIcon className="icon" />,
  },
  {
    id: 9,
    path: "/FeedbackAdmin",
    name: "Tasks",
    icon: <TaskIcon className="icon" />,
  },
  // {
  //   id: 10,
  //   path: "/Certificate",
  //   name: "Certificate",
  //   icon: <CardMembershipIcon className="icon" />,
  // },
  // {
  //   id: 11,
  //   path: "/PTMDetails",
  //   name: "PTMDetails",
  //   icon: <NoteAddIcon className="icon" />,
  // },
  {
    id: 12,

    path: "/AddHoliday",
    name: "Holiday",
    icon: <HolidayVillageIcon className="icon" />,
  },
];

// all routes for superAdmin
const allSuperAdminMenuItem = [
  {
    id: 1,
    path: "/AddSchool",
    name: "Add School",
    icon: <AddCircleOutlineOutlinedIcon className="icon" />,
  },
  {
    id: 3,
    path: "/Mentor",
    name: "Mentor",
    icon: <Person4Icon className="icon" />,
  },
  {
    id: 4,
    path: "/ticketSuperAdmin",
    name: "Ticket",
    icon: <ConfirmationNumberIcon className="icon" />,
  },
  {
    id: 5,
    path: "/FeedbackSuperAdmin",
    name: "Tasks",
    icon: <TaskIcon className="icon" />,
  },
  {
    id: 6,
    path: "/AddHoliday",
    name: "Holiday",
    icon: <HolidayVillageIcon className="icon" />,
  },
  {
    id: 7,
    path: "/Videos",
    name: "Videos",
    icon: <VideoCameraFrontIcon className="icon" />,
  },
  {
    id: 8,
    path: "/TeacherTask",
    name: "Teacher Task",
    icon: <AssignmentReturnedIcon className="icon" />,
  },
  {
    id: 9,
    path: "/getTeacherLoginDetails",
    name: "Teacher Login",
    icon: <VpnKeyIcon className="icon" />,
  },
  {
    id: 10,
    path: "/getAdminLoginDetails",
    name: "Admin Login",
    icon: <VpnKeyIcon className="icon" />,
  },
];

// all routes for adminOnly like ticketIssue and feedback of admin
const adminOnlyMenuItem = [
  {
    id: 8,
    path: "/ticketAdmin",
    name: "Tickets",
    icon: <ConfirmationNumberIcon className="icon" />,
  },
  {
    id: 9,
    path: "/FeedbackAdmin",
    name: "Tasks",
    icon: <TaskIcon className="icon" />,
  },
];

const Sidebar = (props) => {
  const [menuItem, setMenuItem] = useState([]);
  const { decodeToken, school_id, category_id } = getAdminDetails();

  useEffect(() => {
    // if admin
    if (decodeToken.result.role == "ADMIN") {
      setMenuItem(getAllRoutes(category_id, allAdminMenuItem));
    }
    // if superadmin
    else if (decodeToken.result.role == "SUPER_ADMIN" && school_id == 0) {
      setMenuItem(allSuperAdminMenuItem);
    }
    // if superadmin inside admin portal
    else {
      let adminRoutes = getAllRoutes(category_id, allAdminMenuItem);
      let routes = adminRoutes.filter(
        (item) =>
          !adminOnlyMenuItem.some((adminItem) => adminItem.id === item.id)
      );

      setMenuItem(routes);
    }
  }, []);

  const [isExpanded, setExpendState] = useState(true);
  const [user, setUser] = useState(false);
  const navigate = useNavigate();

  const logoutHandler = (e) => {
    e.preventDefault();
    localStorage.removeItem("auth_token");
    localStorage.clear();
    navigate("/");
  };

  const HomepageNavigator = (e) => {
    navigate("/superAdmin");
    localStorage.removeItem("superadmin_school"); // remove the superadmin_school value
    localStorage.removeItem("superadmin_school_category"); // remove the superadmin_school_category
  };

  return (
    <>
      <div className={isExpanded ? "sidebar " : "sidebar sidebar-toggle"}>
        <div className="sidebar-container">
          <div className="logo-container">
            {isExpanded && (
              <div className="logo-container-heading">
                <img className="logo-gw" src={logo}></img>
                <span className="title">GAANV Wala</span>
              </div>
            )}
            <div>
              <MenuIcon
                className="menu-icon"
                onClick={() => setExpendState(!isExpanded)}
              />
            </div>
          </div>
          <div className="menuItems-container">
            <div className="menu-item">
              {/* home route  */}
              {decodeToken.result.role == "SUPER_ADMIN" && (
                <NavLink
                  onClick={HomepageNavigator}
                  to="/superAdmin"
                  className="items"
                  activeclassname="active"
                  style={{
                    textDecoration: "none",
                    color: "black",
                  }}
                >
                  <div className={isExpanded ? "item" : "item-toggle"}>
                    <div className="icon">
                      <HomeOutlinedIcon />
                    </div>
                    {isExpanded && <span className="link-text">Home</span>}
                  </div>
                </NavLink>
              )}

              {menuItem.map((item, index) => (
                <NavLink
                  key={index}
                  activeClassName="active"
                  className="items"
                  style={{ textDecoration: "none", color: "black" }}
                  to={item.path}
                >
                  <div className={isExpanded ? "item" : "item-toggle"}>
                    <div className="icon">{item.icon}</div>
                    {isExpanded && (
                      <span className="link-text">{item.name}</span>
                    )}
                  </div>
                </NavLink>
              ))}

              {/* logout handler  */}
              {menuItem.length > 0 && (
                <NavLink
                  className="items"
                  activeclassname="active"
                  style={{
                    textDecoration: "none",
                    color: "black",
                  }}
                  to="/"
                  onClick={logoutHandler}
                >
                  <div className={isExpanded ? "item" : "item-toggle"}>
                    <div className="icon">
                      <LogoutIcon />
                    </div>
                    {isExpanded && <span className="link-text">Logout</span>}
                  </div>
                </NavLink>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
