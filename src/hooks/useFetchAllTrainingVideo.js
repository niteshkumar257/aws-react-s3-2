import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { GW_URL, superAdminConfig } from "../config";

export const ALL_TRAINING_VIDEOS_KEY = "all-training-videos";

const useFetchAllTraningVideos = () => {
  const { isLoading, isError, data } = useQuery({
    queryKey: [ALL_TRAINING_VIDEOS_KEY],
    queryFn: () =>
      axios.get(`${GW_URL}/videos/getAllTrainingVideos`, superAdminConfig),
  });
  return { isLoading, isError, data };
};

export default useFetchAllTraningVideos;
