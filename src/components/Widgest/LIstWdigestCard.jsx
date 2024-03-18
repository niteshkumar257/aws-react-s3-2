import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";

const Card = styled.div`
  display: flex;
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

const IconSkeleton = styled.div`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  margin-right: 16px;
  background-color: rgba(0, 0, 0, 0.1);
  animation: ${SkeletonPulse} 1.5s infinite;
`;

const InfoContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px; /* Add space between elements */
  justify-content: center;
  align-items: center;
`;

const Title = styled.h3`
  font-size: 24px;
  margin: 0;
`;

const ValueContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
`;

const Value = styled.span`
  font-size: 16px;
  margin-right: 8px;
`;

const Loader = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f0f0;
`;

const ValueSkeleton = styled.span`
  width: 50px;
  height: 18px;
  background-color: rgba(0, 0, 0, 0.1);
  margin-right: 8px;
  animation: ${SkeletonPulse} 1.5s infinite;
`;

const MediumInfo = ({ name, values, image, loading }) => {
  if (loading) {
    return (
      <Card>
        <IconSkeleton />
        <InfoContainer>
          <Title>
            <ValueSkeleton />
          </Title>
          <ValueContainer>
            <ValueSkeleton />
            <ValueSkeleton />
            <ValueSkeleton />
          </ValueContainer>
        </InfoContainer>
      </Card>
    );
  }

  return (
    <Card>
      <img src={image} alt="Icon" width="80" height="80" />
      <InfoContainer>
        <Title>{name}</Title>
        <ValueContainer>
          {values.map((value, index) => (
            <Value key={index}>{value}</Value>
          ))}
        </ValueContainer>
      </InfoContainer>
    </Card>
  );
};

export default MediumInfo;
