"use client";
import { useEffect, useState } from "react";

export const calculateCountdown = (minute, second) => {
    let totalSeconds = parseInt(minute) * 60 + parseInt(second);

    if (totalSeconds <= 0) {
      return { minutes: "00", seconds: "00" };
    }
    totalSeconds--;

    return {
      minutes: String(Math.floor(totalSeconds / 60)).padStart(2, "0"),
      seconds: String(totalSeconds % 60).padStart(2, "0"),
    };
  };

  export function useUserActivity() {
    const [userActivity, setUserActivity] = useState(false);
  
    useEffect(() => {
      const handleUserActivity = () => setUserActivity(true);
      window.addEventListener("mousemove", handleUserActivity);
      window.addEventListener("keydown", handleUserActivity);
      window.addEventListener("click", handleUserActivity);
      window.addEventListener("scroll", handleUserActivity);
  
      return () => {
        window.removeEventListener("mousemove", handleUserActivity);
        window.removeEventListener("keydown", handleUserActivity);
        window.removeEventListener("click", handleUserActivity);
        window.removeEventListener("scroll", handleUserActivity);
      };
    }, []);
  
    return { userActivity, resetActivity: () => setUserActivity(false) };
  }
  