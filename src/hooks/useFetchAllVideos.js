import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { GW_URL, superAdminConfig } from "../config";

export const ALL_VIDEOS_KEY = "all-videos";

const useFetchAllVideos = () => {
  const { isLoading, isError, data } = useQuery({
    queryKey: [ALL_VIDEOS_KEY],
    queryFn: () => axios.get(`${GW_URL}/videos/getAllVideo`, superAdminConfig),
  });
  return { isLoading, isError, data };
};

export default useFetchAllVideos;
