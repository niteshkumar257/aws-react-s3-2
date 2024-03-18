import React from "react";
import MentorComponent from "./MentorComponent";

const MentorDetails = ({ mentorInfo }) => {
  console.log(mentorInfo);

  return (
    <div>
      <h1>Mentor Details</h1>
      <MentorComponent mentorDetails={"nitesh"} />
    </div>
  );
};

export default MentorDetails;
