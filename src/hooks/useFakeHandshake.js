// hooks/useFakeHandshake.js
import { useState } from "react";

export default function useFakeHandshake() {
  const [loading, setLoading] = useState(false);

  const sendRequest = () => {
    setLoading(true);

    return new Promise((resolve) => {
      setTimeout(() => {
        setLoading(false);
        resolve("pending"); // fake new status from server
      }, 1800); // 1.8 sec fake delay
    });
  };

  return { loading, sendRequest };
}