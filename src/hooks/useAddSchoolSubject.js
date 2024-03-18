import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SCHOOL_SUBJECTS_CLASS } from "./useGetClassWiseSubject";
import { GW_URL, adminConfig } from "../config";

const updateSubjectList = async ({ classId, subjectList, school_id }) => {
  
    const response = await axios.post(
        `${GW_URL}/school/${school_id}/addSchoolSubject`,
        {
            class_id: classId,
            subject_id: subjectList,
        },
        adminConfig
    );
    
    return response;
};

const useUpdateSubjectList = (school_id) => {
    const queryClient = useQueryClient();

    const {mutate, isLoading, isError, error } = useMutation(
        {
       mutationFn:updateSubjectList,
        onSuccess: () => {
            queryClient.invalidateQueries([SCHOOL_SUBJECTS_CLASS, school_id]);

        },
    });

    return {
        updateClassSubject:mutate,
        isLoading,
        isError,
        error,
    };
};

export default useUpdateSubjectList;
