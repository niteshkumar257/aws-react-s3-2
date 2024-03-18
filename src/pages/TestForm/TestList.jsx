import React, { useEffect, useState } from "react";
import useFetchSchoolTest from "../../hooks/useFetchSchoolTests";
import {
  TestListColumn,
  getAdminDetails,
  formatTimeToDDMMYYYY,
  subjectJson,
} from "../../config";
import DataGridWithToolTrip from "../../components/DataGrid/DataGridWithToolTrip";
import "./TestForm.scss";
import DataTable from "../../components/DataTable/DataTable";

const TestList = () => {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const { school_id } = getAdminDetails();
  const { isLoading, isError, data } = useFetchSchoolTest(school_id);

  useEffect(() => {
    if (!isLoading) {
      let allData = data.data.allTestDetails;
      let allRowData = [];
      for (let i = 0; i < allData.length; i++) {
        let allSubjectName = [];
        for (let key in allData[i].subject_marks) {
          allSubjectName.push(subjectJson[key]);
        }
        allRowData.push({
          ...allData[i],
          id: i + 1,
          test_date: formatTimeToDDMMYYYY(new Date(allData[i].test_date)),
          subject_name: allSubjectName,
        });
      }
      setRows(allRowData);
      setLoading(false);
    }
  }, [isLoading, data]);

  return (
    <div style={{ margin: "15px" }}>
      <DataTable rows={rows} columns={TestListColumn} loader={loading} />
    </div>
  );
};

export default TestList;
