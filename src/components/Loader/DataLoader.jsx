import React from "react";
import { FallingLines, Bars, ThreeDots } from "react-loader-spinner";

const DataLoader = ({ Loading, width }) => {
  return (
    <div>
      <ThreeDots
        height={width}
        width={width}
        radius="9"
        color="lightgrey"
        ariaLabel="three-dots-loading"
        wrapperStyle={{}}
        wrapperClassName=""
        visible={Loading}
      />
    </div>
  );
};

export default DataLoader;
