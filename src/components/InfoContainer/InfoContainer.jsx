import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { allSchoolCategory } from "../../config";
const Card = styled.div`
  display: flex;
  flex-wrap: wrap;
  width: 95%;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin: 5px;
`;

const SchoolLogo = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 8px;
  margin-right: 16px;
  margin-bottom: 16px;
`;

const SchoolDetailsContainer = styled.div`
  flex: 1;
  padding-left: 50px;
`;

const SchoolName = styled.h3`
  font-size: 24px;
  margin-bottom: 16px;
`;

const SchoolDetails = styled.div`
  display: flex;
  flex-wrap: wrap;
  row-gap: 20px;
`;

const SchoolDetailItem = styled.div`
  flex-basis: 50%;
  font-size: 16px;
  margin-bottom: 8px;
`;

const Loader = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f0f0f0;
`;

const getCategoryName = (id) => {
  const category = allSchoolCategory.find((item) => item.category_id === id);
  return category.category_name;
};
const InfoCotainer = ({ data }) => {

  return (
    <Card>
      <SchoolLogo src={data?.photo_url} alt={data.school_name} />
      <SchoolDetailsContainer>
        <SchoolName>{data?.school_name}</SchoolName>
        <SchoolDetails>
          <SchoolDetailItem>
            <strong>City:</strong> {data?.city_name}
          </SchoolDetailItem>
          <SchoolDetailItem>
            <strong>Admin Name:</strong> {data.admin_name}
          </SchoolDetailItem>
          <SchoolDetailItem>
            <strong>Email:</strong> {data.email}
          </SchoolDetailItem>
          <SchoolDetailItem>
            <strong>Mobile:</strong> {data.mobile}
          </SchoolDetailItem>
          <SchoolDetailItem>
            <strong>Category:</strong> {getCategoryName(data.category_id)}
          </SchoolDetailItem>
        </SchoolDetails>
      </SchoolDetailsContainer>
    </Card>
  );
};

export default InfoCotainer;
