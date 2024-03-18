import React from "react";
import styled from "styled-components";

const Card = styled.div`
  display: flex;
  max-width: "90%";
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin: 10px;
`;

const MentorPhoto = styled.img`
  width: 200px;
  height: 200px;
  border-radius: 8px;
  margin-right: 16px;
`;

const MentorDetailsContainer = styled.div`
  flex: 1;
`;

const MentorName = styled.h3`
  font-size: 24px;
  margin-bottom: 8px;
`;

const MentorEmail = styled.p`
  font-size: 18px;
  margin-bottom: 4px;
`;

const MentorMobile = styled.p`
  font-size: 18px;
  margin-bottom: 4px;
`;

const MentorDescription = styled.p`
  font-size: 18px;
`;

const MentorDetails = () => {
  const mentorDetails = {
    mentor_id: 35,
    mentor_name: "Ajay Saini",
    gmail: "ajay96273@gmail.com",
    details:
      "GAANV wala was founded by alumni of NIT Rourkela. Ajay Saini, the co-founder and academic head, holds an Integrated M.Sc. degree from NIT Rourkela and has 4 years of experience as a teaching faculty at Byju's, Career Point,Aakash and Allen Institute Kota. He is also a best motivator and mentor for students.",
    mobile: "8905534304",
    photo:
      "https://gaanvwala-storage.s3.ap-south-1.amazonaws.com/1689747824513e9205a64-8c11-42a3-8dec-d2282265eb85.JPG",
  };
  return (
    <Card>
      <MentorPhoto src={mentorDetails.photo} alt={mentorDetails.mentor_name} />
      <MentorDetailsContainer>
        <MentorName>{mentorDetails.mentor_name}</MentorName>
        <MentorEmail>
          <strong>Email:</strong> {mentorDetails.gmail}
        </MentorEmail>
        <MentorMobile>
          <strong>Mobile:</strong> {mentorDetails.mobile}
        </MentorMobile>
        <MentorDescription>
          {" "}
          <strong>Details:</strong> {mentorDetails.details}
        </MentorDescription>
      </MentorDetailsContainer>
    </Card>
  );
};

export default MentorDetails;
