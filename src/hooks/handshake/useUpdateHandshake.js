import { useMutation, useQueryClient } from "@tanstack/react-query"
import { updateHandshakeStatus } from "../../api/handshakeApi"

export const useUpdateHandshakeStatus = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn:({id,status})=>{
            return updateHandshakeStatus(id,status);
        },
        onSuccess:()=>{
            //console.log("finished!",Math.random());
            //await new Promise(r => setTimeout(r, 200)); // 200ms delay
            //alert("@");
            queryClient.invalidateQueries(["handshakes"]);
        },
        onError:()=>{}
        
    })

}