import React, { useState, useEffect } from "react";
import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Checkbox,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import {
  GW_URL,
  adminConfig,
  getAdminDetails,
  allSections,
  subjects,
} from "../../config";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import SelectField from "../../components/selectTextField/selectTextfield";
import MultiSelectField from "../../components/MultiSelectField/MultiSelect";
import useClassIdsQuery from "../../hooks/useGetSchoolIds";
import useMediumQuery from "../../hooks/useGetMediuIds";
import useSubjectIQuery from "../../hooks/useGetSchoolSubjectId";
import useTeacherClassIdsQuery from "../../hooks/useGetTeacherAllClasssIds";
import useTeacherSubjectIdQuery from "../../hooks/useGetTeacherMediumIds";

const addClassDetails = ({ teacher_id, class_id,medium,sections,subjectList }) => {
  

  return axios.post(
    `${GW_URL}/teacher/${teacher_id}/addTeacherClassAndMedium`,
    { class_id, medium,sections,subject_list:subjectList },
    adminConfig
  );
};

const AddTeacherClass = ({ teacher_id, open, setOpen }) => {
  const { school_id } = getAdminDetails();

  const [classId, setClassId] = useState("");
  const [medium, setMedium] = useState("");
  const [section, setSection] = useState("");
  const [subjectList, setSubjectList] = useState([]);

  const { data: classIdData, isLoading: classIdLoading } =
    useTeacherClassIdsQuery(teacher_id);

  const { data: mediumIdData, isLoading: mediumIdLoading } =
    useMediumQuery(school_id);

    const { data: subjectIdData, isLoading: subjectIdLoading } =
    useTeacherSubjectIdQuery(teacher_id);

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: addClassDetails,
    onSuccess: () => {
      queryClient.invalidateQueries("class-list");
     
      toast.success("Class details Added", {
        position: "top-center",
        autoClose: 2000,
        theme: "dark",
      });
      handleClose();
    },
    onError: () => {

      toast.error("Something went wrong!", {
        position: "top-center",
        autoClose: 2000,
        theme: "dark",
      });
    },
  });

  const classHandler = (itemId) => {
    setClassId(itemId);
  };

  const mediumHandler = (itemId) => {
    setMedium(itemId);
  };
  const sectionHandler = (itemId) => {
    setSection(itemId);
  };
  const subjectListHandler = (subjectIds) => {
    
    setSubjectList(subjectIds);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    
  };

  // const handleInputChange = (event) => {
  //   const { name, value } = event.target;
  //   setFormValues({ ...formValues, [name]: value });
  // };

  const handleSubmit = (e) => {
    e.preventDefault();

    if(classId==="") {
      toast.error("Please a Class");
      return ;
    }
    if(medium==="")
    {
      toast.error("Please select a Medium");
      return ;
    }
    if(section==="")
    {
      toast.error("Please select a section");
      return ;
    }
    if(subjects.length===0)
    {
       toast.error("Please select at least subject");
       return ;
    }
    mutation.mutate({
      teacher_id,
      class_id: classId,
      medium:medium,
      sections:section,
      subjectList:subjectList
    });
  };

  const buttonStyle = {
    marginTop: "16px",
    width: "150px", // Adjust the width as needed
    alignSelf: "flex-start",
  };

  const removeButtonStyle = {
    marginTop: "16px",
    width: "150px", // Adjust the width as needed
    alignSelf: "flex-end",
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Add Class</DialogTitle>
      <DialogContent sx={{
         display:'flex',flexDirection:"column", rowGap:"1rem",height:"500",padding:"1rem"
      }}>
        <SelectField
          label="Class"
          items={classIdData}
          loading={classIdLoading}
          onChange={classHandler}
          idKey={"class_id"}
          nameKey={"class_name"}
        />
        <SelectField
          label="Medium"
          items={mediumIdData}
          loading={mediumIdLoading}
          onChange={mediumHandler}
          idKey={"medium_name"}
          nameKey={"medium_name"}
        />
        <SelectField
          label="Section"
          items={allSections}
          onChange={sectionHandler}
          idKey={"section_name"}
          nameKey={"section_name"}
        />
         <MultiSelectField
          label="Subject"
          items={subjectIdData}
          loading={subjectIdLoading}
          onChange={subjectListHandler}
          initialSelectedItems={[]}
          idKey="subject_id"
          nameKey="subject_name"
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleClose}
          variant="outlined"
          style={{ color: "#2196F3" }}
        >
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Submit
        </Button>
      </DialogActions>
      <ToastContainer />
    </Dialog>
  );
};

export default AddTeacherClass;
