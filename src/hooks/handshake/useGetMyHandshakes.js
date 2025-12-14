
import { useQuery } from "@tanstack/react-query"
import { getMyHandshakes } from "../../api/handshakeApi"



export const useGetMyHandshakes = () => {

    return useQuery({
        queryFn: getMyHandshakes,
        queryKey: ["handshakes"],
        staleTime: 1000 * 60 * 5,
        refetchOnWindowFocus: true
    });

}