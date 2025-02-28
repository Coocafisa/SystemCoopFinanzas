"use client";
import { useEffect, useState } from "react";
import { logout } from "@/api/requestServices/logout";
import { getSession } from "@/api/requestServices/sessionService";
import AlertPopup from "../common/alert";
import "@styles/alertInativity.css";
import { calculateCountdown, useUserActivity } from "../utils/timerUtils";
import { refreshToken } from "@/api/requestServices/generalServices";

const SESSION_STATES = {
  ACTIVE: "active",
  INACTIVE: "inactive",
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

  const { timer: currentTimer, updateTimer } = useTimer(timeRemaining);

  useEffect(() => {
    if (sessionState === SESSION_STATES.EXPIRED) return;

    const intervalId = setInterval(() => {
      updateTimer((newTime) => {
        const { minutes, seconds } = newTime;

        if (parseInt(minutes) === 1 && parseInt(seconds) === 40 && userActivity) {
          if (!updateSession) {
            refreshSession();
            setUpdateSession(true);
          }
          resetActivity();
        } else if (minutes === "00" && seconds === "40") {
          setSessionState(SESSION_STATES.INACTIVE);
        } else if (minutes === "00" && seconds === "00") {
          setSessionState(SESSION_STATES.EXPIRED);
          clearInterval(intervalId);
        }
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [sessionState, userActivity, updateSession ]);

  const refreshSession = async () => {
      const result = await refreshToken();
        if (result?.status === 200) {
        const sessionData = await getSession();
        if (sessionData?.timeRemaining) {
          setSessionState(SESSION_STATES.ACTIVE);
          setTimer(sessionData.timeRemaining);
        }
      }
  };

  const handleLogout = async () => {
    setSessionState(SESSION_STATES.EXPIRED);
    await logout();
  };

  const timeClass =
    currentTimer.minutes === "00" && currentTimer.seconds <= "30"
      ? "time-critical"
      : "";

  return (
    <>
      {sessionState === SESSION_STATES.INACTIVE && (
        <div className="blocking-layer">
          <AlertPopup
            message="Llevas mucho tiempo inactivo. ¿Deseas continuar navegando en la aplicación?"
            type="info"
          >
            <div className="alert_text">
              <p>La sesión expirará en:</p>
            </div>
            <div className="timer-container" aria-label="polite">
              <div className={`time-box ${timeClass}`} role="timer">
                <span id="seconds">{currentTimer.seconds}</span>
                <span className="label-timer">Segundos</span>
              </div>
            </div>
            <div className="alert-buttons">
              <button onClick={handleLogout}>No</button>
              <button onClick={refreshSession}>Sí</button>
            </div>
          </AlertPopup>
        </div>
      )}

      {sessionState === SESSION_STATES.EXPIRED && (
        <div className="blocking-layer">
          <AlertPopup
            message="Has tardado mucho. Vuelve a iniciar sesión para continuar navegando."
            type="info"
          >
            <button onClick={handleLogout}>Aceptar</button>
          </AlertPopup>
        </div>
      )}
    </>
  );
};