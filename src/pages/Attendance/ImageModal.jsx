import React from "react";
import { Modal, Paper, Typography, Button } from "@mui/material";

const ImageModal = ({ open, handleClose, teacherName, imageUrl }) => {
  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="teacher-modal-title"
      aria-describedby="teacher-modal-description"
    >
      <Paper
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          padding: "3rem",
          borderRadius: 9,
          width: 340,
          height: 340,
          resize: "contain",
        }}
      >
        <img
          src={imageUrl}
          alt={teacherName}
          style={{ resize: "contain", height: 300, width: 300 }}
        />
        <Typography variant="h5" id="teacher-modal-title" gutterBottom>
          {teacherName}
        </Typography>
        <Button
          variant="contained"
          sx={{ backgroundColor: "green" }}
          onClick={handleClose}
        >
          Close
        </Button>
      </Paper>
    </Modal>
  );
};

export default ImageModal;
