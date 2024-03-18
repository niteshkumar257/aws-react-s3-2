import React from "react";
import styled from "styled-components";
import DataLoader from "../Loader/DataLoader";

const Card = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction:row
  max-width: 400px;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin: 5px;
`;

const StudentPhoto = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 8px;
  margin-right: 16px;
  margin-bottom: 16px;
`;

const StudentDetailsContainer = styled.div`
  flex: 1;
`;

const StudentName = styled.h3`
  font-size: 24px;
  margin-bottom: 16px;
`;

const StudentCount = styled.p`
  font-size: 18px;
`;

const LoaderContainer = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f0f0;
`;

const WidgestCard = ({ name, count, image, isLoading }) => {
  return (
    <Card>
      <div className="left">
        <StudentName>{name}</StudentName>
        {isLoading ? (
          <LoaderContainer>
            <DataLoader Loading={isLoading} width={60} />
          </LoaderContainer>
        ) : (
          <StudentCount>
            {Array.isArray(count) ? (
              <div className="count-container">
                {count.map((item, index) => (
                  <div className="count-subContainer" key={index}>
                    <p>{item}</p>
                  </div>
                ))}
              </div>
            ) : (
              count
            )}
          </StudentCount>
        )}
      </div>
      <div className="right">
        <StudentPhoto src={image} alt="Student" />
      </div>
    </Card>
  );
};

export default WidgestCard;
