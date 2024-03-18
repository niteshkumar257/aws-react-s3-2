import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";

const ConfirmationModal = ({ open, onClose, onConfirm, title, message }) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{message}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button
          sx={{
            backgroundColor: "red",
            width: 100,
            borderRadius: 9,
            color: "white",
            "&:hover": {
              backgroundColor: "darkred", // Change color on hover
            },
          }}
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button
          sx={{
            backgroundColor: "green",
            width: 100,
            borderRadius: 9,
            color: "white",
            "&:hover": {
              backgroundColor: "darkgreen", // Change color on hover
            },
          }}
          onClick={onConfirm}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationModal;
