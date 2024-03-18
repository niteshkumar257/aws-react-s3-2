import React from "react";
import "./Details.scss";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import Fade from "@mui/material/Fade";
import Zoom from "@mui/material/Zoom";

const MAX_WORDS = 5;
const LightTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: theme.palette.common.grey,
    color: "white",
    boxShadow: theme.shadows[2],
    fontSize: 16,
    fontWeight: 600,
    maxWidth: 500,
    height: "auto",
    padding: 5,
  },
}));

const truncateText = (text) => {
  const words = text.split(" ");
  if (words.length > MAX_WORDS) {
    return words.slice(0, MAX_WORDS).join(" ") + "...";
  }
  return text;
};

const Details = ({ value }) => {
  const truncatedText = truncateText(value);

  return (
    <LightTooltip
      sx={{
        backgroundColor: "white",
        height: "auto",
        fontSize: 20,
      }}
      height={100}
      placement="right"
      arrow={true}
      enterDelay={500}
      leaveDelay={10}
      TransitionComponent={Fade}
      TransitionProps={{ timeout: 0 }}
      title={value}
    >
      <div className="toolTipContainer">{truncatedText}</div>
    </LightTooltip>
  );
};

export default Details;
