import React from "react";
import "./ClassComponent.scss";

const ClassComponent = ({ grade }) => {
  return (
    <div className="class-container">
      <span>Class :{grade}</span>
    </div>
  );
};

export default ClassComponent;
