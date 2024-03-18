import React, { useEffect } from "react";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import MenuItem from "@mui/material/MenuItem";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DataTable from "../../components/SuperAdminTable/SuperAdminTable";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { GW_URL, subjects, classes, superAdminConfig } from "../../config";

// import useFetchAllVideos, { ALL_VIDEOS_KEY } from '../../hooks/useFetchAllVideos';
import useFetchAllTrainingVideo, {
  ALL_TRAINING_VIDEOS_KEY,
} from "../../hooks/useFetchAllTrainingVideo";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Loader from "../../components/Loader/Loader";

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

const columns = [
  { field: "id", headerName: "", width: 0, hide: true },
  {
    field: "subject",
    headerName: "Subject",
    width: 50,
    flex: 1,
    editable: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "video_name",
    flex: 1,
    headerName: "Video Title",
    width: 200,
    editable: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "video_url",
    headerName: "",
    width: 0,
    headerAlign: "center",
    align: "center",
    editable: true,
    hide: true,
  },
];

const addVideoFunc = async ({ subject_id, video_name, video_url }) => {
  return await axios.post(
    `${GW_URL}/videos/${subject_id}/addTrainingVideo`,
    {
      video_name,
      video_url,
    },
    superAdminConfig
  );
};

const AddTrainingVideo = (props) => {
  const allSubjects = [
    ...subjects,
    {
      subject_id: 15,
      subject_name: "ALL",
    },
  ];
  const [formData, setFormData] = useState({
    Subject: {},
    VideoName: "",
    VideoUrl: "",
  });
  const [rows, setRows] = useState([]);
  const [isExpanded, setExpanded] = useState(false);
  const { isLoading, isError, data } = useFetchAllTrainingVideo();
  const [openLoader, setOpenLoader] = useState(false);
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: addVideoFunc,
    onSuccess: () => {
      setOpenLoader(false);
      queryClient.invalidateQueries({ queryKey: [ALL_TRAINING_VIDEOS_KEY] });
      toast.success("Video added successfully", {
        theme: "dark",
      });
      setFormData({
        Subject: {},
        VideoName: "",
        VideoUrl: "",
      });
    },
    onError: (err) => {
      setOpenLoader(false);
      toast.error(
        err.response?.data?.error
          ? err.response?.data?.error
          : "Something went wrong",
        {
          theme: "dark",
        }
      );
    },
  });

  useEffect(() => {
    if (isError) {
      console.log(isError);
    }
    if (!isLoading) {
      let allRows = [];
      for (let i = 0; i < data.data.allVideos.length; i++) {
        allRows.push({
          id: i,
          subject: data.data.allVideos[i].subject_name,
          class: data.data.allVideos[i].class_name,
          video_name: data.data.allVideos[i].video_name,
          video_url: data.data.allVideos[i].video_url,
        });
      }
      setRows(allRows);
    }
  }, [data]);

  const isExpandedHandler = (value) => {
    setExpanded(value);
  };

  const AddTrainingVideoSubmitHandler = (e) => {
    e.preventDefault();
    if (formData.Subject.subject_id == undefined) {
      toast.error("Subject name is required!", {
        theme: "dark",
      });
      return;
    }
    if (formData.VideoName == "") {
      toast.error("Video Title is required!", {
        theme: "dark",
      });
      return;
    }
    if (!formData.VideoName.includes("#")) {
      toast.error("Video title should be in the format given below!", {
        theme: "dark",
      });
      return;
    }
    if (formData.VideoUrl == "") {
      toast.error("Video url is required!", {
        theme: "dark",
      });
      return;
    }
    setOpenLoader(true);
    mutation.mutate({
      subject_id: formData.Subject.subject_id,
      video_name: formData.VideoName,
      video_url: formData.VideoUrl,
    });
  };

  const handleViewSelect = (url) => {
    window.open(url, "_blank").focus();
  };

  const handleDataChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const viewColumn = [
    {
      field: "view",
      headerName: "View Video",
      width: 200,
      sortable: false,
      editable: false,
      flex: 1,
      headerAlign: "center",
      align: "center",
      renderCell: (params) => {
        return (
          <div className="viewButton" style={{ marginLeft: "0" }}>
            <button
              className="btn"
              style={{ margin: "auto" }}
              onClick={() => handleViewSelect(params.row.video_url)}
            >
              View
            </button>
          </div>
        );
      },
    },
  ];
  return (
    <div className="teachers-page page-container">
      <div className="teacherForm-page-container">
        <div className="teacherForm-page-container-heading">
          {/* header container */}
          <span>Add Tranning Vidoes</span>
        </div>
        <form noValidate onSubmit={AddTrainingVideoSubmitHandler}>
          <div className="teachers-info-detail-container">
            <div className="teachers-info-detail-student-container">
              <div className="teachers-info-detail-student-container-subheading">
                <span>Video Details</span>
              </div>
              <div className="teachers-info-detail-student-container-textfield">
                {/* row one */}
                <div className="teachers-info-section ">
                  <FormControl fullWidth>
                    <InputLabel id="demo-simple-select-label">
                      Subject
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-label"
                      id="demo-simple-select"
                      name="Subject"
                      defaultValue={""}
                      value={
                        formData.Subject.subject_id
                          ? formData.Subject
                          : undefined
                      }
                      label="Subject"
                      helperText="Add Subject name"
                      onChange={handleDataChange}
                      renderValue={(selected) =>
                        formData.Subject.subject_id
                          ? selected.subject_name
                          : undefined
                      }
                    >
                      {allSubjects?.map((val) => {
                        return (
                          <MenuItem
                            value={{
                              subject_name: val.subject_name,
                              subject_id: val.subject_id,
                            }}
                          >
                            {val.subject_name}
                          </MenuItem>
                        );
                      })}
                    </Select>
                  </FormControl>
                  <TextField
                    fullWidth
                    name="VideoName"
                    value={formData.VideoName}
                    onChange={handleDataChange}
                    variant="outlined"
                    helperText="Add video title with sequence number separated by #. Ex - photosynthesis # 01"
                    label="Video title"
                    required
                  />
                  {/*  */}
                </div>

                <div className="teachers-info-section ">
                  <TextField
                    fullWidth
                    name="VideoUrl"
                    value={formData.VideoUrl}
                    onChange={handleDataChange}
                    variant="outlined"
                    helperText="Add video link"
                    label="Video Link"
                    required
                  />
                </div>
              </div>
            </div>
            <div className="buttonSubmit">
              {" "}
              <button>Submit</button>{" "}
            </div>
          </div>
        </form>
      </div>
      <DataTable
        rows={rows}
        columns={columns.concat(viewColumn)}
        loader={isLoading}
        emptyRowsMessage={"No Trainig Videos"}
      />
      <ToastContainer />
      <Loader open={openLoader} />
    </div>
  );
};

export default AddTrainingVideo;
