import { useState, useEffect } from "react";
import "./MentorPage.scss";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import { useParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useFetchMentor from "../../hooks/usefetchMentor";
import styled from "styled-components";
import DataLoader from "../../components/Loader/DataLoader";

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
  font-size: 16px;
  margin-bottom: 4px;
`;

const MentorMobile = styled.p`
  font-size: 16px;
  margin-bottom: 4px;
`;

const MentorDescription = styled.p`
  font-size: 16px;
`;
const SingleMentorPage = (props) => {
  let params = useParams();
  const [mentorDetails, setMentorDetails] = useState({});
  let mentor_id = params.MentorId;
  const { isLoading, isError, data, error } = useFetchMentor(mentor_id);
  useEffect(() => {
    if (isError) {
      console.log(error);
    }
    if (!isLoading) {
      setMentorDetails(data.data.mentorDetails);
    }
  }, [data]);

  const [isExpanded, setExpanded] = useState(false);
  const isExpandedHandler = (value) => {
    setExpanded(value);
  };

  return (
    <div className="SingleMentorPage-container ">
      <Sidebar isExpandedHandler={isExpandedHandler} />
      <div className="SingleMentor">
        <Navbar adminName={props.AdminName} />
        <div className="MentorPageDetailsContainer">
          {isLoading ? (
            <DataLoader Loading={isLoading} width={60} />
          ) : (
            <Card>
              <MentorPhoto
                src={mentorDetails.photo}
                alt={mentorDetails.mentor_name}
              />
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
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default SingleMentorPage;
