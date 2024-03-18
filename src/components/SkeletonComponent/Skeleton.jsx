import React from "react";
import Skeleton from "@mui/material/Skeleton";

const SkeletonComponent = ({ height }) => {
  return (
    <Skeleton
      variant="rectangular"
      sx={{
        width: "100%", // Adjust width to 100%
      }}
      height={height}
    />
  );
};

export default SkeletonComponent;
