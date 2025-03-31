"use client";
import { useEffect, useState } from "react";
import { getSession } from "@/api/requestServices/sessionService";
import AlertPopup from "../common/alert";
import "@styles/alertInativity.css";
import { calculateCountdown, useUserActivity } from "../utils/timerUtils";
import { refreshToken } from "@/api/requestServices/generalServices";

const SESSION_STATES = {
  ACTIVE: "active",
  EXPIRED: "expired",
};

export default function InactivityHandler({ timeRemaining }) {
  const [sessionState, setSessionState] = useState(SESSION_STATES.ACTIVE);
  const [timer, setTimer] = useState({ minutes: "00", seconds: "00" });
  const { userActivity, resetActivity } = useUserActivity();
  const [updateSession, setUpdateSession] = useState(false);

  const useTimer = (initialTime) => {
    useEffect(() => {
      setTimer(initialTime || { minutes: "00", seconds: "00" });
    }, [initialTime]);

    const updateTimer = (callback) => {
      setTimer((prev) => {
        const newTime = calculateCountdown(prev.minutes, prev.seconds);
        callback(newTime);
        return newTime;
      });
    };

    return { timer, updateTimer };
  };

  const { updateTimer } = useTimer(timeRemaining);

  useEffect(() => {
    if (sessionState === SESSION_STATES.EXPIRED) return;

    const intervalId = setInterval(() => {
      updateTimer((newTime) => {
        const { minutes, seconds } = newTime;

        if (parseInt(minutes) < 1 && userActivity) {
          if (!updateSession) {
            refreshSession();
            setUpdateSession(true);
          }
          resetActivity();
        } else if (minutes === "00" && seconds === "00") {
          setSessionState(SESSION_STATES.EXPIRED);
          clearInterval(intervalId);
        } else {
          setSessionState(SESSION_STATES.ACTIVE);
        }
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [sessionState, userActivity, updateSession ]);

  const refreshSession = async () => {
    try {
      const result = await refreshToken();
      if (result?.status === 200) {
        const sessionData = await getSession();
        if (sessionData?.timeRemaining) {
          setSessionState(SESSION_STATES.ACTIVE);
          setTimer(sessionData.timeRemaining);
        }
      }
    } catch (error) {
      return [];
    }
  };

  return (
    <>
      {sessionState === SESSION_STATES.EXPIRED && (
        <div className="blocking-layer">
          <AlertPopup
            message="Has tardado mucho. Vuelve a iniciar sesión para continuar navegando."
            type="info"
          >
            <button onClick={() => (window.location.href = "/")}>Aceptar</button>
          </AlertPopup>
        </div>
      )}
    </>
  );
};