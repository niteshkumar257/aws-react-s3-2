import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { GW_URL, superAdminConfig } from "../config";

export const ALL_PROMOTIONAL_VIDEOS_KEY = "all-promotional-videos";

const useFetchAllPromotionalVideo = () => {
  const { isLoading, isError, data } = useQuery({
    queryKey: [ALL_PROMOTIONAL_VIDEOS_KEY],
    queryFn: () =>
      axios.get(`${GW_URL}/videos/getAllPromotionalVideo`, superAdminConfig),
  });
  return { isLoading, isError, data };
};

export default useFetchAllPromotionalVideo;
