import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import CircularProgress from "@mui/material/CircularProgress";
import DataLoader from "../Loader/DataLoader";

export default function DataTable({ rows, columns, emptyRowsMessage, loader }) {
  const emptyRowsLabelStyle = {
    fontSize: "18px", // Customize the font size
    color: "black", // Customize the text color
    fontWeight: "bold",
    // Add more style properties as needed
  };
  return (
    <div style={{ width: "100%" }}>
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
      <DataGrid
        sx={{
          height: "auto",
          fontSize: 15,
          fontFamily: "Plus Jakarta Sans, sans-serif",
          fontWeight: 500,

          "& .MuiDataGrid-columnHeaders": {
            // color:"#009df1;",

            backgroundColor: "#1377C0",
            color: "white",
            // color:"009df1",

            fontSize: "17px",
            // fontWeight:900
          },
          ".MuiDataGrid-columnSeparator": {
            display: "none",
          },
          "& .MuiDataGrid-footerContainer": {
            borderTop: "none",
            backgroundColor: "#1377C0",
          },
          "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
            outline: "none !important",
          },
          "&.MuiDataGrid-root .MuiDataGrid-olumn--cell:focus-within": {
            outline: "none !important",
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
          "& .MuiDataGrid-footerContainer": {
            color: "white",
            borderTop: "none",
            backgroundColor: "#1377C0",
          },
          "& .MuiPaginationItem-root": {
            color: "white",
          },
          "& .MuiDataGrid-root": {
            borderBottom: "1px solid black",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: "1px solid black",
          },
        }}
        rows={rows}
        columns={columns}
        localeText={{
          noRowsLabel: (
            <span style={emptyRowsLabelStyle}>{emptyRowsMessage}</span>
          ),
        }}
        hideFooterPagination
        hideFooterSelectedRowCount
        disableColumnMenu
        autoHeight={true}
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
      />
    </div>
  );
}
