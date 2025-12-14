// hooks/useSpeaker.js
import { useQuery } from "@tanstack/react-query";
import { getSpeakerById } from "../../api/speakerApi";


export const useSpeaker = (id) => {
  return useQuery({
    queryKey: ["speaker", id],  // unique cache per speaker
    queryFn: () => getSpeakerById(id),
    enabled: !!id,              // runs only when id exists
    staleTime: 1000 * 60 * 5,
  });
};