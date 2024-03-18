import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { GW_URL, adminConfig } from "../config";
export const ALL_NOTIFICATION_FETCH_KEY = "notification-list";

const fetchNotification = (school_id) => {
  return axios.get(
    `${GW_URL}/schools/${school_id}/getAllNotification`,
    adminConfig
  );
  // let allRows = [];
  // for(let i = 0; i < data?.data?.notifications.length; i++){
  //   var tomorrow =  new Date(data.data.notifications[i].created_on);
  //   tomorrow.setDate(tomorrow.getDate() + 1);
  //   let dateString = tomorrow.toISOString();
  //   let date = dateString.slice(8,10) + "-" + dateString.slice(5,7) + "-" + dateString.slice(0,4);
  //   data.data.notifications[i].created_on = date;
  //   allRows.push(data.data.notifications[i]);
  // }
  // return allRows;
};
const transformNotifications = (data) => {
  const transformedData = data?.data?.notifications.map((notification) => ({
    ...notification,
    created_on: new Date(notification.created_on)
      .toISOString()
      .slice(0, 10)
      .split("-")
      .reverse()
      .join("-"),
  }));
  return transformedData;
};
const useFetchNotifications = (school_id) => {
  const { isLoading, isError, data, error } = useQuery({
    queryKey: [ALL_NOTIFICATION_FETCH_KEY, school_id],
    queryFn: () => fetchNotification(school_id),
    transformResponse: transformNotifications,
  });

  return { isLoading, isError, data, error };
};
export default useFetchNotifications;
