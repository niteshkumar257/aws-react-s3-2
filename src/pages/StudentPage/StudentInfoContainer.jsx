import React from "react";
import styled from "styled-components";

const StudentInfoContainer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;

const StudentImage = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 20px;
`;

const StudentDetails = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: ;
  grid-column-gap: 0px;
  grid-row-gap: 0px;
`;

const StudentName = styled.h2`
  font-size: 24px;
  margin: 0;
`;

const StudentInfoItem = styled.div`
  margin-bottom: 10px;
`;

const StudentInfoLabel = styled.span`
  font-weight: bold;
`;

const StudentInfoValue = styled.span`
  margin-left: 5px;
`;

const StudentInfo = ({ studentData }) => {
  const {
    student_name,
    gender,
    school_id,
    class_id,
    parent_id,
    dob,
    course_name,
    medium,
    board,
    photo_url,
    address,
    aadhar_no,
  } = studentData;

  return (
    <StudentInfoContainer>
      <StudentImage src={photo_url} alt="Student" />
      <StudentDetails>
        <StudentName>{student_name}</StudentName>
        <StudentInfoItem>
          <StudentInfoLabel>Gender:</StudentInfoLabel>
          <StudentInfoValue>{gender}</StudentInfoValue>
        </StudentInfoItem>
        <StudentInfoItem>
          <StudentInfoLabel>DOB:</StudentInfoLabel>
          <StudentInfoValue>{dob}</StudentInfoValue>
        </StudentInfoItem>
        <StudentInfoItem>
          <StudentInfoLabel>Course:</StudentInfoLabel>
          <StudentInfoValue>{course_name}</StudentInfoValue>
        </StudentInfoItem>
        <StudentInfoItem>
          <StudentInfoLabel>Medium:</StudentInfoLabel>
          <StudentInfoValue>{medium}</StudentInfoValue>
        </StudentInfoItem>
        <StudentInfoItem>
          <StudentInfoLabel>Board:</StudentInfoLabel>
          <StudentInfoValue>{board}</StudentInfoValue>
        </StudentInfoItem>
        <StudentInfoItem>
          <StudentInfoLabel>Address:</StudentInfoLabel>
          <StudentInfoValue>{address}</StudentInfoValue>
        </StudentInfoItem>
        <StudentInfoItem>
          <StudentInfoLabel>Aadhar No:</StudentInfoLabel>
          <StudentInfoValue>{aadhar_no}</StudentInfoValue>
        </StudentInfoItem>
      </StudentDetails>
    </StudentInfoContainer>
  );
};

export default StudentInfo;
