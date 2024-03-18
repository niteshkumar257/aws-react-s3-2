import React from "react";
import { useState } from "react";
import Box from "@mui/material/Box";

import LinearProgress from "@mui/material/LinearProgress";
import CircularProgress from "@mui/material/CircularProgress";
import DataLoader from "../Loader/DataLoader";
import {
  DataGrid,
  GridToolbarContainer,
  GridToolbarExport,
} from "@mui/x-data-grid";

const DataTable = ({
  rows,
  columns,
  rowsPerPageOption,
  h,
  expandHandler,
  emptyRowsMessage,
  loader,
}) => {
  const [wid, setWidth] = useState(1);
  const emptyRowsLabelStyle = {
    fontSize: "18px", // Customize the font size
    color: "black", // Customize the text color
    fontWeight: "bold",
    // Add more style properties as needed
  };

  const customHeaderCellStyle = {
    "& .custom-sort-icon svg path, & .custom-sort-icon svg rect": {
      fill: "white !important",
    },
    "& .custom-toolbar-menu-icon svg path, & .custom-toolbar-menu-icon svg rect":
      {
        fill: "white !important",
      },
  };

  function CustomToolbar() {
    return (
      <GridToolbarContainer>
        <GridToolbarExport />
      </GridToolbarContainer>
    );
  }
  return (
    <>
      <Box>
        <DataGrid
          // getEstimatedRowHeight={() => 200}
          getRowHeight={() => "auto"}
          sx={{
            fontFamily: "Plus Jakarta Sans, sans-serif",
            color: "black",
            overflowX: "scroll",
            fontSize: 15,
            "&.MuiDataGrid-root .MuiDataGrid-cell:focus-within": {
              outline: "none !important",
              color: "white !important",
            },
            "&.MuiDataGrid-root .MuiDataGrid-column--cell:focus-within": {
              outline: "none !important",
              transition: "width 0.3s ease",
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

            height: "auto",
            width: "100%",
            ".MuiDataGrid-columnSeparator": {
              display: "none",
            },

            "& .MuiDataGrid-root": {
              borderBottom: "1px solid black",
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
            // "& .MuiSvgIcon-root:hover " :{

            //   color: "red !important",
            //   fontSize: "1.25rem !important"
            // },

            // Style for three-dot icon
            // "& .css-ptiqhd-MuiSvgIcon-root path": {
            //   fill: "white", // Change to your desired color
            //   fontSize: "30px", // Change to your desired font size
            //   opacity: 1, // Ensure full visibility
            // },
            "& .MuiDataGrid-cell": {
              borderBottom: "1px solid black",
            },
            "& .salaryStatus-column--cell": {
              color: "green",
            },

            "& .MuiDataGrid-cell:focus": {
              outline: "none",
            },
            "& .MuiDataGrid-column-cell:focus": {
              outline: "none",
            },

            "& .MuiDataGrid-footerContainer": {
              color: "white",
              borderTop: "none",
              backgroundColor: "#1377C0",
            },
            "& .MuiPaginationItem-root": {
              color: "white",
            },

            "& .MuiDataGrid-columnHeaders": {
              // color:"#009df1;",

              backgroundColor: "#1377C0",
              color: "white",

              fontSize: "17px",
              // fontWeight:900
            },
            customHeaderCellStyle,
          }}
          rows={rows}
          columns={columns}
          pageSize={10}
          localeText={{
            noRowsLabel: (
              <span style={emptyRowsLabelStyle}>{emptyRowsMessage}</span>
            ),
          }}
          slots={{
            toolbar: CustomToolbar,
          }}
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
          //  disableColumnMenu
          autoHeight={true}
          autoPageSize={false}
          // disableSelectionOnClick
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
