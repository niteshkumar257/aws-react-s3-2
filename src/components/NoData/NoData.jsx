import React from "react";
import Paper from "@mui/material/Paper";

const NoData = ({ message, height }) => {
  return (
    <Paper
      elevation={3}
      sx={{
        width: "100%",
        height: height,
        borderRadius: 4,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <span>{message}</span>
    </Paper>
  );
};

export default NoData;
