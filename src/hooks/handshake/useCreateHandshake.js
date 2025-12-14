// hooks/useCreateHandshake.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createHandshake } from "../../api/handshakeApi";


export const useCreateHandshake = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createHandshake,
    onSuccess: ()=>{
      console.log("invalidating handshakes")
      queryClient.invalidateQueries(["handshakes"]);
      
    }
  });
};