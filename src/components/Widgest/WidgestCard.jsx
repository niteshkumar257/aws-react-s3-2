import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";

const Card = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 500px;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin: 10px;
`;

const SkeletonPulse = keyframes`
  0% {
    background-color: rgba(0, 0, 0, 0.1);
  }
  50% {
    background-color: rgba(0, 0, 0, 0.3);
  }
  100% {
    background-color: rgba(0, 0, 0, 0.1);
  }
`;

const SchoolIconSkeleton = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-right: 16px;
  background-color: rgba(0, 0, 0, 0.1);
  animation: ${SkeletonPulse} 1.5s infinite;
`;

const SchoolDetailsContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;

  justify-content: center;
  align-items: center;
`;

const StudentCountSkeleton = styled.div`
  width: 100px;
  height: 24px;
  background-color: rgba(0, 0, 0, 0.1);
  margin-bottom: 8px;
  animation: ${SkeletonPulse} 1.5s infinite;
`;

const StudentCount = styled.p`
  font-size: 24px;
  margin: 0;
`;

const StudentName = styled.p`
  font-size: 18px;
  margin: 0;
`;

const Loader = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f0f0;
`;
const SchoolIcon = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-right: 16px;
`;

const SchoolInfo = ({ name, count, image, loading }) => {
  if (loading) {
    return (
      <Card>
        <SchoolIconSkeleton />
        <SchoolDetailsContainer>
          <StudentCountSkeleton />
        </SchoolDetailsContainer>
      </Card>
    );
  }

  return (
    <Card>
      <SchoolIcon src={image} alt="School Icon" />
      <SchoolDetailsContainer>
        <StudentCount>{count}</StudentCount>
        <StudentName>{name}</StudentName>
      </SchoolDetailsContainer>
    </Card>
  );
};

export default SchoolInfo;
