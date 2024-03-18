import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { GW_URL, adminConfig } from "../config";
export const ALL_PARENTS_TICKET_KEY = "all-parents-ticket";

const fetchTickets = (status, created_on, school_id) => {
  if (created_on && school_id) {
    return axios.get(
      `${GW_URL}/ticket/getParentsTicketStatus?status=${status}&created_on=${created_on}&school_id=${school_id}`,
      adminConfig
    );
  } else if (created_on) {
    return axios.get(
      `${GW_URL}/ticket/getParentsTicketStatus?status=${status}&created_on=${created_on}`,
      adminConfig
    );
  } else if (school_id) {
    return axios.get(
      `${GW_URL}/ticket/getParentsTicketStatus?status=${status}&school_id=${school_id}`,
      adminConfig
    );
  } else {
    return axios.get(
      `${GW_URL}/ticket/getParentsTicketStatus?status=${status}`,
      adminConfig
    );
  }
};

const useFetchParentsTickets = (status, created_on, school_id) => {
  const { isLoading, isError, data, error } = useQuery({
    queryKey: [ALL_PARENTS_TICKET_KEY, status, created_on, school_id],
    queryFn: () => fetchTickets(status, created_on, school_id),
  });

  return { isLoading, isError, data, error };
};
export default useFetchParentsTickets;
