import React from "react";
import { useState } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import LinearProgress from "@mui/material/LinearProgress";

const DataGridWithToolTrip = ({
  rows,
  columns,
  rowsPerPageOption,
  h,
  expandHandler,
  emptyRowsMessage,
  loader,
}) => {
  const emptyRowsLabelStyle = {
    fontSize: "18px", // Customize the font size
    color: "black",
    fontWeight: 600, // Customize the text color
    // Add more style properties as needed
  };
  return (
    <>
      <Box>
        <DataGrid
          getRowHeight={() => "auto"}
          sx={{
            color: "black",
            fontSize: 15,
            fontFamily: "Plus Jakarta Sans, sans-serif",
            fontWeight: 500,

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
              px: "22px",
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
            "& .MuiDataGrid-sortIcon path": {
              fill: "white", // Change to your desired color
              fontSize: "24px", // Change to your desired font size
              opacity: 1, // Ensure full visibility
            },

            // Style for three-dot icon
            "& .css-ptiqhd-MuiSvgIcon-root path": {
              fill: "white", // Change to your desired color
              fontSize: "24px", // Change to your desired font size
              opacity: 1, // Ensure full visibility
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "1px solid black",
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

            "& .MuiDataGrid-columnHeaders": {
              // color:"#009df1;",

              backgroundColor: "#1377C0",
              color: "white",

              fontSize: "17px",
              // fontWeight:900
            },
            "& .MuiDataGrid-footerContainer": {
              color: "white",
              borderTop: "none",
              backgroundColor: "#1377C0",
            },
            "& .MuiPaginationItem-root": {
              color: "white",
            },
          }}
          rows={rows}
          columns={columns}
          pageSize={8}
          rowsPerPageOptions={[10]}
          components={{
            LoadingOverlay: LinearProgress,
          }}
          disableColumnMenu
          autoHeight={true}
          autoPageSize={true}
          // disableSelectionOnClick
          localeText={{
            noRowsLabel: (
              <span style={emptyRowsLabelStyle}>{emptyRowsMessage}</span>
            ),
          }}
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

export default DataGridWithToolTrip;
