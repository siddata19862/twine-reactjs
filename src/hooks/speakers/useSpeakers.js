import { useQuery } from "@tanstack/react-query";
import { getSpeakers } from "../../api/speakerApi";



export const useSpeakers = () => {
  return useQuery({
    queryKey: ["speakers"],
    queryFn: getSpeakers,
    staleTime: 1000 * 60 * 5, // cache for 5 min
  });
};