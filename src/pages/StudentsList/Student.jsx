import { useEffect, useState } from "react";
import "./Student.scss";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import DataTable from "../../components/DataTable/DataTable";
import Box from "@mui/material/Box";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import jwt_decode from "jwt-decode";
import useFetchAllStudent, {
  ALL_STUDENT_FETCH_KEY,
} from "../../hooks/useFetchAllStudent";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import EditStudent from "../EditStudent/EditStudent";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  GW_URL,
  adminConfig,
  validateEmail,
  StudentListColumn,

  containsNonDigits,
  isValidPhoneNumber,

} from "../../config";
import Loader from "../../components/Loader/Loader";
import CompareLevel from "./CompareLevel";

// Student List columns

const CapitalLizeFirstLetter = (arr) => {
  const modifiedArray = arr.map((item) => {
    const modifiedItem = {
      id: item.id,
      student_name: capitalizeFirstLetter(item.student_name),
      class_id: item.class_id,
      medium: item.medium,
      student_id: item.student_id,
      section: item.section,
    };
    return modifiedItem;
  });
  return modifiedArray;
};

function capitalizeFirstLetter(string) {
  if (typeof string !== "string") {
    return string; // Return the input value if it's not a string
  }
  return string.charAt(0).toUpperCase() + string.slice(1);
}
const editStudentFunc = ({
  student_name,
  gender,
  dob,
  address,
  parent_id,
  class_id,
  course_name,
  medium,
  board,
  father_name,
  father_profession,
  mother_name,
  mother_profession,
  whatsapp_no,
  alternative_mobile,
  email,
  first_installment,
  first_installment_eta,
  second_installment,
  second_installment_eta,
  third_installment,
  third_installment_eta,
  aadhar_no,
  section,
  student_id,
  pastParentNumber,
  stream,
}) => {
  return axios.put(
    `${GW_URL}/students/${student_id}?student_name=${student_name}&gender=${gender}&dob=${dob}&address=${address}&class_id=${class_id}&course_name=${course_name}&medium=${medium}&board=${board}&father_name=${father_name}&father_profession=${father_profession}&mother_name=${mother_name}&mother_profession=${mother_profession}&whatsapp_no=${whatsapp_no}&alternative_mobile=${alternative_mobile}&email=${email}&first_installment=${first_installment}&first_installment_eta=${first_installment_eta}&second_installment=${second_installment}&second_installment_eta=${second_installment_eta}&third_installment=${third_installment}&third_installment_eta=${third_installment_eta}&aadhar_no=${aadhar_no}&parent_id=${parent_id}&section=${section}&stream=${stream}`,
    { pastParentNumber },
    adminConfig
  );
};

const emptyRowsMessage = "No data available";
const Student = (props) => {
  const [selectedStudent, setSelectedStudent] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("");
  const [studentId, setStudentId] = useState(0);
  const [rows, setRows] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loaderOpen, setLoaderOpen] = useState(false);
  // const [Isloading,setIsloading]=useState(false);
  const navigate = useNavigate();
  let decodeToken = jwt_decode(localStorage.getItem("auth_token"));
  let school_id =
    localStorage.getItem("superadmin_school") === null
      ? decodeToken.result.school_id
      : localStorage.getItem("superadmin_school");
  const { isLoading, isError, data } = useFetchAllStudent(school_id);

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: editStudentFunc,
    onSuccess: () => {
      queryClient.invalidateQueries(ALL_STUDENT_FETCH_KEY);
      setLoaderOpen(false);
      toast.success("Student data updated  successfully", {
        position: "top-center",
        autoClose: 1500,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    },
    onError: () => {
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
    },
  });

  const handleLowerClass = (rows) => {
    const modifiedRows = rows.map((row) => {
      if (row.class_id === -3) {
        return { ...row, class_id: "Nursery" };
      } else if (row.class_id === -2) {
        return { ...row, class_id: "KG-1" };
      } else if (row.class_id === -1) {
        return { ...row, class_id: "KG-2" };
      } else {
        return row;
      }
    });
    return modifiedRows;
  };
  useEffect(() => {
    if (isError) {
      console.log(isError);
    }

    if (!isLoading) {
      let allStudents = [];
      for (let i = 0; i < data?.data?.allStudent.length; i++) {
        allStudents.push({
          ...data?.data?.allStudent[i],
          id: i + 1,
          student_id: data?.data?.allStudent[i].id,
          section: data?.data?.allStudent[i].section,
        });
      }
      setRows(CapitalLizeFirstLetter(handleLowerClass(allStudents)));
    }
  }, [data]);

  const handleSelect = (id) => {
    props.getStudentId(id);
    setStudentId(studentId);
    navigate(`/Student/${id}`);
  };

  const handleOpenModal = (id, class_id) => {
    setSelectedStudent(id);
    setSelectedClassId(id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedStudent("");
    setSelectedClassId("");
    setIsModalOpen(false);
  };

  const handleSubmit = (formData, pastParentNumber, streamOpen) => {
    if (formData.classs == "KG-1") {
      formData.classs = -2;
    } else if (formData.classs == "KG-2") {
      formData.classs = -1;
    } else if (formData.classs == "Nursery") {
      formData.classs = -3;
    }

    if (formData.studentName.trim() == "") {
      toast.error("Student name is required!", {

        theme: "dark",
      });
      return;
    }
    if (formData.gender == "") {
      toast.error("Gender name is required!", {
        theme: "dark",
      });
      return;
    }
    if (formData.course && formData.course.trim() == "") {
      toast.error("Course name is required!", {
        theme: "dark",
      });
      return;
    }
    if (formData.dob == "") {
      toast.error("Date of birth name is required!", {
        theme: "dark",
      });
      return;
    }
    if (formData.address.trim() == "") {
      toast.error("Address is required!", {
        theme: "dark",
      });
      return;
    }
    if (formData.aadhar_no.trim() == "") {
      toast.error("Third installment last date is required!", {
        theme: "dark",
      });
      return;
    }
    if(containsNonDigits(formData.aadhar_no))
    {
      toast.error("Adhar number Container non-digit number",{theme:"dark"});
      return ;
    }
    if(formData.aadhar_no.length!=12)
    {
      toast.error("Adhar number should be 12 digit only",{theme:"dark"});
      return ;
    }
    if (formData.classs == "") {
      toast.error("Class is required!", {
        theme: "dark",
      });
      return;
    }

    if (formData.classs === "12" || formData.classs === "11") {
      if (formData.stream == undefined) {
        toast.error("Stream is required", {
          theme: "dark",
        });

        return;
      }
    }
    // if(streamOpen && (formData.stream == '' || formData.stream == undefined)){
    //   toast.error("Stream is required!", {
    //     theme: "dark",
    //   });
    //   return;
    // }
    
    if (formData.medium == "") {
      toast.error("Medium name is required!", {
        theme: "dark",
      });
      return;
    }
    if (formData.board == "") {
      toast.error("Board is required!", {
        theme: "dark",
      });
      return;
    }
    if (formData.fatherName.trim() == "") {
      toast.error("Father name is required!", {
        theme: "dark",
      });
      return;
    }
    if (formData.fatherProfession.trim() == "") {
      toast.error("Father Profession is required!", {
        theme: "dark",
      });
      return;
    }
    
    if(containsNonDigits(formData.primaryNumber))
    {
      return toast.error("Non Digit numbers Please provide a valid mobile number",{theme:'dark'});

      return ;
    }
    if(formData.primaryNumber.split('')[0]=='0') {
      return toast.error("Please provide a valid mobile number",{
        theme:'dark'
      })
    }

    if (formData.primaryNumber.length != 10) {
      toast.error("Primary mobile number should be of 10 digits!", {
        theme: "dark",
      });
      return;
    }

    if(!isValidPhoneNumber(formData.primaryNumber))
    {
      toast.error("Mobile number is not valid",{theme:'dark'});
      return ;
    }
  

    formData.pastParentNumber = pastParentNumber;

    if (
      formData.alternateNumber.length != 0 &&
      formData.alternateNumber.length != 10
    ) {
      toast.error("Alternate mobile number should be of 10 digits!", {
        theme: "dark",
      });
      return;
    }
    if(formData.alternateNumber.split('')[0]=='0') {
      return toast.error("Please provide a valid mobile number",{
        theme:'dark'
      })
    }
    if (formData.alternateNumber == formData.primaryNumber) {
      toast.error(
        "Alternate mobile number should not be same as Primary mobile number!",
        {
          theme: "dark",
        }
      );
      return;
    }
    if(containsNonDigits(formData.alternateNumber))
    {
      toast.error(
        "Non digit number please provide a valid number",
      {
        theme:"dark"
      })
      return ;
    }
    if (formData.motherName.trim() == "") {
      toast.error("Mother name is required!", {
        theme: "dark",
      });
      return;
    }
    if (formData.motherProfession.trim() == "") {
      toast.error("Mother Profession is required!", {
        theme: "dark",
      });
      return;
    }
    if (formData.email.trim() == "") {
      toast.error("Email is required!", {
        theme: "dark",
      });
      return;
    }
    if (!validateEmail(formData.email)) {
      toast.error("Email is not valid!", {
        theme: "dark",
      });
      return;
    }
    if (formData.firstInstallment == "") {
      toast.error("First Installement amount is required!", {
        theme: "dark",
      });
      return;
    }
    if (formData.firstInstallmentEta == "") {
      toast.error("First Installment last date is required!", {
        theme: "dark",
      });
      return;
    }
    if (formData.secondInstallment == "") {
      toast.error("Second Installment is required!", {
        theme: "dark",
      });
      return;
    }
    if (formData.secondInstallmentEta == "") {
      toast.error("Second Installment last date is required!", {

        theme: "dark",
      });
      return;
    }


let firstInstallment=new Date(formData.firstInstallmentEta);
let secondinstallment=new Date(formData.secondInstallmentEta);
if(firstInstallment>=secondinstallment)
{
  toast.error("Second Installment Last should be greater then first Installment Last date",{theme:'dark'});
  return ;
}



    if (formData.thirdInstallment == "") {
      toast.error("Third installment amount is required!", {

        theme: "dark",
      });
      return;
    }

    if (formData.thirdInstallmentEta == "") {
      toast.error("Third installment last date is required!", {

        theme: "dark",
      });
      return;
    }

    let thirdInstallment=new Date(formData.firstInstallmentEta);
     secondinstallment=new Date(formData.secondInstallmentEta);
     if(secondinstallment>=thirdInstallment){
      toast.error("Third Installment Last should be greater then second Installment Last date",{theme:'dark'});
      return ;
     }
  
    if (formData.parent_id == "") {
      toast.error("Parent id is required!", {

        theme: "dark",
      });
      return;
    }


    setLoaderOpen(true);

    mutation.mutate({
      student_name: formData.studentName,
      gender: formData.gender,
      dob: formData.dob,
      address: formData.address,
      class_id: formData.classs,
      course_name: formData.course,
      medium: formData.medium,
      board: formData.board,
      father_name: formData.fatherName,
      father_profession: formData.fatherProfession,
      mother_name: formData.motherName,
      mother_profession: formData.motherProfession,
      whatsapp_no: formData.primaryNumber,
      alternative_mobile: formData.alternateNumber,
      email: formData.email,
      first_installment: formData.firstInstallment,
      first_installment_eta: formData.firstInstallmentEta,
      second_installment: formData.secondInstallment,
      second_installment_eta: formData.secondInstallmentEta,
      third_installment: formData.thirdInstallment,
      third_installment_eta: formData.thirdInstallmentEta,
      aadhar_no: formData.aadhar_no,
      parent_id: formData.parent_id,
      section: formData.section,
      student_id: selectedStudent,
      pastParentNumber: formData.pastParentNumber,
      stream: formData.stream,
    });
    handleCloseModal();
  };

  const handleOpenAttendance = (studentDetails) => {
    navigate(`/attendance/${studentDetails.student_id}`, {
      state: {
        userId: studentDetails.student_id,
        userName: studentDetails.student_name,
        class: studentDetails.class_id,
      },
    });
  };

  // view button of the student table
  const viewColumn = [
    {
      field: "view",
      headerName: "Student Details",
      width: 200,
      editable: false,
      sortable: false,
      align: "center",
      headerAlign: "center",
      flex: 1,
      disableFilter: true,
      renderCell: (params) => {
        return (
          <div className="viewButton">
            <button
              style={{ marginRight: "5px" }}
              onClick={() => handleSelect(params.row.student_id)}
            >
              View
            </button>
          </div>
        );
      },
    },
    {
      field: "edit",
      headerName: "Edit",
      width: 200,
      editable: false,
      sortable: false,
      align: "center",
      headerAlign: "center",
      flex: 1,
      disableFilter: true,
      renderCell: (params) => {
        return (
          <div className="viewButton">
            <button
              style={{ marginRight: "5px" }}
              onClick={() =>
                handleOpenModal(params.row.student_id, params.row.class_id)
              }
            >
              Edit
            </button>
          </div>
        );
      },
    },
    {
      field: "attendance",
      headerName: "Attendance",
      width: 300,
      editable: false,
      sortable: false,
      align: "center",
      headerAlign: "center",
      flex: 1,
      disableFilter: true,
      renderCell: (params) => {
        return (
          <div className="viewButton">
            <button
              style={{ marginRight: "5px" }}
              onClick={() => handleOpenAttendance(params.row)}
            >
              View
            </button>
          </div>
        );
      },
    },
  ];

  const [isExpanded, setExpanded] = useState(false);
  const isExpandedHandler = (value) => {
    setExpanded(value);
  };
  return (
    <div className="student-container ">
      <Sidebar isExpandedHandler={isExpandedHandler} />
      <div className="student">
        <Navbar adminName={props.AdminName} />
        <div className="student-page page-container">
          <div className="student-detail-heading">
            <span>Student Details</span>
            {/* <div className="student-detail-search">
              <input type='number' placeholder='search by class-wise ....' />
              <div className="student-detail-search-btn">
                <button className='btn'>SEARCH</button>
              </div>
            </div> */}
          </div>
          <Box>
            {
              <DataTable
                rows={rows}
                columns={StudentListColumn.concat(viewColumn)}
                emptyRowsMessage={"No student avialable"}
                loader={isLoading}
              />
            }
            {isModalOpen && (
              <EditStudent
                onClose={handleCloseModal}
                onSubmit={handleSubmit}
                student_id={selectedStudent}
                school_id={school_id}
                class_id={selectedClassId}
              />
            )}
            {<CompareLevel />}
          </Box>
        </div>
      </div>


      <Loader open={loaderOpen} />
    </div>
  );
};


export default Student;
