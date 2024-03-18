import React, { useEffect } from "react";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DataTable from "../../components/SuperAdminTable/SuperAdminTable";
import {
  GW_URL,
  formatTimeToDDMMYYYY,
  getIndianDate,
  superAdminConfig,
} from "../../config";

import useFetchAllPromotionalVideo, {
  ALL_PROMOTIONAL_VIDEOS_KEY,
} from "../../hooks/useFetchAllPromotionalVideo";
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
    field: "video_name",
    flex: 1,
    headerName: "Video Title",
    width: 200,
    editable: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "updated_at",
    headerName: "Updated At",
    width: 200,
    headerAlign: "center",
    align: "center",
    editable: true,
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

const addVideoFunc = async ({ video_name, video_url }) => {
  return await axios.post(
    `${GW_URL}/videos/AddPromotionalVideo`,
    {
      video_name,
      video_url,
    },
    superAdminConfig
  );
};

const AddPromotionalVideo = (props) => {
  const [formData, setFormData] = useState({
    VideoName: "",
    VideoUrl: "",
  });
  const [rows, setRows] = useState([]);
  const [isExpanded, setExpanded] = useState(false);
  const { isLoading, isError, data } = useFetchAllPromotionalVideo();
  const [openLoader, setOpenLoader] = useState(false);
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: addVideoFunc,
    onSuccess: () => {
      setOpenLoader(false);
      queryClient.invalidateQueries({ queryKey: [ALL_PROMOTIONAL_VIDEOS_KEY] });
      toast.success("Video added successfully", {
        theme: "dark",
      });
      setFormData({
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
      toast.error(
        err.response?.data?.error
          ? err.response?.data?.error
          : "Something went wrong in fetching!",
        {
          theme: "dark",
        }
      );
      return;
    }
    if (!isLoading) {
      let allRows = [];
      for (let i = 0; i < data.data.allVideos.length; i++) {
        const date = getIndianDate(data.data.allVideos[i].updated_at);
        allRows.push({
          id: i + 1,
          updated_at: date,
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

  const AddPromotionalVideoSubmitHandler = (e) => {
    e.preventDefault();
    if (formData.VideoName == "") {
      toast.error("Video Title is required!", {
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
          <span>Add Promotional Vidoes</span>
        </div>
        <form noValidate onSubmit={AddPromotionalVideoSubmitHandler}>
          <div className="teachers-info-detail-container">
            <div className="teachers-info-detail-student-container">
              <div className="teachers-info-detail-student-container-subheading">
                <span>Video Details</span>
              </div>
              <div className="teachers-info-detail-student-container-textfield">
                {/* row one */}
                <div className="teachers-info-section ">
                  <TextField
                    fullWidth
                    name="VideoName"
                    value={formData.VideoName}
                    onChange={handleDataChange}
                    variant="outlined"
                    helperText="Add video title."
                    label="Video title"
                    required
                  />
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

export default AddPromotionalVideo;
