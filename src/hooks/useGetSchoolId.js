import { useState, useEffect } from 'react';
import jwt_decode from 'jwt-decode';

const useSchoolId = () => {
  const [schoolId, setSchoolId] = useState(null);

  useEffect(() => {
    const auth_token = localStorage.getItem("auth_token");
    const superadmin_school = localStorage.getItem("superadmin_school");

    let decodedSchoolId = null;

    if (superadmin_school === null && auth_token) {
      const decodeToken = jwt_decode(auth_token);
      decodedSchoolId = decodeToken.result.school_id;
    } else {
      decodedSchoolId = superadmin_school;
    }

    setSchoolId(decodedSchoolId);
  }, []);

  return schoolId;
};

export default useSchoolId;
