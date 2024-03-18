import React from "react";
import {
  ProgressBar,
  LineWave,
  ThreeDots,
  Watch,
  Hourglass,
  RotatingLines,
} from "react-loader-spinner";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

const Loader = ({ open }) => {
  return (
    <div>
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogContent
          sx={{
            opacity: 1,
            backgroundColor: "rgba(255, 255, 255, 0)",
          }}
        >
          <DialogContentText id="alert-dialog-description">
            <RotatingLines
              height="80"
              width="80"
              radius="9"
              strokeColor="#1377C0"
              color="#1377C0"
              ariaLabel="three-dots-loading"
              wrapperStyle={{}}
              wrapperClassName=""
              visible={open}
            />
          </DialogContentText>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Loader;
