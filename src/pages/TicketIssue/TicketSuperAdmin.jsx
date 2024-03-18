import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import "./TicketSuperAdmin.scss";
import useFetchParentsTickets from "../../hooks/useFetchParentsTickets";
import DataTable from "../../components/DataTable/DataTable";
import { useNavigate } from "react-router-dom";
import { MenuItem, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers";
import useFetchAllSchool from "../../hooks/useFetchAllSchool";
import useFetchTeachersTickets from "../../hooks/useFetchTeacherTicket";
import FormDialog from "./DialogformSuperAdmin";
import Loader from "../../components/Loader/Loader";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  GW_URL,
  superAdminCanNotAccessTicketCategory,
  superAdminConfig,
  ParentsTicketColumn,
  teacherTicketColumns,
} from "../../config";
import axios from "axios";

const allStatus = [
  {
    status_id: 1,
    status_name: "Pending at admin",
  },
  {
    status_id: 2,
    status_name: "Pending for Approval",
  },
  {
    status_id: 3,
    status_name: "Resolved",
  },
];

const TicketSuperAdmin = () => {
  const navigate = useNavigate();

  // for parents ticket
  const [dataRows, setDataRows] = useState([]);
  const [status, setStatus] = useState(1);
  const [schoolId, setSchoolId] = useState(undefined);
  const [createdOn, setCreatedOn] = useState();

  // for teacher ticket
  const [teacherDataRows, setTeacherDataRows] = useState([]);
  const [teacherStatusSelected, setTeacherStatusSelected] = useState(1);
  const [teacherSchoolIdSelected, setTeacherSchoolIdSelected] =
    useState(undefined);
  const [teacherCreatedOnSelected, setteacherCreatedOnSelected] = useState();

  const { isLoading, data } = useFetchParentsTickets(
    status,
    createdOn,
    schoolId
  );
  const { isLoading: teacherDataLoading, data: teacherData } =
    useFetchTeachersTickets(
      teacherStatusSelected,
      teacherCreatedOnSelected,
      teacherSchoolIdSelected
    );
  const { isLoading: schoolLoading, data: schoolData } = useFetchAllSchool();

  // dialog container
  const [actionDialog, setActionDialog] = useState(false);
  const [details, setDetails] = useState("");
  const [requestMessage, setRequestMessage] = useState("");
  const [loaderOpen, setLoaderOpen] = useState(false);
  const [adminChat, setAdminChat] = useState("");
  const [isView, setIsView] = useState(false);

  // for parents ticket

  useEffect(() => {
    if (!isLoading) {
      let allData = [];
      for (let i = 0; i < data?.data?.tickerInfo.length; i++) {
        let startDate = new Date(data.data.tickerInfo[i].created_on);
        let day = 60 * 60 * 6 * 1000 - 60 * 60 * 0.5 * 1000;
        let createdDate = new Date(startDate.getTime() + day);

        allData.push({
          ...data.data.tickerInfo[i],
          created_on: createdDate.toJSON().slice(0, 10),
        });
      }
      setDataRows(allData);
    }
  }, [data, isLoading]);

  // set teacher ticket
  useEffect(() => {
    if (!teacherDataLoading) {
      let allData = [];

      for (let i = 0; i < teacherData?.data?.tickerInfo.length; i++) {
        let startDate = new Date(teacherData.data.tickerInfo[i].created_on);
        let day = 60 * 60 * 6 * 1000 - 60 * 60 * 0.5 * 1000;
        let createdDate = new Date(startDate.getTime() + day);
        allData.push({
          ...teacherData.data.tickerInfo[i],
          created_on: createdDate.toJSON().slice(0, 10),
        });
      }
      setTeacherDataRows(allData);
    }
  }, [teacherData, teacherDataLoading]);

  // const handleSelect = (data) => {
  //   let { id, school_id, school_name, father_name, parents_id, title, description, created_on, status, admin_id } = data;
  //   navigate(`/ticketDetails/${id}/${school_id}/${school_name}/${father_name}/${parents_id}/${title}/${description}/${created_on}/${status}/${admin_id}`);
  // }

  const viewColumn = [
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      editable: false,
      sortable: false,
      align: "center",
      headerAlign: "center",
      flex: 1,
      disableFilter: true,
      renderCell: (params) => {
        const { status } = params.row;

        // Check if the status is equal to 1 or 4
        if (status === 1 || status === 3 || status === 4) {
          return (
            <div className="viewButton">
              <button
                style={{ marginRight: "5px" }}
                onClick={() => actionDialogHandler(params.row, true)}
              >
                View
              </button>
            </div>
          );
        }

        return (
          <div className="viewButton">
            <button
              onClick={() => actionDialogHandler(params.row, false)}
              style={{ marginRight: "5px", textDecorationLine: "none" }}
            >
              Action
            </button>
          </div>
        );
      },
    },
  ];
  const actionDialogHandler = (value, flag) => {
    const { parents_id, teacher_id, admin_id, id } = value;
    setActionDialog(true);
    setDetails(value);

    setIsView(flag);

    axios
      .get(
        `${GW_URL}/issueMessages/${id}/${1}/${admin_id}/${parents_id}/${teacher_id}`,
        superAdminConfig
      )
      .then((res) => {
        setAdminChat(res.data.allMessages);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleResolve = () => {
    const { parents_id, teacher_id, id, admin_id } = details;
    if (requestMessage != "") {
      setActionDialog(false);
      setLoaderOpen(true);
      if (teacher_id != undefined) {
        axios
          .put(
            `${GW_URL}/ticket/${id}/approveOrRejectRequest?teacher_id=${teacher_id}&admin_id=${admin_id}&superadmin_id=${1}&resolve=true&revoke=false`,
            {
              message: requestMessage,
            },
            superAdminConfig
          )
          .then((res) => {
            setLoaderOpen(false);
            setRequestMessage("");
            toast.success("Issue Resolve Succesfully", {
              position: "top-center",
              autoClose: 2000,

              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
          })
          .catch((err) => {
            console.log(err);
            setLoaderOpen(false);
            setRequestMessage("");
            toast.error("Something went wrong", {
              position: "top-center",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
          });
      } else {
        axios
          .put(
            `${GW_URL}/ticket/${id}/approveOrRejectRequest?parent_id=${parents_id}&admin_id=${admin_id}&superadmin_id=${1}&resolve=true&revoke=false`,
            {
              message: requestMessage,
            },
            superAdminConfig
          )
          .then((res) => {
            setLoaderOpen(false);

            setRequestMessage("");
            toast.success("Issue Resolve Succesfully", {
              position: "top-center",
              autoClose: 2000,

              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
          })
          .catch((err) => {
            console.log(err);
            setRequestMessage("");
            setLoaderOpen(false);
            toast.error("Something went wrong", {
              position: "top-center",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
          });
      }
    } else {
      toast.error("Message is rquired ", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };
  const handleRevoke = () => {
    setActionDialog(false);
    const { parents_id, teacher_id, id, admin_id } = details;
    if (requestMessage != "") {
      setActionDialog(false);
      setLoaderOpen(true);
      if (teacher_id != undefined) {
        const url = `${GW_URL}/ticket/${id}/approveOrRejectRequest?teacher_id=${teacher_id}&admin_id=${admin_id}&superadmin_id=${1}&revoke=true`;
        axios
          .put(
            url,
            {
              message: requestMessage,
            },
            superAdminConfig
          )
          .then((res) => {
            setLoaderOpen(false);

            toast.success("Revoked", {
              position: "top-center",
              autoClose: 2000,

              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
          })
          .catch((err) => {
            console.log(err);
            setLoaderOpen(false);
            toast.error("Something went wrong", {
              position: "top-center",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
          });
      } else {
        const url1 = `${GW_URL}/ticket/${id}/approveOrRejectRequest?parent_id=${parents_id}&admin_id=${admin_id}&superadmin_id=${1}&revoke=true`;
        axios
          .put(
            url1,
            {
              message: requestMessage,
            },
            superAdminConfig
          )
          .then((res) => {
            setLoaderOpen(false);
            toast.success("Revoked", {
              position: "top-center",
              autoClose: 2000,

              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
          })
          .catch((err) => {
            console.log(err);
            setLoaderOpen(false);
            toast.error("Something went wrong", {
              position: "top-center",
              autoClose: 2000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
            });
          });
      }
    } else {
      toast.error("Message is rquired ", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };
  return (
    <div className="ticketSuperAdmin-container ">
      <Sidebar />
      <div className="ticketSuperAdmin">
        <Navbar />
        {/* <div className='ticketSuperAdmin-page page-container'> */}
        <div style={{ marginLeft: "10px" }}>
          <h3>Parents Tickets</h3>
          <div className="filter-box">
            <TextField
              value={schoolId || ""}
              style={{ marginBottom: "10px", width: "33%", marginRight: "1em" }}
              select
              label="School"
              required
              onChange={(e) => setSchoolId(e.target.value)}
            >
              {!schoolLoading &&
                schoolData?.data?.allSchool.length > 0 &&
                schoolData?.data?.allSchool
                  .filter(
                    (option) =>
                      !superAdminCanNotAccessTicketCategory.includes(
                        option.category_id
                      )
                  )
                  .map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.school_name}
                    </MenuItem>
                  ))}
            </TextField>

            <TextField
              value={status}
              style={{ marginBottom: "10px", width: "33%", marginRight: "1em" }}
              select
              label="Status"
              required
              onChange={(e) => setStatus(e.target.value)}
            >
              {allStatus.map((option) => (
                <MenuItem key={option.status_id} value={option.status_id}>
                  {option.status_name}
                </MenuItem>
              ))}
            </TextField>

            <DatePicker
              variant="outlined"
              type="date"
              format="DD/MM/YYYY"
              disableFuture
              value={createdOn}
              onChange={(e) => setCreatedOn(e)}
            />
          </div>
          <DataTable
            rows={dataRows}
            columns={ParentsTicketColumn.concat(viewColumn)}
            emptyRowsMessage={"There is no ticket pending"}
            loader={isLoading}
          />
        </div>

        <div style={{ marginLeft: "10px" }}>
          <h3>Teacher Tickets</h3>
          <div className="filter-box">
            <TextField
              value={teacherSchoolIdSelected}
              style={{ marginBottom: "10px", width: "33%", marginRight: "1em" }}
              select
              label="School"
              required
              onChange={(e) => setTeacherSchoolIdSelected(e.target.value)}
            >
              {!schoolLoading &&
                schoolData?.data?.allSchool.length > 0 &&
                schoolData?.data?.allSchool
                  .filter(
                    (option) =>
                      !superAdminCanNotAccessTicketCategory.includes(
                        option.category_id
                      )
                  )
                  .map((option) => (
                    <MenuItem key={option.id} value={option.id}>
                      {option.school_name}
                    </MenuItem>
                  ))}
            </TextField>

            <TextField
              value={teacherStatusSelected}
              style={{ marginBottom: "10px", width: "33%", marginRight: "1em" }}
              select
              label="Status"
              required
              onChange={(e) => setTeacherStatusSelected(e.target.value)}
            >
              {allStatus.map((option) => (
                <MenuItem key={option.status_id} value={option.status_id}>
                  {option.status_name}
                </MenuItem>
              ))}
            </TextField>

            <DatePicker
              variant="outlined"
              type="date"
              format="DD/MM/YYYY"
              disableFuture
              value={teacherCreatedOnSelected}
              onChange={(e) => setteacherCreatedOnSelected(e)}
            />
          </div>
          <DataTable
            rows={teacherDataRows}
            columns={teacherTicketColumns.concat(viewColumn)}
            emptyRowsMessage={"There is no ticket pending"}
            loader={teacherDataLoading}
          />
        </div>
        <Loader open={loaderOpen} />
        <ToastContainer />
      </div>
      {actionDialog && (
        <FormDialog
          value={details}
          open={actionDialog}
          setActionDialog={setActionDialog}
          handleRevoke={handleRevoke}
          handleResolve={handleResolve}
          requestMessage={requestMessage}
          setRequestMessage={setRequestMessage}
          adminChat={adminChat}
          isView={isView}
        />
      )}
    </div>
  );
};

export default TicketSuperAdmin;
