import React, { useEffect } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import { useState } from "react";
import axios from "axios";
import jwt_decode from "jwt-decode";
import MenuItem from "@mui/material/MenuItem";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useFetchNotifications from "../../hooks/useFetchNotifications";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import "./Notifications.scss";
import DataGridWithTooltip from "../../components/DataGrid/DataGridWithToolTrip";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { ALL_NOTIFICATION_FETCH_KEY } from "../../hooks/useFetchNotifications";
import ParentsTeacher from "./ParentsTeacher";
import { GW_URL, adminConfig } from "../../config";
import Loader from "../../components/Loader/Loader";
import Details from "./Details";
import GeneralNotification from "./GeneralNotification";
import dayjs from "dayjs";

const CapitaLizeFirstLetter = (arr) => {
  const modifiedArray = arr.map((item) => {
    const modifiedItem = {
      ...item,
      parent_name: capitalizeFirstLetter(item.parent_name),
      message: capitalizeFirstLetterOnly(item.message),
    };
    return modifiedItem;
  });
  return modifiedArray;
};

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
function capitalizeFirstLetterOnly(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const columns = [
  {
    field: "id",
    headerName: "S No.",
    width: 50,
    flex: 1,
    editable: false,
    headerAlign: "left",
    align: "left",
  },
  {
    field: "parent_name",
    headerName: "Parent Name",
    width: 50,
    flex: 1,
    editable: false,
    headerAlign: "left",
    align: "left",
  },
  {
    field: "message",
    flex: 1,
    headerName: "Message",
    width: 200,
    editable: false,
    headerAlign: "left",
    align: "left",
    renderCell: (params) => <Details value={params.value} />,
  },
  {
    field: "created_on",
    headerName: "Created On",
    width: 50,
    flex: 1,
    editable: false,
    headerAlign: "left",
    align: "left",
  },
];

const installementNos = [
  {
    id: 1,
    installment_no: 1,
  },
  {
    id: 2,
    installment_no: 2,
  },
  {
    id: 3,
    installment_no: 3,
  },
];
const addNotification = ({ installemtNo, school_id }) => {
  return axios.post(
    `${GW_URL}/schools/${school_id}/pushNotification`,
    {
      installment_no: installemtNo,
    },
    adminConfig
  );
};
const Notification = (props) => {
  const [rows, setRows] = useState([]);
  const [isExpanded, setExpanded] = useState(false);
  const [installemtNo, setInstallmentNo] = useState("");
  const [openLoader, setOpenLoader] = useState(false);
  let decodeToken = jwt_decode(localStorage.getItem("auth_token"));
  let school_id =
    localStorage.getItem("superadmin_school") === null
      ? decodeToken.result.school_id
      : localStorage.getItem("superadmin_school");

  // get notification list from by fetching
  const { isLoading, isError, data, error } = useFetchNotifications(school_id);
  useEffect(() => {
    if (isError) {
      console.log(error);
    }
    if (!isLoading) {
      let day = 60 * 60 * 6 * 1000 - 60 * 60 * 0.5 * 1000;
      let i = 0;
      const transformedData = data?.data?.notifications.map((notification) => ({
        ...notification,
        id: ++i,
        created_on: dayjs(
          new Date(new Date(notification.created_on).getTime() + day)
        )
          .toJSON()
          .slice(0, 10)
          .split("-")
          .reverse()
          .join("-"),
      }));

      setRows(CapitaLizeFirstLetter(transformedData));
    }
  }, [data]);

  // post request to push notification to the list
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: addNotification,
    onSuccess: () => {
      setOpenLoader(false);
      queryClient.invalidateQueries(ALL_NOTIFICATION_FETCH_KEY);
      toast.success("Notification  pushed  successfully", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });

      setInstallmentNo("");
    },
    onError: () => {
      toast.error("Something went wrong!", {
        theme: "dark",
      });
    },
    isLoading: () => {
      alert("adfb");
      return "..Loading";
    },
  });

  // store the state when the state is changed
  const NotificationHandler = async (e) => {
    e.preventDefault();

    if (installemtNo == "") {
      toast.error("Please select installment no.", {
        theme: "dark",
      });
      return;
    }
    setOpenLoader(true);
    mutation.mutate({ installemtNo, school_id });
  };

  const handleInstallmentChange = (e) => {
    setInstallmentNo(e.target.value);
  };

  return (
    <div className="teachers-container ">
      <Sidebar />
      <div className="teachers">
        <Navbar adminName={props.AdminName} />
        <div className="teachers-page page-container">
          <div className="teacherForm-page-container">
            <div className="teacherForm-page-container-heading">
              {/* header container */}
              <span>Push Notification</span>
            </div>
            <form noValidate onSubmit={NotificationHandler}>
              <div className="teachers-info-detail-container">
                <div className="teachers-info-detail-student-container">
                  <div className="teachers-info-detail-student-container-subheading">
                    <span>Installment Details</span>
                  </div>
                  <div className="teachers-info-detail-student-container-textfield">
                    {/* row one */}
                    <div className="teachers-info-section ">
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                          Installment No
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={installemtNo}
                          label="Installment No."
                          onChange={handleInstallmentChange}
                        >
                          {installementNos?.map((val) => {
                            return (
                              <MenuItem value={val.id}>
                                {val.installment_no}
                              </MenuItem>
                            );
                          })}
                        </Select>
                      </FormControl>
                    </div>
                  </div>
                </div>
                <div className="buttonSubmit">
                  {" "}
                  <button>Push</button>{" "}
                </div>
              </div>
            </form>
          </div>
          <DataGridWithTooltip
            rows={rows}
            columns={columns}
            loader={isLoading}
            emptyRowsMessage={"No Notification"}
          />
          <div className="parent-teacher-contain">
            <ParentsTeacher />
          </div>
          <div className="parent-teacher-contain">
            <GeneralNotification />
          </div>
        </div>
      </div>
      <ToastContainer />
      <Loader open={openLoader} />
    </div>
  );
};

export default Notification;
