import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { GW_URL, adminConfig } from "../config";
export const ALL_ISSUE_MESSAGE_KEY = "all-issue-message";

const fetchMessage = (ticket_id, sender, receiver, parents_id, teacher_id) => {
  return axios.get(
    `${GW_URL}/issueMessages/${ticket_id}/${sender}/${receiver}/${parents_id}/${teacher_id}`,
    adminConfig
  );
};

const useFetchIssueMessage = (
  ticket_id,
  sender,
  receiver,
  parents_id,
  teacher_id
) => {
  const { isLoading, isError, data, error } = useQuery({
    queryKey: [
      ALL_ISSUE_MESSAGE_KEY,
      ticket_id,
      sender,
      receiver,
      parents_id,
      teacher_id,
    ],
    queryFn: () =>
      fetchMessage(ticket_id, sender, receiver, parents_id, teacher_id),
  });

  return { isLoading, isError, data, error };
};
export default useFetchIssueMessage;
