import React from "react";
import styled from "styled-components";

const CardContainer = styled.div`
  width: 100%;
  height: ${(props) => props.height || "300px"};
  background-color: #f0f0f0;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Message = styled.p`
  font-size: 18px;
  font-weight: bold;
  color: #333;
`;

const Card = ({ message, height }) => {
  return (
    <CardContainer height={height}>
      <Message>{message}</Message>
    </CardContainer>
  );
};

export default Card;
