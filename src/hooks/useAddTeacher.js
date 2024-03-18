import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { ALL_TEACHER_FETCH_KEY } from "./useFetchTeacher";
import { GW_URL, adminConfig } from "../config";

const addTeacher = ({
  school_id,
  teacher_name,
  age,
  mobile,
  email,
  gender,
  medium,
  date,
  subject_id,
  city,
  class_ids,
  formData,
  experience,
  salary,
}) => {
  return axios.post(
    `${GW_URL}/schools/${school_id}/addtecher?teacher_name=${teacher_name}&age=${age}&mobile=${mobile}&email=${email}&gender=${gender}&medium=${medium}&date=${date}&experience=${experience}&salary=${salary}&subject_id=${subject_id}&city=${city}&class_ids=${class_ids}`,
    formData,
    adminConfig
  );
};
export const useAddTeacher = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addTeacher,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ALL_TEACHER_FETCH_KEY],
      });
    },
  });
};
