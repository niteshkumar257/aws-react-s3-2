import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { GW_URL, adminConfig } from "../config";

const ChangeFormatOfDropDownValue = (arr1, arr2) => {
  const tempArray = [];
  for (let i = 0; i < arr1.length; i++) {
    tempArray.push({
      id: arr1[i],
      value: arr2[i],
      label: arr2[i],
    });
  }
  return tempArray;
};

const useSchoolData = (school_id) => {
  const courseQuery = useQuery(["course", school_id], () =>
    getCourseId(school_id)
  );
  const mediumQuery = useQuery(["medium", school_id], () =>
    getMediumId(school_id)
  );
  const boardQuery = useQuery(["board", school_id], () =>
    getBoardId(school_id)
  );
  const classQuery = useQuery(["class", school_id], () =>
    getClassId(school_id)
  );

  const isLoading =
    courseQuery.isLoading ||
    mediumQuery.isLoading ||
    boardQuery.isLoading ||
    classQuery.isLoading;
  const isError =
    courseQuery.isError ||
    mediumQuery.isError ||
    boardQuery.isError ||
    classQuery.isError;

  const courseArray = courseQuery.data
    ? ChangeFormatOfDropDownValue(
        courseQuery.data.course_id,
        courseQuery.data.course_name
      )
    : [];
  const mediumArray = mediumQuery.data
    ? ChangeFormatOfDropDownValue(
        mediumQuery.data.medium_id,
        mediumQuery.data.medium_name
      )
    : [];
  const boardArray = boardQuery.data
    ? ChangeFormatOfDropDownValue(
        boardQuery.data.board_id,
        boardQuery.data.board_name
      )
    : [];
  const classArray = classQuery.data
    ? ChangeFormatOfDropDownValue(
        classQuery.data.class_id,
        classQuery.data.class_name
      )
    : [];

  return {
    isLoading,
    isError,
    courseArray,
    mediumArray,
    boardArray,
    classArray,
  };
};

const getCourseId = async (school_id) => {
  const response = await axios.get(
    `${GW_URL}/schools/${school_id}/getCourseId`,
    adminConfig
  );
  return response.data;
};

const getMediumId = async (school_id) => {
  const response = await axios.get(
    `${GW_URL}/schools/${school_id}/getMediumId`,
    adminConfig
  );
  return response.data;
};

const getBoardId = async (school_id) => {
  const response = await axios.get(
    `${GW_URL}/schools/${school_id}/getBoardId`,
    adminConfig
  );
  return response.data;
};

const getClassId = async (school_id) => {
  const response = await axios.get(
    `${GW_URL}/schools/${school_id}/getClassId`,
    adminConfig
  );
  return response.data;
};

export default useSchoolData;
