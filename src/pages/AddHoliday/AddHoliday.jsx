import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "./AddHoliday.scss";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import Loader from "../../components/Loader/Loader";
import { DatePicker } from "@mui/x-date-pickers";
import { TextField, MenuItem } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { GW_URL, superAdminConfig } from "../../config";
import useFetchAllHoliday, {
  ALL_HOLIDAY_KEY,
} from "../../hooks/useFetchAllHoliday";
import DataGridWithToolTrip from "../../components/DataGrid/DataGridWithToolTrip";
import axios from "axios";
import useFetchAllSchool from "../../hooks/useFetchAllSchool";
import { getAdminDetails } from "../../config";

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
    field: "school_name",
    headerName: "School Name",
    width: 50,
    flex: 1,
    editable: false,
    headerAlign: "left",
    align: "left",
  },
  {
    field: "start_date",
    headerName: "Start Date",
    width: 50,
    flex: 1,
    editable: false,
    headerAlign: "left",
    align: "left",
  },
  {
    field: "end_date",
    headerName: "End Date",
    width: 50,
    flex: 1,
    editable: false,
    headerAlign: "left",
    align: "left",
  },
  {
    field: "purpose",
    flex: 1,
    headerName: "Purpose",
    width: 200,
    editable: false,
    headerAlign: "left",
    align: "left",
  },
];

const addHolidayList = ({ school_id, start_date, end_date, purpose }) => {
  return axios.post(
    `${GW_URL}/addHoliday`,
    {
      school_id,

      start_date,
      end_date,
      purpose,
    },
    superAdminConfig
  );
};

const AddHoliday = () => {
  const { decodeToken, school_id, category_id } = getAdminDetails();
  const [schoolId, setSchoolId] = useState(school_id === 0 ? "" : school_id);

  const [formData, setFormData] = useState({
    startDate:null,
    endDate: null,
    purpose: "",
  });
  const [openLoader, setOpenLoader] = useState(false);
  const [rows, setRows] = useState([]);

  const date = new Date();

  const { isLoading: schoolLoading, data: schoolData } = useFetchAllSchool();
  const { data, isLoading } = useFetchAllHoliday(schoolId);

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: addHolidayList,
    onSuccess: () => {
      setOpenLoader(false);
      queryClient.invalidateQueries(ALL_HOLIDAY_KEY);
      toast.success("Holiday added successfully", {
        position: "top-center",
        autoClose: 1000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      setFormData({
        startDate:null,
        endDate: null,
        purpose: "",
      });

      setSchoolId("");
    },
    onError: () => {
      setOpenLoader(false);
      toast.error("Something went wrong!", {
        theme: "dark",
      });
    },
  });

  useEffect(() => {
    if (!isLoading) {
      let allHoliday = [];
      for (let i = 0; i < data.length; i++) {
        // convert to indian date
        let selected_start_date = new Date(data[i].start_date);
        let selected_end_date = new Date(data[i].end_date);
        let start_date = new Date(
          selected_start_date.getTime() +
            60 * 60 * 6 * 1000 -
            60 * 60 * 0.5 * 1000
        );
        let end_date = new Date(
          selected_end_date.getTime() +
            60 * 60 * 6 * 1000 -
            60 * 60 * 0.5 * 1000
        );
        allHoliday.push({
          id: i + 1,
          start_date: start_date.toJSON().slice(0, 10),
          end_date: end_date.toJSON().slice(0, 10),
          purpose: data[i].purpose,

          school_name: data[i].school_name,
        });
      }
      setRows(allHoliday);
    }
  }, [data]);

  const holidayHandler = (e) => {
    e.preventDefault();
    if (formData.startDate == "") {
      toast.error("Start Date is Required", {
        theme: "dark",
      });
      return;
    }
    if (formData.endDate == "") {
      toast.error("End Date is Required", {
        theme: "dark",
      });
      return;
    }
    if (formData.startDate > formData.endDate) {
      toast.error("Start Date must be before the End Date", {
        theme: "dark",
      });
      return;
    }
    if (formData.purpose == "") {
      toast.error("Purpose is Required", {
        theme: "dark",
      });

      return;
    }

    mutation.mutate({
      school_id: schoolId,

      start_date: formData.startDate,
      end_date: formData.endDate,
      purpose: formData.purpose,
    });
  };

  const handleSchoolIdChange = (e, name) => {
    setSchoolId(e);
  };

  const handleDateChange = (e, name) => {
    setFormData((prev) => ({ ...prev, [name]: e }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="Holiday-container">
      <Sidebar />
      <div className="Holidays">
        <Navbar adminName={"SuperAdmin"} />
        <div className="Holiday-page page-container">
          <div className="Holiday-page-container">
            <div className="Holiday-page-container-heading">
              <span>
                {school_id === 0 || category_id === 1
                  ? "Add Holiday"
                  : "Holidays"}
              </span>
            </div>
            {(school_id === 0 || category_id === 1) && (
              <form noValidate onSubmit={holidayHandler}>
                <div className="Holiday-info-detail-container">
                  <div className="Holiday-info-detail-student-container">
                    <div className="Holiday-info-detail-student-container-subheading">
                      <span>Holiday Details</span>
                    </div>
                    <div className="Holiday-info-detail-student-container-textfield">
                      {school_id === 0 && (
                        <TextField
                          value={schoolId}
                          style={{
                            marginBottom: "10px",
                            width: "98%",
                            marginLeft: "0.4rem",
                          }}
                          select
                          label="School"
                          required
                          onChange={(e) =>
                            handleSchoolIdChange(e.target.value, "schoolId")
                          }
                        >
                          {!schoolLoading &&
                            schoolData?.data?.allSchool.length > 0 &&
                            schoolData?.data?.allSchool.map((option) => (
                              <MenuItem key={option.id} value={option.id}>
                                {option.school_name}
                              </MenuItem>
                            ))}
                        </TextField>
                      )}

                      <div className="Holiday-info-section ">
                        <DatePicker
                          name="startDate"
                          value={formData.startDate}
                          sx={{ flex: 1 }}
                          format="DD/MM/YYYY"
                          type="date"
                          disablePast
                          required
                          slotProps={{
                            textField: {
                              helperText: "Enter the start Date",
                            },
                          }}
                          onChange={(e) => handleDateChange(e, "startDate")}
                        />
                        <DatePicker
                          name="endDate"
                          value={formData.endDate}
                          sx={{ flex: 1 }}
                          format="DD/MM/YYYY"
                          type="date"
                          required
                          disablePast
                          slotProps={{
                            textField: {
                              helperText: "Enter the end Date",
                            },
                          }}
                          onChange={(e) => handleDateChange(e, "endDate")}
                        />
                        <TextField
                          name="purpose"
                          value={formData.purpose}
                          sx={{ flex: 1 }}
                          type="text"
                          label="Purpose"
                          helperText="Enter Purpose"
                          required
                          onChange={handleChange}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="buttonSubmit">
                    {" "}
                    <button>Add</button>{" "}
                  </div>
                </div>
              </form>
            )}
          </div>
          <DataGridWithToolTrip
            rows={rows}
            columns={columns}
            loader={isLoading}
            emptyRowsMessage={"No Holidays"}
          />
        </div>
      </div>
      <ToastContainer />
      <Loader open={openLoader} />
    </div>
  );
};

export default AddHoliday;
