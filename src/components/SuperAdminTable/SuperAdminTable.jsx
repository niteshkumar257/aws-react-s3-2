import React from "react";
import { useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import LinearProgress from "@mui/material/LinearProgress";
import DataLoader from "../Loader/DataLoader";

const DataTable = ({
  rows,
  columns,
  rowsPerPageOption,
  h,
  expandHandler,
  loader,
}) => {
  const [wid, setWidth] = useState(1);
  return (
    <>
      <Box>
        <DataGrid
          sx={{
            color: "black",
            fontSize: 15,
            fontFamily: "Plus Jakarta Sans, sans-serif",
            fontWeight: 500,
            fontFamily: "Plus Jakarta Sans, sans-serif",
            "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
              outline: "none !important",
            },
            "&.MuiDataGrid-root .MuiDataGrid-olumn--cell:focus-within": {
              outline: "none !important",
            },
            "&.MuiDataGrid-root--densityCompact .MuiDataGrid-cell": {
              py: "8px",
            },
            "&.MuiDataGrid-root--densityStandard .MuiDataGrid-cell": {
              py: "15px",
            },
            "&.MuiDataGrid-root--densityComfortable .MuiDataGrid-cell": {
              py: "22px",
            },
            height: "100vh",
            width: "100%",
            ".MuiDataGrid-columnSeparator": {
              display: "none",
            },
            // '&.MuiDataGrid-root': {
            //   border: 'none',
            // },
            "& .MuiDataGrid-root": {
              borderBottom: "1px solid black",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "1px solid black",
            },
            "& .MuiDataGrid-footerContainer": {
              color: "white",
              borderTop: "none",
              backgroundColor: "#1377C0",
            },
            "& .MuiPaginationItem-root": {
              color: "white",
            },
            "& .salaryStatus-column--cell": {
              color: "green",
            },

            // "& .MuiDataGrid-virtualScroller": {
            //   backgroundColor:"blueviolet",        // color the background of the table
            // },
            "& .MuiDataGrid-cell:focus": {
              outline: "none",
            },
            "& .MuiDataGrid-column-cell:focus": {
              outline: "none",
            },
            "& .MuiDataGrid-sortIcon path": {
              fill: "white", // Change to your desired color
              fontSize: "24px", // Change to your desired font size
              opacity: 1, // Ensure full visibility
            },

            "& .MuiSvgIcon-root ": {
              color: "white !important",
              fontSize: "1.25rem !important",
            },
            // Style for three-dot icon
            "& .css-ptiqhd-MuiSvgIcon-root path": {
              fill: "white", // Change to your desired color
              fontSize: "24px", // Change to your desired font size
              opacity: 1, // Ensure full visibility
            },

            // "&.MuiDataGrid-columnHeaderTitle":{
            //     // color:"red",
            //     // fontSize:"8rem",
            //     fontWeight:600

            // },
            // "&.css-1jbbcbn-MuiDataGrid-columnHeaderTitle":{
            //   fontWeight:600
            // },

            "& .MuiDataGrid-footerContainer": {
              color: "white",
              borderTop: "none",
              backgroundColor: "#1377C0",
            },
            "&.MuiDataGrid-columnHeadersInner": {
              color: "black",
            },
            "&.MuiDataGrid-footerCell": {
              color: "white",
            },
            "&.MuiDataGrid-footerContainer": {
              color: "white",
            },
            "&.MuiDataGrid-panelHeader": {
              color: "white",
            },
            "&	.MuiDataGrid-iconSeparator": {
              color: "white",
            },
            "& .MuiDataGrid-iconButtonContainer": {
              color: "white",
            },
            "& .MuiDataGrid-columnHeaders": {
              // color:"#009df1;",

              backgroundColor: "#1377C0",
              color: "white",

              fontSize: "17px",
              // fontWeight:900
            },
            "&	.MuiDataGrid-menuIcon": {
              color: "white",
            },
            "&	.MuiDataGrid-menuIcon": {
              color: "white",
            },
            "& .MuiDataGrid-icon": {
              color: "white",
            },
          }}
          rows={rows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          loading={loader}
          components={{
            LoadingOverlay: () => (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                }}
              >
                <DataLoader open={loader} width={60} />
              </div>
            ),
          }}
          // disableColumnMenu
          autoHeight={true}
          autoPageSize={true}
          columnBuffer={3}
          columnHeaderHeight={70}
          disableColumnSelector={false}
          disableSelectionOnClick
          experimentalFeatures={{ newEditingApi: true }}
        />
        <style>
          {`
            /* Customize sorting icon */
            .custom-sort-icon svg path,
            .custom-sort-icon svg rect {
              fill: white !important; /* Change to your desired color */
              font-size: 24px !important; /* Change to your desired font size */
              opacity: 1 !important; /* Ensure full visibility */
              &:hover {
                fill: white; /* Change to your desired hover color */
              }
            }

            /* Customize toolbar menu icon */
            .custom-toolbar-menu-icon svg path,
            .custom-toolbar-menu-icon svg rect {
              fill: white !important; /* Change to your desired color */
              font-size: 24px !important; /* Change to your desired font size */
              opacity: 1 !important; /* Ensure full visibility */
            }
            &:hover {
              fill: red; /* Change to your desired hover color */
            }
          `}
        </style>
      </Box>
    </>
  );
};

export default DataTable;
