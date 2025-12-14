import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";



export default function useLogout() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return () => {
    // Clear auth
    localStorage.removeItem("token");

    // Clear all cached queries
    queryClient.clear();

    // Navigate
    navigate("/login");
  };
}