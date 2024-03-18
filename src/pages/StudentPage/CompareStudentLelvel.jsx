import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import {
  adminConfig,
  GW_URL,
  currentYear,
  currentMonth,
  months,
  subjectIdMap,
} from "../../config";
import axios from "axios";
import StepChart from "../../components/StepChart/StepChart";
import { isContentEditable } from "@testing-library/user-event/dist/utils";
import "./CompareStudentLevel.scss";

const convertDataToResult = (data) => {
  const result = [];

  data.forEach((entry) => {
    entry.subject_ids.forEach((subject_id, index) => {
      const subjectIndex = result.findIndex(
        (item) => item.subject_id === subject_id
      );

      if (subjectIndex === -1) {
        result.push({
          subject_id: subject_id,
          studentLevel: [
            {
              month: months[entry.month - 1].month_name,
              level: entry.levels[index],
            },
          ],
        });
      } else {
        result[subjectIndex].studentLevel.push({
          month: months[entry.month - 1].month_name,
          level: entry.levels[index],
        });
      }
    });
  });

  const sortedData = result?.sort((a, b) => a.subject_id - b.subject_id);

  sortedData.forEach((item) => {
    // Sort the studentLevel array based on the months
    item.studentLevel.sort((a, b) => {
      const monthOrder = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ];
      return monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month);
    });
  });
  return sortedData;
};

const CompareStudentLelvel = ({ school_id, student_id, class_id, medium }) => {
  const [studentLelveList, setStudentLevelList] = useState([]);

  const getStudentLevel = () => {
    console.log(
      `${GW_URL}/schools/${school_id}/getStudentLevel?student_id=${student_id}&year=${currentYear}`
    );
    axios
      .get(
        `${GW_URL}/schools/${school_id}/getStudentLevel?student_id=${student_id}&year=${currentYear}
      &class_id=${class_id}&medium=${medium}`,
        adminConfig
      )
      .then((res) => {
        console.log(res.data.studentLevel);

        setStudentLevelList(convertDataToResult(res.data?.studentLevel));
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    getStudentLevel();
  }, []);

  return (
    <div className="level-graph">
      {studentLelveList?.map((item, index) => (
        <div key={index} className="container">
          <div className="heading">
            <span className="head">{subjectIdMap[item.subject_id]}</span>
          </div>
          <div className="content">
            <StepChart
              key={index}
              data={item.studentLevel}
              subject_id={item.subject_id}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default CompareStudentLelvel;
