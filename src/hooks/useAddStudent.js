import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { ALL_STUDENT_FETCH_KEY } from "./useFetchAllStudent";
import { GW_URL, adminConfig } from "../config";

const addStudent = ({
  school_id,
  name,
  gender,
  date,
  Address,
  classId,
  course,
  medium,
  board,
  Fathername,
  FatherProfession,
  MotherName,
  MotherProfession,
  PrimaryNumber,
  AlternateNumber,
  firstInstallMentAmount,
  firstInstallMentStatus,
  firstInsallMentEta,
  secondInstallMentStatus,
  secondInsallMentEta,
  secondInstallMentAmount,
  thirdInstallMentAmount,
  thirdInstallMentStatus,
  thirdInsallMentEta,
  AadharNumber,
  first_installment_submit,
  second_installment_submit,
  third_installment_submit,
  email,
  totalFees,
  formData,
}) => {
  return axios.post(
    `${GW_URL}/schools/${school_id}/addStudent?student_name=${name}&gender=${gender}&dob=${date}&address=${Address}&class_id=${classId}&course_name=${course}&medium=${medium}&board=${board}&father_name=${Fathername}&father_profession=${FatherProfession}&mother_name=${MotherName}&mother_profession=${MotherProfession}&whatsapp_no=${PrimaryNumber}&alternative_mobile=${AlternateNumber}&email=${email}&total_fees=${totalFees}&first_installment=${firstInstallMentAmount}&first_installment_eta=${firstInsallMentEta}&first_installment_status=${firstInstallMentStatus}&second_installment=${secondInstallMentAmount}&second_installment_eta=${secondInsallMentEta}&second_installment_status=${secondInstallMentStatus}&third_installment=${thirdInstallMentAmount}&third_installment_eta=${thirdInsallMentEta}&third_installment_status=${thirdInstallMentStatus}&aadhar_no=${AadharNumber}&first_installment_submit=${first_installment_submit}&second_installment_submit=${second_installment_submit}&third_installment_submit=${third_installment_submit}`,
    formData,
    adminConfig
  );
};
export const useAddStudent = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addStudent,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ALL_STUDENT_FETCH_KEY],
      });
    },
  });
};
