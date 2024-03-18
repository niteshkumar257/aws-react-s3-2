import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { ALL_NOTIFICATION_FETCH_KEY } from "./useFetchNotifications";
import { GW_URL, adminConfig } from "../config";

const addNotification = ({ installemtNo, school_id }) => {
  return axios.post(
    `${GW_URL}/schools/${school_id}/pushNotification`,
    {
      installment_no: installemtNo,
    },
    adminConfig
  );
};
export const useAddNotification = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addNotification,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [ALL_NOTIFICATION_FETCH_KEY],
      });
    },
  });
};
