import React from "react";
import useFetchAdminLogin from "../../hooks/useFetchAdminLogin";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import DataTable from "../../components/Table/TableFee";


const columns = [
    {
      field: "id",
      headerName: "S No.",
      flex: 1,
      editable: false,
      align: "left",
      headerAlign: "left",
      hide:true
    },
    {
      field: "school_name",
      headerName: "Name",
      flex: 1,
      editable: false,
      headerAlign: "left",
      align: "left",
    },
    {
      field: "username",
      headerName: "UserName",
      editable: true,
      flex: 1,
      editable: false,
      headerAlign: "left",
      align: "left",
    },
    {
      field: "passwords",
      headerName: "Password",
      flex: 1,
      editable: false,
      headerAlign: "left",
      align: "left",
    },
  ];
const AdminLogin = () => {
    const {isLoading,isError,data}=useFetchAdminLogin();

  
  
  return (
    <div className="teacher-id-password-container">
      <Sidebar />
      <div className="teacher-id-password">
        <Navbar />
        <div style={{ marginLeft: "10px",padding:'1rem' }}>

            <span style={{marginTop:"1rem",marginBottom:'1rem'}}>Admin Username and Password</span>
            {
                isLoading  ? <span>Loading ...</span> : 
                <DataTable
                rows={data}
                columns={columns}
                emptyRowsMessage={"No Teachers"}
                loader={isLoading}
              />
            }
         
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
