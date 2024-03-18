import React, { useState, useEffect } from "react";
import "./GeneralNotification.scss";
import {
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  OutlinedInput,
  Select,
  TextField,
} from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import DataGridWithToolTrip from "../../components/DataGrid/DataGridWithToolTrip";
import { GW_URL, classes as AllClasses, adminConfig } from "../../config";
import jwt_decode from "jwt-decode";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import Loader from "../../components/Loader/Loader";
import { useQuery } from "@tanstack/react-query";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const GeneralNotification = () => {
  const [classes, setClasses] = useState([]);
  const [classs, setClasss] = useState([]);
  const [classIds, setclassIds] = useState([]);
  const [message, setMessage] = useState("");
  const [rows, setRows] = useState([]);
  const [loaderOpen, setLoaderOpen] = useState(false);
  let decodeToken = jwt_decode(localStorage.getItem("auth_token"));
  let school_id =
    localStorage.getItem("superadmin_school") === null
      ? decodeToken.result.school_id
      : localStorage.getItem("superadmin_school");

  const {
    data: classesList,
    isLoading: classesListLoading,
    isError: classesListError,
  } = useQuery({
    queryKey: ["class-list", school_id],
    queryFn: () => {
      return axios.get(
        `${GW_URL}/schools/${school_id}/getClassId`,
        adminConfig
      );
    },
  });
  useEffect(() => {
    if (!classesListLoading) {
      let allClasses = [];
      for (let i = 0; i < classesList?.data?.class_id.length; i++) {
        const datas = {
          class_name: classesList?.data?.class_name[i],
          class_id: classesList?.data?.class_id[i],
        };
        allClasses.push(datas);
      }
      setClasses(allClasses);
    }
    if (classesListError) {
      console.log(classesListError);
    }
  }, [classesList]);

  const fetchGeneralNotification = () => {
    axios
      .get(`${GW_URL}/schools/${school_id}/getGeneralNotification`, adminConfig)
      .then((res) => {
        let allRows = [];
        for (let i = 0; i < res?.data?.allNotification?.length; i++) {
          let createdStartDate = new Date(
            res?.data?.allNotification[i]?.created_on
          );
          let day = 60 * 60 * 6 * 1000 - 60 * 60 * 0.5 * 1000;
          let createdDate = new Date(createdStartDate.getTime() + day);
          let allClass = res?.data?.allNotification[i].class_ids.map(
            (a) => AllClasses.filter((c) => c.class_id == a)[0].class_name
          );
          allRows.push({
            id: i + 1,
            message: res.data.allNotification[i].messages,
            class_id: allClass,
            created_on: createdDate.toJSON().slice(0, 10),
          });
        }
        setRows(allRows);
      })
      .catch((err) => {
        console.log(err);
        toast.error("Couldn't fetch the general notification");
      });
  };

  useEffect(() => {
    fetchGeneralNotification();
  }, []);

  const addGeneralNotification = (e) => {
    e.preventDefault();
    if (classIds.length == 0) {
      toast.error("Class is required!", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }
    if (message.trim() == "" || message.length > 100) {
      toast.error("Message length should be in between 1 to 100!", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      return;
    }
    setLoaderOpen(true);
    axios
      .post(
        `${GW_URL}/schools/${school_id}/pushGeneralNotification`,
        {
          class_id: classIds,
          message,
        },
        adminConfig
      )
      .then((res) => {
        setLoaderOpen(false);
        toast.success(res.data.message, {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
        fetchGeneralNotification();
        setClasss([]);
        setclassIds([]);
        setMessage("");
      })
      .catch(() => {
        setLoaderOpen(false);
        toast.error("Something went wrong!", {
          position: "top-center",
          autoClose: 1000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
        });
      });
  };

  const handleClassChange = (event) => {
    const {
      target: { value },
    } = event;

    let duplicateRemoved = [];
    let dataIds = [];
    value.forEach((item) => {
      if (
        duplicateRemoved.findIndex((o) => o.class_id === item.class_id) >= 0
      ) {
        duplicateRemoved = duplicateRemoved.filter(
          (x) => x.class_id === item.class_id
        );
      } else {
        duplicateRemoved.push(item);
      }
    });

    duplicateRemoved.forEach((item) => {
      dataIds.push(item.class_id);
    });
    dataIds.sort();
    setclassIds(dataIds);
    setClasss(duplicateRemoved);
  };

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
      field: "class_id",
      headerName: "Class",
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

  return (
    <>
      <div className="general-notification-meeting-container">
        <div className="general-notification-meeting-container-heading">
          <span>General Notification</span>
        </div>
        <div className="general-notification-meeting-container-body">
          <div className="general-notification-meeting-container-form">
            <form noValidate onSubmit={addGeneralNotification}>
              <div className="general-notification-details-container">
                <div className="general-notification-details-student-container">
                  <div className="general-notification-details-student-container-subheading">
                    <span>Notification Details</span>
                  </div>
                  <div className="general-notification-details-student-container-textfield">
                    {/* row one */}
                    <div className="teachers-info-section ">
                      <FormControl fullWidth sx={{ m: 0 }}>
                        <InputLabel id="demo-multiple-checkbox-label">
                          Class
                        </InputLabel>
                        <Select
                          labelId="demo-multiple-checkbox-label"
                          id="demo-multiple-checkbox"
                          multiple
                          value={classs}
                          onChange={handleClassChange}
                          input={<OutlinedInput label="Tag" />}
                          renderValue={(selected) =>
                            selected.map((x) => x.class_name).join(", ")
                          }
                          MenuProps={MenuProps}
                        >
                          {classes?.map((variant) => (
                            <MenuItem key={variant.class_id} value={variant}>
                              <Checkbox
                                checked={
                                  classs?.findIndex(
                                    (item) => item.class_id === variant.class_id
                                  ) >= 0
                                }
                              />
                              <ListItemText primary={variant.class_name} />
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                      <TextField
                        name="message"
                        label="Message"
                        helperText="Enter Message"
                        value={message}
                        sx={{ marginTop: "0px" }}
                        onChange={(e) => setMessage(e.target.value)}
                        fullWidth
                        margin="normal"
                      />
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
          <div className="general-notification-meeting-container-table">
            <DataGridWithToolTrip
              rows={rows}
              columns={columns}
              emptyRowsMessage={"No meetings are scheduled"}
            />
          </div>
        </div>
        <ToastContainer />
        <Loader open={loaderOpen} />
      </div>
    </>
  );
};

export default GeneralNotification;
