
export const GW_URL = 'https://api.gaanvwala.com/api';
// export const GW_URL = "http://localhost:8080/api";


import moment from "moment-timezone";
import jwt_decode from "jwt-decode";

export const getIndianDate = (givenDate) => {
  let originalDate = moment(givenDate).tz("Asia/Kolkata").format("DD-MM-YYYY");
  return originalDate;
};

export const formatTimeToDDMMYYYY = (givenDate) => {
  let formatedDate = moment(givenDate).format("DD-MM-YYYY");
  return formatedDate;
};

export const ADMIN = "ADMIN";
export const SUPER_ADMIN = "SUPER_ADMIN";

export const superAdminConfig = {
  headers: {
    Authorization: "Bearer " + localStorage.getItem("auth_token"),
    User: SUPER_ADMIN,
  },
};

export const adminConfig = {
  headers: {
    Authorization: "Bearer " + localStorage.getItem("auth_token"),
    User: ADMIN,
  },
};

export const getAdminDetails = () => {
  const decodeToken = jwt_decode(localStorage.getItem("auth_token"));
  const school_id =
    localStorage.getItem("superadmin_school") === null
      ? decodeToken.result.school_id
      : localStorage.getItem("superadmin_school");
  const category_id =
    localStorage.getItem("superadmin_school_category") === null
      ? decodeToken.result.category_id
      : localStorage.getItem("superadmin_school_category");
  return { decodeToken, school_id, category_id };
};

export const isEmail = (input) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(input);
};

const currentDate = new Date();
export const currentMonth = currentDate.getMonth();
export const currentYear = currentDate.getFullYear();
export const validateEmail = (email) => {
  const gmailPattern = /^[a-zA-Z0-9]+(\.[a-zA-Z0-9]+)*@gmail\.com$/;
  return gmailPattern.test(email);
};
export const Modalstyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  height: "auto",
  bgcolor: "background.paper",
  border: "none",
  display: "flex",
  flexDirection: "column",
  rowGap: "30px",
  borderRadius: 3,
  boxShadow: "0 2px 4px rgb(0 0 0 / 4%), 0 4px 8px rgb(0 0 0 / 4%)",
  backdropFilter: "blur(5px)",
  p: 4,
};
export const sortMessage = (allmessage) => {
  const sortedMessages = allmessage.sort((a, b) => {
    const dateA = new Date(a.created_at);
    const dateB = new Date(b.created_at);
    return dateA - dateB;
  });
  return sortedMessages;
};
export const ChangeDateFormat = (arr) => {
  const modifiedArray = arr.map((item) => {
    let startDate = new Date(item.created_on);
    let day = 60 * 60 * 6 * 1000 - 60 * 60 * 0.5 * 1000;
    let createdDate = new Date(startDate.getTime() + day);

    return { ...item, created_on: createdDate.toJSON().slice(0, 10) };
  });
  return modifiedArray;
};

export const formatTime = (dateTime) => {
  const dateObject = new Date(dateTime);
  const options = { hour: "numeric", minute: "numeric", hour12: true };
  return dateObject.toLocaleTimeString(undefined, options);
};

export const dateToString = (dateStr) => {
  const date = new Date(dateStr);
  const day = date.getDate();
  const month = date.toLocaleString("default", { month: "long" });
  const year = date.getFullYear();

  const formattedDate = `${day}th ${month} ${year}`;
  return formattedDate;
};
// Output: "26th June 2023"
export const genderArray = [
  {
    value: "Male",
    label: "Male",
  },
  {
    value: "Female",
    label: "Female",
  },
  {
    value: "Not-disclose",
    label: "Not-disclose",
  },
  {
    value: "Binary",
    label: "Binary",
  },
];
export const mediums = [
  {
    medium_id: 1,
    medium_name: "English",
  },
  {
    medium_id: 2,
    medium_name: "Hindi",
  },
];

export const allStreams = [
  {
    value: "Science",
    label: "Science",
  },
  {
    value: "Commerce",
    label: "Commerce",
  },
  {
    value: "Arts",
    label: "Arts",
  },
];

export const courses = [
  {
    course_id: 1,
    course_name: "PRE-FOUNDATION",
  },
  {
    course_id: 2,
    course_name: "SCHOOLING",
  },
  {
    course_id: 3,
    course_name: "JEE",
  },
  {
    course_id: 4,
    course_name: "NEET",
  },
];

export const Board = [
  {
    board_id: 1,
    board_name: "CBSE",
  },
  {
    board_id: 2,
    board_name: "ICSE",
  },
  {
    board_id: 3,
    board_name: "STATE BOARD",
  },
];

export const classes = [
  {
    class_id: -3,
    class_name: "Nursery",
  },
  {
    class_id: -2,
    class_name: "KG-1",
  },
  {
    class_id: -1,
    class_name: "KG-2",
  },
  {
    class_id: 1,
    class_name: "1",
  },
  {
    class_id: 2,
    class_name: "2",
  },
  {
    class_id: 3,
    class_name: "3",
  },
  {
    class_id: 4,
    class_name: "4",
  },
  {
    class_id: 5,
    class_name: "5",
  },
  {
    class_id: 6,
    class_name: "6",
  },
  {
    class_id: 7,
    class_name: "7",
  },
  {
    class_id: 8,
    class_name: "8",
  },
  {
    class_id: 9,
    class_name: "9",
  },
  {
    class_id: 10,
    class_name: "10",
  },
  {
    class_id: 11,
    class_name: "11",
  },
  {
    class_id: 12,
    class_name: "12",
  },
  {
    class_id:18,
    class_name:'11-Arts'
  },
  {
    class_id:19,
    class_name:'11-Science'
  },
  {
    class_id:20,
    class_name:'11-Agri'
  },
  {
    class_id:21,
    class_name:'12-Arts'
  },
  {
    class_id:22,
    class_name:'12-Science'
  },
  {
    class_id:23,
    class_name:'12-Agri'
  },
];

export const sections = [
  {
    section_id: 1,
    section_name: "A",
  },
  {
    section_id: 2,
    section_name: "B",
  },
];
export const subjectJson = {
  1: "Physics",
  2: "Chemistry",
  3: "Math",
  4: "Biology",
  5: "Hindi",
  6: "English",
  7: "SST",
  8: "Sanskrit",
  9: "Mental Ability",
  10: "Spoken English",
  11: "Arts-History",
  12: "Commerce",
  13: "Agriculture",
  14: "EVS",
  16: "Arts-Political",
  17: "Arts-Geography",
  18: "Arts-Drawing",
  19: "Arts-Urdu",
  20: "Agriculture-Bio",
  21: "Agriculture-Chemistry",
  22: "Arts-English Lit.",
  23: "Arts-Hindi Lit.",
  24: "Computer",
  25: "GK",
};
export const subjects = [
  {
    subject_id: 1,
    subject_name: "Physics",
  },
  {
    subject_id: 2,
    subject_name: "Chemistry",
  },
  {
    subject_id: 3,
    subject_name: "Math",
  },
  {
    subject_id: 4,
    subject_name: "Biology",
  },
  {
    subject_id: 5,
    subject_name: "Hindi",
  },
  {
    subject_id: 6,
    subject_name: "English",
  },
  {
    subject_id: 7,
    subject_name: "SST",
  },
  {
    subject_id: 8,
    subject_name: "Sanskrit",
  },
  {
    subject_id: 9,
    subject_name: "Mental Ability",
  },
  {
    subject_id: 10,
    subject_name: "Spoken English",
  },
  {
    subject_id: 24,
    subject_name: "Computer",
  },
  {
    subject_id: 25,
    subject_name: "GK",
  },
  {
    subject_id: 11,
    subject_name: "Arts-History",
  },
  {
    subject_id: 16,
    subject_name: "Arts-Political",
  },
  {
    subject_id: 17,
    subject_name: "Arts-Geography",
  },
  {
    subject_id: 18,
    subject_name: "Arts-Drawing",
  },
  {
    subject_id: 19,
    subject_name: "Arts-Urdu",
  },
  {
    subject_id: 22,
    subject_name: "Arts-English Lit.",
  },
  {
    subject_id: 23,
    subject_name: "Arts-Hindi Lit.",
  },
  {
    subject_id: 12,
    subject_name: "Commerce",
  },
  {
    subject_id: 13,
    subject_name: "Agriculture",
  },
  {
    subject_id: 20,
    subject_name: "Agriculture-Bio",
  },
  {
    subject_id: 21,
    subject_name: "Agriculture-Chemistry",
  },
  {
    subject_id: 14,
    subject_name: "EVS",
  },
];
export const subjectIdMap = {};
subjects.forEach((subject) => {
  subjectIdMap[subject.subject_id] = subject.subject_name;
});

export const months = [
  {
    month_id: 1,
    month_name: "Jan",
  },
  {
    month_id: 2,
    month_name: "Feb",
  },
  {
    month_id: 3,
    month_name: "Mar",
  },
  {
    month_id: 4,
    month_name: "April",
  },
  {
    month_id: 5,
    month_name: "May",
  },
  {
    month_id: 6,
    month_name: "June",
  },
  {
    month_id: 7,
    month_name: "July",
  },
  {
    month_id: 8,
    month_name: "Aug",
  },
  {
    month_id: 9,
    month_name: "Sep",
  },
  {
    month_id: 10,
    month_name: "Oct",
  },
  {
    month_id: 11,
    month_name: "Nov",
  },
  {
    month_id: 12,
    month_name: "Dec",
  },
];
export const studentLevel = [
  {
    field: "id",
    headerName: "S No",
    width: 150,
    flex: 1,
    headerAlign: "left",
    align: "left",
    flex: 1,
    sortable: false,
  },
  {
    field: "class_id",
    flex: 1,
    headerName: "ClassId",
    width: 150,
    editable: false,
    headerAlign: "left",
    align: "left",
    sortable: false,
    hide: true,
  },
  {
    field: "subject_id",
    headerName: "Subject",
    width: 150,
    flex: 1,
    editable: false,
    headerAlign: "left",
    align: "left",
    sortable: false,
  },
  {
    field: "student_name",
    headerName: "Student Name",
    width: 150,
    flex: 1,
    editable: false,
    headerAlign: "left",
    align: "left",
    sortable: false,
  },
  {
    field: "student_id",
    headerName: "Student",
    width: 150,
    flex: 1,
    editable: false,
    headerAlign: "left",
    align: "left",
    sortable: false,
    hide: true,
  },
  {
    field: "month1",
    headerName: "Selected Month",
    type: "date",
    width: 150,
    flex: 1,
    editable: false,
    headerAlign: "left",
    sortable: false,
    align: "left",
    hide: true,
  },
  {
    field: "level1",
    headerName: "Selected Month Level",

    width: 150,
    flex: 1,
    editable: false,
    headerAlign: "left",
    sortable: false,
    align: "left",
  },
  {
    field: "month2",
    headerName: "Current Month Level",
    type: "date",
    width: 150,
    flex: 1,
    editable: false,
    headerAlign: "left",
    sortable: false,
    align: "left",
    hide: true,
  },

  {
    field: "level2",
    headerName: "Curent-Level",

    width: 150,
    flex: 1,
    editable: false,
    headerAlign: "left",
    sortable: false,
    align: "left",
    renderCell: (params) => (
      <div
        style={{
          backgroundColor: params.value.color,
          width: 100,
          height: 40,
          borderRadius: 50,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <span style={{ color: "white", fontWeight: 500 }}>
          {" "}
          {params.value.value}
        </span>
      </div>
    ),
  },
];
export const StudentInstallMentTable = [
  {
    field: "id",
    headerName: "Installment No",
    width: 150,
    flex: 1,
    headerAlign: "left",
    align: "left",
    flex: 1,
    sortable: false,
  },
  {
    field: "amount",
    flex: 1,
    headerName: "Amount",
    width: 150,
    editable: false,
    headerAlign: "left",
    align: "left",
    sortable: false,
  },
  {
    field: "lastDate",
    headerName: "Last Date",
    width: 150,
    flex: 1,
    editable: false,
    headerAlign: "left",
    align: "left",
    sortable: false,
  },
  {
    field: "status",
    headerName: "Status",
    type: "date",
    width: 150,
    flex: 1,
    editable: false,
    headerAlign: "left",
    sortable: false,
    align: "left",
  },
];
export const AdminIssue = [
  {
    field: "id",
    headerName: "TicketId",
    headerAlign: "TicketId",
    hide: true,
    flex: 1,
    editable: false,
    align: "left",
    headerAlign: "left",
  },

  {
    field: "school_id",
    headerName: "SchoolId",
    flex: 1,
    editable: false,
    headerAlign: "left",
    align: "left",
    hide: true,
  },
  {
    field: "school_name",
    headerName: "school_name",
    hide: true,
    editable: true,
    flex: 1,
    editable: false,
    headerAlign: "left",
    align: "left",
  },
  {
    field: "parents_id",
    headerName: "Parent",
    flex: 1,
    editable: false,
    headerAlign: "left",
    align: "left",
    hide: true,
  },
  {
    field: "father_name",
    headerName: "Parent name",
    flex: 1,
    editable: false,
    headerAlign: "left",
    align: "left",
  },
  {
    field: "title",
    headerName: "Title",
    flex: 1,
    editable: false,
    headerAlign: "left",
    align: "left",
  },
  {
    field: "description",
    headerName: "Details",
    flex: 2,
    hide: true,
    editable: false,
    headerAlign: "left",
    align: "left",
  },
  {
    field: "created_on",
    headerName: "Created Date",
    flex: 1,
    editable: false,
    headerAlign: "left",
    align: "left",
  },
  {
    field: "status",
    headerName: "Status",
    flex: 1,
    editable: false,
    headerAlign: "left",
    align: "left",
    renderCell: (params) => {
      let statusColor = "";
      let statusText = "";

      switch (params.row.status) {
        case 1:
          statusColor = params.row.isrevoke ? "red" : "orange";
          statusText = params.row.isrevoke ? "Revoked" : "Pending";
          break;
        case 2:
          statusColor = "orange";
          statusText = "Pending At SuperAdmin";
          break;
        case 3:
          statusColor = "lightgreen";
          statusText = "Resolved";
          break;
        case 4:
          statusColor = "red";
          statusText = "Revoke";
          break;
        default:
          statusColor = "";
          break;
      }

      return (
        <div
          style={{
            backgroundColor: statusColor,
            color: "white",
            padding: "4px 8px",
            borderRadius: "4px",
            fontSize: 15,
          }}
        >
          {statusText}
        </div>
      );
    },
  },
  {
    field: "isrevoke",
    headerName: "Created_On",
    flex: 1,
    editable: false,
    headerAlign: "left",
    align: "left",
    hide: true,
  },
  // {
  //   field: "statusLabel",
  //   headerName: "Status",
  //   flex: 1,
  //   editable: false,
  //   headerAlign: "left",
  //   align: "left",
  //   renderCell: (params) => {
  //     let statusColor = "";

  //     switch (params.row.status) {
  //       case 1:
  //         statusColor = "orange";
  //         break;
  //       case 2:
  //         statusColor = "orange";
  //         break;
  //       case 3:
  //         statusColor = "lightgreen";
  //         break;
  //       case 4:
  //         statusColor = "red";
  //         break;b
  //       default:
  //         statusColor = "";
  //         break;
  //     }

  //     return (
  //       <div
  //         style={{
  //           backgroundColor: statusColor,
  //           color: "white",
  //           padding: "4px 8px",
  //           borderRadius: "4px",
  //         }}
  //       >
  //         {params.value}
  //       </div>
  //     );
  //   },
  // },
];

export const AdminIssueTwo = [
  {
    field: "id",
    headerName: "TicketId",
    headerAlign: "TicketId",
    flex: 1,
    editable: false,
    align: "left",
    headerAlign: "left",
    hide: true,
  },

  {
    field: "school_id",
    headerName: "SchoolId",
    flex: 1,
    editable: false,
    headerAlign: "left",
    align: "left",
    hide: true,
  },
  {
    field: "school_name",
    headerName: "school_name",
    hide: true,
    editable: true,
    flex: 1,
    editable: false,
    headerAlign: "left",
    align: "left",
  },
  {
    field: "teacher_id",
    headerName: "Parent",
    flex: 1,
    editable: false,
    headerAlign: "left",
    align: "left",
    hide: true,
  },
  {
    field: "teacher_name",
    headerName: "Teacher Name",
    flex: 1,
    editable: false,
    headerAlign: "left",
    align: "left",
  },
  {
    field: "title",
    headerName: "Title",
    flex: 1,
    editable: false,
    headerAlign: "left",
    align: "left",
  },
  {
    field: "description",
    headerName: "Details",
    flex: 2,
    editable: false,
    headerAlign: "left",
    align: "left",
    hide: true,
  },
  {
    field: "created_on",
    headerName: "Created Date",
    flex: 1,
    editable: false,
    headerAlign: "left",
    align: "left",
  },
  {
    field: "status",
    headerName: "Status",
    flex: 1,
    editable: false,
    headerAlign: "left",
    align: "left",
    renderCell: (params) => {
      let statusColor = "";
      let statusText = "";

      switch (params.row.status) {
        case 1:
          statusColor = params.row.isrevoke ? "red" : "orange";
          statusText = params.row.isrevoke ? "Revoked" : "Pending";
          break;
        case 2:
          statusColor = "orange";
          statusText = "Pending At SuperAdmin";
          break;
        case 3:
          statusColor = "lightgreen";
          statusText = "Resolved";
          break;
        case 4:
          statusColor = "red";
          statusText = "Revoke";
          break;
        default:
          statusColor = "";
          break;
      }

      return (
        <div
          style={{
            backgroundColor: statusColor,
            color: "white",
            padding: "4px 8px",
            borderRadius: "4px",
            fontSize: 15,
          }}
        >
          {statusText}
        </div>
      );
    },
  },
  {
    field: "isrevoke",
    headerName: "Created_On",
    flex: 1,
    editable: false,
    headerAlign: "left",
    align: "left",
    hide: true,
  },
  // {
  //   field: "statusLabel",
  //   headerName: "Status",
  //   flex: 1,
  //   editable: false,
  //   headerAlign: "left",
  //   align: "left",
  //   renderCell: (params) => {
  //     let statusColor = "";

  //     switch (params.row.status) {
  //       case 1:
  //         statusColor = "orange";
  //         break;
  //       case 2:
  //         statusColor = "orange";
  //         break;
  //       case 3:
  //         statusColor = "lightgreen";
  //         break;
  //       case 4:
  //         statusColor = "red";
  //         break;
  //       default:
  //         statusColor = "";
  //         break;
  //     }

  //     return (
  //       <div
  //         style={{
  //           backgroundColor: statusColor,
  //           color: "white",
  //           padding: "4px 8px",
  //           borderRadius: "4px",
  //         }}
  //       >
  //         {params.value}
  //       </div>
  //     );
  //   },
  // },
];

export const dummyData = [
  {
    id: 1,
    status: 1,
    ticket_id: 123456,
    school_id: 789,
    school_name: "Example School",
    parent_id: 987654,
    father_name: "John Doe",
    title: "Issue Title 1",
    description: "This is a dummy issue description 1.",
    created_on: "2023-06-24 10:00:00",
  },
  {
    id: 2,
    status: 4,
    ticket_id: 789012,
    school_id: 345,
    school_name: "Another School",
    parent_id: 654321,
    father_name: "Jane Smith",
    title: "Issue Title 2",
    description: "This is a dummy issue description 2.",
    created_on: "2023-06-25 15:30:00",
  },
  {
    id: 3,
    status: 3,
    ticket_id: 567890,
    school_id: 123,
    school_name: "Third School",
    parent_id: 456789,
    father_name: "Bob Johnson",
    title: "Issue Title 3",
    description: "This is a dummy issue description 3.",
    created_on: "2023-06-26 08:45:00",
  },
  {
    id: 4,
    status: 2,
    ticket_id: 901234,
    school_id: 678,
    school_name: "Fourth School",
    parent_id: 123456,
    father_name: "Alice Davis",
    title: "Issue Title 4",
    description: "This is a dummy issue description 4.",
    created_on: "2023-06-27 12:15:00",
  },
  {
    id: 5,
    status: 2,
    ticket_id: 345678,
    school_id: 901,
    school_name: "Fifth School",
    parent_id: 234567,
    father_name: "Emily Wilson",
    title: "Issue Title 5",
    description: "This is a dummy issue description 5.",
    created_on: "2023-06-28 17:20:00",
  },
  // Add more dummy data entries if needed...
];
export const updatedData = dummyData.map((data) => {
  let statusLabel = "";
  switch (data.status) {
    case 1:
      statusLabel = "Pending";
      break;
    case 2:
      statusLabel = "Approval Request";
      break;
    case 3:
      statusLabel = "Resolved";
      break;
    case 4:
      statusLabel = "Revoked";
      break;
    default:
      statusLabel = "";
      break;
  }
  return { ...data, statusLabel };
});
export const dummyDatatwo = [
  {
    id: 1,
    status: 1,
    ticket_id: 123456,
    school_id: 789,
    school_name: "Example School",
    teacher_id: 987654,
    teacher_name: "John Doe",
    title: "Issue Title 1",
    description: "This is a dummy issue description 1.",
    created_on: "2023-06-24 10:00:00",
  },
  {
    id: 2,
    status: 2,
    ticket_id: 789012,
    school_id: 345,
    teacher_name: "Another School",
    teacher_id: 654321,
    teacher_name: "Jane Smith",
    title: "Issue Title 2",
    description: "This is a dummy issue description 2.",
    created_on: "2023-06-25 15:30:00",
  },
  {
    id: 3,
    status: 3,
    ticket_id: 567890,
    school_id: 123,
    school_name: "Third School",
    teacher_id: 456789,
    teacher_name: "Bob Johnson",
    title: "Issue Title 3",
    description: "This is a dummy issue description 3.",
    created_on: "2023-06-26 08:45:00",
  },
  {
    id: 4,
    status: 4,
    ticket_id: 901234,
    school_id: 678,
    school_name: "Fourth School",
    teacher_id: 123456,
    teacher_name: "Alice Davis",
    title: "Issue Title 4",
    description: "This is a dummy issue description 4.",
    created_on: "2023-06-27 12:15:00",
  },

  // Add more dummy data entries if needed...
];

export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const allFeedbackStatus = [
  {
    status_id: 0,
    status_name: "-",
  },
  {
    status_id: 1,
    status_name: "In Progess",
  },
  {
    status_id: 2,
    status_name: "Hold",
  },
  {
    status_id: 3,
    status_name: "Completed",
  },
];

export const FeeInstallMentTable = [
  {
    field: "id",
    headerName: "Installment No",
    width: 150,
    flex: 1,
    headerAlign: "left",
    align: "left",
    flex: 1,
    sortable: false,
  },
  {
    field: "amount",
    flex: 1,
    headerName: "Amount",
    width: 150,
    editable: false,
    headerAlign: "left",
    align: "left",
    sortable: false,
  },
  {
    field: "lastDate",
    headerName: "Last Date",
    width: 150,
    flex: 1,
    editable: false,
    headerAlign: "left",
    align: "left",
    sortable: false,
  },
  {
    field: "status",
    headerName: "Status",
    type: "date",
    width: 150,
    flex: 1,
    editable: false,
    headerAlign: "left",
    sortable: false,
    align: "left",
  },
];

export const allSchoolCategory = [
  {
    category_id: 1,
    category_name: "Tech Support",
  },
  {
    category_id: 2,
    category_name: "GW Handover",
  },
  {
    category_id: 3,
    category_name: "Adv Tech Support",
  },
];

export const categoryWisePreventedRoutes = [
  {
    category_id: 1,
    preventedRoutes: ["/FeedbackAdmin"],
  },
  {
    category_id: 2,

    preventedRoutes: [],
  },
  {
    category_id: 3,
    preventedRoutes: ["/FeedbackAdmin"],

  },
];

export const getAllRoutes = (categoryId, routes) => {
  let allRoutes = [];
  if (categoryId == undefined) {
    return routes;
  }
  routes.map((route) => {
    if (
      !categoryWisePreventedRoutes[categoryId - 1].preventedRoutes.includes(
        route.path
      )
    ) {
      allRoutes.push(route);
    }
  });

  return allRoutes;
};

export const allStatusAtAdminForTicket = (category_id) => {
  let allStatus = [];
  let chatAllowed, adminAllowedToResolved;
  if (category_id == 1 || category_id == 3) {
    allStatus = [
      {
        status_id: 1,
        status_name: "Pending",
      },
      {
        status_id: 3,
        status_name: "Resolved",
      },
    ];
    chatAllowed = false;
    adminAllowedToResolved = true;
  } else if (category_id == 2) {
    allStatus = [
      {
        status_id: 1,
        status_name: "Pending",
      },
      {
        status_id: 2,
        status_name: "Pending at superadmin",
      },
      {
        status_id: 3,
        status_name: "Resolved",
      },
    ];

    chatAllowed = true;
    adminAllowedToResolved = false;
  }

  return { allStatus, chatAllowed, adminAllowedToResolved };
};

export const superAdminCanNotAccessTicketCategory = [1, 3];

export const getSelectedMonthLevel = (allStudentLevel) => {
  const instances = [];

  allStudentLevel.forEach((studentData) => {
    studentData.subject_ids.forEach((subjectId, index) => {
      instances.push({
        unique_id: `${studentData.student_id}${subjectId}`,
        student_name: studentData.student_name,
        class_id: studentData.class_id,
        student_id: studentData.student_id,
        month: studentData.month,
        subject: subjectId,
        level: studentData.levels[index],
      });
    });
  });

  const result = instances.map((entry) => ({
    id: parseInt(entry.unique_id),
    student_name: entry.student_name,
    class_id: entry.class_id,
    student_id: entry.student_id,
    month1: months.find((item) => item.month_id == entry.month).month_name,
    subject: subjects.find((subject) => subject.subject_id == entry.subject)
      .subject_name,
    level1: entry.level,
  }));
  return result;
};
export const getCurrentMonthStudentLevel = (allStudentLevel) => {
  const instances = [];

  allStudentLevel.forEach((studentData) => {
    studentData.subject_ids.forEach((subjectId, index) => {
      instances.push({
        unique_id: `${studentData.student_id}${subjectId}`,
        student_name: studentData.student_name,
        class_id: studentData.class_id,
        student_id: studentData.student_id,
        month: studentData.month,
        subject: subjectId,
        level: studentData.levels[index],
      });
    });
  });

  // Create an array of objects without the unique_id keys
  const result = instances.map((entry) => ({
    id: parseInt(entry.unique_id),
    student_name: entry.student_name,
    class_id: entry.class_id,
    student_id: entry.student_id,
    month2: months.find((month) => month.month_id == entry.month).month_name,
    subject: subjects.find((subject) => subject.subject_id == entry.subject)
      .subject_name,
    level2: entry.level,
  }));

  return result;
};

export const mergeTwoJson = (one, two) => {
  const mergedResult = [];

  one.forEach((oneItem) => {
    const matchingTwoItem = two.find((twoItem) => twoItem.id === oneItem.id);

    if (matchingTwoItem) {
      mergedResult.push({
        ...oneItem,
        ...matchingTwoItem,
      });
    }
  });

  const updatedData = mergedResult?.map((item, index) => ({
    ...item,
    id: index + 1,
    student_id: undefined,
  }));

  return updatedData;
};
export const newString = (headerName) => {
  headerName = headerName.replace(/_/g, " ");
  headerName = headerName.charAt(0).toUpperCase() + headerName.slice(1);
  return headerName;
};
export let TestTableColumn = [];
let TestTableRow = [];
const getColumnsForDifferentPeformanceTable = (subject) => {
  TestTableColumn.push({ field: "test_id" });
  TestTableColumn.push({ field: "serial_no" });
  TestTableColumn.push({ field: "test_date" });

  subject.map((item, index) => {
    let data = {};
    data.field = item.subject_name;
    TestTableColumn.push(data);
  });

  // TestTableColumn.push({field:"id"})
  TestTableColumn.push({ field: "percentage" });
  for (let i = 0; i < TestTableColumn.length; i++) {
    TestTableColumn[i].align = "left";
    TestTableColumn[i].flex = 1;
    TestTableColumn[i].sortable = false;
    TestTableColumn[i].width = "150px";
    TestTableColumn[i].hide =
      TestTableColumn[i].field === "test_id" ? true : false;
    TestTableColumn[i].headerName = newString(TestTableColumn[i].field);
    TestTableColumn[i].valueGetter = (params) =>
      params.row[TestTableColumn[i].field] || "---";
  }

  return TestTableColumn;
};
export const ParentsTicketColumn = [
  {
    field: "id",
    headerName: "S No.",
    width: 100,
    flex: 1,
    headerAlign: "center",
    align: "center",
    hide: true,
  },
  {
    field: "school_id",
    flex: 1,
    headerName: "",
    editable: false,
    headerAlign: "center",
    align: "left",
    hide: "true",
  },
  {
    field: "admin_id",
    flex: 1,
    headerName: "",
    editable: false,
    headerAlign: "left",
    align: "left",
    hide: "true",
  },
  {
    field: "school_name",
    flex: 1,
    headerName: "School Name",
    width: 150,
    editable: false,
    headerAlign: "left",
    align: "left",
  },
  {
    field: "father_name",
    flex: 1,
    headerName: "Parents Name",
    width: 150,
    editable: false,
    headerAlign: "left",
    align: "left",
  },
  {
    field: "parents_id",
    flex: 1,
    headerName: "",
    hide: "true",
    editable: false,
    headerAlign: "left",
    align: "left",
  },
  {
    field: "title",
    headerName: "Title",
    type: "text",
    width: 150,
    flex: 1,
    editable: false,
    headerAlign: "left",
    align: "leeft",
  },
  {
    field: "description",
    headerName: "Description",
    hide: "true",
    editable: false,
    width: 150,
    flex: 1,
    headerAlign: "left",
    align: "left",
  },
  {
    field: "created_on",
    headerName: "Created On",
    editable: false,
    width: 150,
    flex: 1,
    headerAlign: "left",
    align: "left",
  },
  {
    field: "status",
    headerName: "Status",
    editable: false,
    width: 150,
    flex: 1,
    headerAlign: "left",
    align: "left",
    renderCell: (params) => {
      let statusColor = "";
      let statusText = "";

      switch (params.row.status) {
        case 1:
          statusColor = params.row.isrevoke ? "red" : "orange";
          statusText = params.row.isrevoke ? "Revoked" : "Pending";
          break;
        case 2:
          statusColor = "orange";
          statusText = "Pending At SuperAdmin";
          break;
        case 3:
          statusColor = "lightgreen";
          statusText = "Resolved";
          break;
        case 4:
          statusColor = "red";
          statusText = "Revoke";
          break;
        default:
          statusColor = "";
          break;
      }

      return (
        <div
          style={{
            backgroundColor: statusColor,
            color: "white",
            padding: "4px 8px",
            borderRadius: "4px",
            display: "flex",
            fontSize: 11,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {statusText}
        </div>
      );
    },
  },
];
export const teacherTicketColumns = [
  {
    field: "id",
    headerName: "S No.",
    width: 100,
    flex: 1,
    headerAlign: "left",
    align: "left",
    hide: true,
  },
  {
    field: "school_id",
    flex: 1,
    headerName: "",
    editable: false,
    headerAlign: "left",
    align: "left",
    hide: "true",
  },
  {
    field: "admin_id",
    flex: 1,
    headerName: "",
    editable: false,
    headerAlign: "left",
    align: "center",
    hide: "left",
  },
  {
    field: "school_name",
    flex: 1,
    headerName: "School Name",
    width: 150,
    editable: false,
    headerAlign: "left",
    align: "left",
  },
  {
    field: "teacher_name",
    flex: 1,
    headerName: "Teacher Name",
    width: 150,
    editable: false,
    headerAlign: "left",
    align: "left",
  },
  {
    field: "teacher_id",
    flex: 1,
    headerName: "",
    hide: "true",
    editable: false,
    headerAlign: "left",
    align: "left",
  },
  {
    field: "title",
    headerName: "Title",
    type: "text",
    width: 150,
    flex: 1,
    editable: false,
    headerAlign: "left",
    align: "left",
  },
  {
    field: "description",
    headerName: "Description",
    hide: "true",
    editable: false,
    width: 150,
    flex: 1,
    headerAlign: "left",
    align: "left",
  },
  {
    field: "created_on",
    headerName: "Created On",
    editable: false,
    width: 150,
    flex: 1,
    headerAlign: "left",
    align: "left",
  },
  {
    field: "status",
    headerName: "Status",
    editable: false,
    width: 150,
    flex: 1,
    headerAlign: "left",
    align: "left",
    renderCell: (params) => {
      let statusColor = "";
      let statusText = "";

      switch (params.row.status) {
        case 1:
          statusColor = params.row.isrevoke ? "red" : "orange";
          statusText = params.row.isrevoke ? "Revoked" : "Pending";
          break;
        case 2:
          statusColor = "orange";
          statusText = "Pending At SuperAdmin";
          break;
        case 3:
          statusColor = "lightgreen";
          statusText = "Resolved";
          break;
        case 4:
          statusColor = "red";
          statusText = "Revoke";
          break;
        default:
          statusColor = "";
          break;
      }

      return (
        <div
          style={{
            backgroundColor: statusColor,
            color: "white",
            padding: "4px 8px",
            borderRadius: "4px",
            display: "flex",
            fontSize: 12,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {statusText}
        </div>
      );
    },
  },
];
export const StudentListColumn = [
  {
    field: "id",
    headerName: "S No.",
    flex: 1,
    headerAlign: "left",
    align: "left",
  },
  {
    field: "student_name",
    flex: 1,
    headerName: "Name",
    width: 150,
    editable: false,
    headerAlign: "left",
    align: "left",
  },
  {
    field: "class_id",
    headerName: "Class",
    type: "number",
    width: 150,
    flex: 1,
    editable: false,
    headerAlign: "left",
    align: "left",
  },
  {
    field: "medium",
    headerName: "Medium",
    editable: false,
    width: 150,
    flex: 1,
    headerAlign: "left",
    align: "left",
  },
  {
    field: "student_id",
    headerName: "StudentId",
    editable: false,
    hide: true,
    width: 150,
    flex: 1,
    headerAlign: "left",
    align: "left",
  },
  {
    field: "section",
    headerName: "Section",
    editable: false,
    width: 150,
    flex: 1,
    headerAlign: "center",
    align: "center",
  },
];

export const TestListColumn = [
  {
    field: "id",
    headerName: "S No.",
    width: 150,
    flex: 1,
    headerAlign: "left",
    align: "left",
  },
  {
    field: "test_date",
    flex: 1,
    headerName: "Date",
    width: 150,
    editable: false,
    headerAlign: "left",
    align: "left",
  },
  {
    field: "test_name",
    flex: 1,
    headerName: "Name",
    width: 150,
    editable: false,
    headerAlign: "left",
    align: "left",
  },
  {
    field: "class_name",
    headerName: "Class",
    width: 150,
    flex: 1,
    editable: false,
    headerAlign: "left",
    align: "left",
  },
  {
    field: "subject_name",
    headerName: "Subject",
    editable: false,
    width: 150,
    flex: 1,
    headerAlign: "left",
    align: "left",
  },
];

export const allSections = [
  {
    section_id: 1,
    section_name: "A",
  },
  {
    section_id: 2,
    section_name: "B",
  },
];

export const formateTimeToAm_PM = (militaryTime) => {
  console.log(militaryTime);
  if (militaryTime == null) return;
  // Split the time into hours, minutes, and seconds
  const [hours, minutes] = militaryTime.split(":").map(Number);

  // Determine whether it's AM or PM
  const period = hours < 12 ? "AM" : "PM";

  // Convert to 12-hour clock format with leading zero for minutes
  const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  let formattedTime =
    (hours % 12 || 12) + ":" + formattedMinutes + " " + period;

  return formattedTime; // Output: "3:05 PM" for "15:05"
};


export function EachTaskStatus(status_id) {
  if (status_id == 0) return "Not submitted";
  else if (status_id == 1) return "In Progress";
  else return "Completed";
}
// o : Not Started/Not Submitted
// 1 : In Progress
// 3 : Completed
export const colorHash = {
  0: "grey",
  1: "orange",
  2: "green",
  // Add more ID-color mappings as needed
};
// 0-assigment marks
// 1-demo marks
// 2-test marks
export const TeacherTTtotalMark = {
  0: 50,
  1: 30,
  2: 20,
};
export const getTaskStatus = (status) => {
  if (status === null) return "Assign";
  else if (status === "0") return "Assigned";
  else if (status === "8") return "Completed";
  else return "In Progress";
};
export const getTaskColor = (status) => {
  if (status === null) return "#FF4500";
  else if (status === "0") return "grey";
  else if (status === "8") return "#50C878";
  else return "Orange";
};

export const TT_subjectList = [1, 2, 3, 4, 7, 9];
export const containsNonDigits=(input)=> {
  return /\D/.test(input);
}

export const isValidPhoneNumber=(phoneNumber)=> {
  return /^\d{10}$/.test(phoneNumber);
}

