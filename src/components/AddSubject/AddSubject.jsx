import React, { useEffect, useState } from "react";
import useSubjectIQuery from "../../hooks/useGetSchoolSubjectId";
import useClassIdsQuery from "../../hooks/useGetSchoolIds";
import useSchoolId from "../../hooks/useGetSchoolId";
import useGetClassWiseSubjects from "../../hooks/useGetClassWiseSubject";
import useMediumIdsQuery from "../../hooks/useGetMediuIds";
import useUpdateSubjectList from "../../hooks/useAddSchoolSubject";
import DataTable from "../SuperAdminTable/SuperAdminTable";
import SelectField from "../selectTextField/selectTextfield";
import MultiSelectField from "../MultiSelectField/MultiSelect";
import "./AddSubject.scss";
import Button from "../Button/Addbutton";
import { subjects } from "../../config";
import jwt_decode from "jwt-decode";
import { toast } from "react-toastify";
import useGetClassIdSubjects from "../../hooks/useGetClassIdSubject";

const subjectsByClassId = (classId, subjectsArray) => {
  const classSubjects = subjectsArray?.find((item) => item.id === classId);
  return classSubjects ? classSubjects.subject.split(", ") : [];
};

const converSubjectToSubjectid = (subjectsArray) => {
  const subjectsWithIds = subjectsArray.map((subjectName) => {
    const subject = subjects.find(
      (s) =>
        s.subject_name.trim().toLowerCase() === subjectName.trim().toLowerCase()
    );
    return {
      subject_id: subject ? subject.subject_id : null,
      subject_name: subjectName,
    };
  });
  return subjectsWithIds;
};

const SubjectListColumn = [
  {
    field: "id",
    headerName: "Class",
    editable: true,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "subject",
    headerName: "Subject Name",
    width: 200,
    flex: 1,
    editable: true,
    headerAlign: "left",
    align: "left",
  },
];
const AddSubject = () => {
  let decodeToken = jwt_decode(localStorage.getItem("auth_token"));
  let school_id =
    localStorage.getItem("superadmin_school") === null
      ? decodeToken.result.school_id
      : localStorage.getItem("superadmin_school");

  // use states
  const [classId, setClassId] = useState("");
  const [subjectList, setSubjectList] = useState([]);
  const [selectedClassSubjects, setSelectedClassSubjects] = useState([]);

  const { data: classIdData, isLoading: classIdLoading } =
    useClassIdsQuery(school_id);
  const { data: subjectIdData, isLoading: subjectIdLoading } =
    useSubjectIQuery(school_id);
  const { data: classWiseSubject, isLoading: classWiseSubjectLoading } =
    useGetClassWiseSubjects(school_id);

  const { updateClassSubject, isLoading, isError, error } =
    useUpdateSubjectList(school_id);

  let selectedClasses;
  let selectedClass;
  useEffect(() => {
    if (classId === "") return;
    selectedClass = classId;
    if (selectedClass === -3) {
      selectedClass = "Nursery";
    } else if (selectedClass === -2) selectedClass = "KG-1";
    else if (selectedClass === -1) selectedClass = "KG-2";

    console.log(selectedClass);
    selectedClasses = classWiseSubject?.find(
      (sub) => sub.id === `${selectedClass}`
    );

    selectedClasses = selectedClasses?.subject?.split(/\s*,\s*/);

    selectedClasses = converSubjectToSubjectid(selectedClasses);

    setSelectedClassSubjects(selectedClasses);
  }, [classId]);

  const classHandler = (itemId) => {
    setClassId(itemId);
  };
  const subjectListHandler = (subjectIds) => {
    setSubjectList(subjectIds);
  };
  const EditSubjectHandler = async () => {
    if (classId === "") {
      toast.error("Please select class");
      return;
    }

    if (subjectList.length == 0) {
      toast.error("Please select subject");
      return;
    }
    try {
      await updateClassSubject({ classId, subjectList, school_id });
      toast.success("Subject added successfully!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (err) {
      toast.error("Something went wrong!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  return (
    <div className="add-subject-container">
      <div className="add-subject-filter-container">
        <SelectField
          label="Class"
          items={classIdData}
          loading={classIdLoading}
          onChange={classHandler}
          idKey={"class_id"}
          nameKey={"class_name"}
        />
        <MultiSelectField
          label="Subject"
          items={subjectIdData}
          loading={subjectIdLoading}
          onChange={subjectListHandler}
          initialSelectedItems={selectedClassSubjects}
          idKey="subject_id"
          nameKey="subject_name"
        />
        <button onClick={EditSubjectHandler}>Add</button>
      </div>
      <div className="add-subject-table-container">
        {classWiseSubjectLoading ? (
          <span>Loading ..</span>
        ) : (
          <DataTable rows={classWiseSubject} columns={SubjectListColumn} />
        )}
      </div>
    </div>
  );
};

export default AddSubject;
